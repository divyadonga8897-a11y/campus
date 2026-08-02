"""
WhatsApp RAG Chatbot Router
Handles incoming Wasender webhooks and admin analytics endpoints.
"""
import time
import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database.connection import get_db
from app.models.models import User, WhatsappChatSession, WhatsappMessageLog
from app.routers.auth import get_current_user
from app.services.wasender_service import WasenderService
from app.services.rag_service import RagService
from app.schemas.schemas import ApiResponse

router = APIRouter(prefix="/api/v1/whatsapp", tags=["WhatsApp Chatbot"])
wasender_service = WasenderService()
rag_service = RagService()

def verify_admin(current_user: User):
    if current_user.role not in ["super_admin", "ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Administrators only."
        )

@router.post("/webhook")
async def whatsapp_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Receives incoming webhook payloads from Wasender.
    Extracts sender phone number, message content, timestamp, message ID.
    Runs RAG pipeline and sends reply back via Wasender.
    """
    start_time = time.time()
    now_str = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    # Validate webhook signature if provided
    signature = request.headers.get("x-wasender-signature", "")
    if not wasender_service.validate_webhook(payload, signature):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    # Extract sender and message from various possible formats
    sender = (
        payload.get("sender") or payload.get("from") or payload.get("phone")
    )
    message_text = (
        payload.get("message") or payload.get("body") or payload.get("text")
    )
    message_id = payload.get("id") or payload.get("message_id") or ""
    msg_timestamp = payload.get("timestamp") or payload.get("t")
    
    # Handle nested data structure
    data_block = payload.get("data")
    if isinstance(data_block, dict):
        if not sender:
            sender = data_block.get("from") or data_block.get("sender") or data_block.get("phone")
        if not message_text:
            msg_obj = data_block.get("message") or data_block.get("body") or data_block.get("text")
            if isinstance(msg_obj, dict):
                message_text = msg_obj.get("body") or msg_obj.get("text") or msg_obj.get("conversation")
            elif isinstance(msg_obj, str):
                message_text = msg_obj
        if not message_id:
            message_id = data_block.get("id") or data_block.get("message_id") or ""

    if not sender or not message_text:
        return {"status": "ignored", "reason": "No sender or message found"}
        
    clean_sender = "".join(filter(str.isdigit, str(sender)))
    
    # Retrieve or create conversation session
    session = db.query(WhatsappChatSession).filter(
        WhatsappChatSession.phone_number == clean_sender
    ).first()
    
    if not session:
        session = WhatsappChatSession(
            phone_number=clean_sender,
            history=[],
            last_interaction=now_str,
            session_context={}
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        
    # Build conversation history for multi-turn context
    history_list = list(session.history) if session.history else []
    
    # Run through existing RAG pipeline
    try:
        reply = rag_service.query_assistant(
            prompt=str(message_text), 
            history=history_list, 
            db=db
        )
    except Exception as query_err:
        print(f"[WhatsApp-Webhook] RAG query failed: {query_err}")
        reply = "I'm sorry, I'm having trouble retrieving that information right now. Please try again."

    # Update conversation memory
    history_list.append({"role": "user", "content": str(message_text)})
    history_list.append({"role": "assistant", "content": reply})
    
    # Keep last 20 messages (10 turns) to prevent context overflow
    if len(history_list) > 20:
        history_list = history_list[-20:]
        
    session.history = history_list
    session.last_interaction = now_str
    
    # Send reply back through Wasender API
    send_success = wasender_service.send_text_message(
        to_number=clean_sender, 
        message=reply
    )
    
    latency = round(time.time() - start_time, 3)
    
    # Log the interaction to database
    log_item = WhatsappMessageLog(
        phone_number=clean_sender,
        query=str(message_text),
        response=reply,
        status="Success" if send_success else "Failed",
        timestamp=now_str,
        latency=latency
    )
    db.add(log_item)
    db.commit()
    
    return {
        "status": "success", 
        "sender": clean_sender, 
        "reply": reply,
        "latency": latency
    }

# ============================================================
# Admin Analytics Endpoints
# ============================================================

@router.get("/admin/status", response_model=ApiResponse[Dict[str, Any]])
def get_whatsapp_status(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    verify_admin(current_user)
    
    status_info = wasender_service.get_status()
    
    today_date = datetime.date.today().strftime("%Y-%m-%d")
    total_logs = db.query(WhatsappMessageLog).count()
    today_logs = db.query(WhatsappMessageLog).filter(
        WhatsappMessageLog.timestamp.like(f"{today_date}%")
    ).count()
    success_count = db.query(WhatsappMessageLog).filter(
        WhatsappMessageLog.status == "Success"
    ).count()
    failed_count = db.query(WhatsappMessageLog).filter(
        WhatsappMessageLog.status == "Failed"
    ).count()
    active_conversations = db.query(WhatsappChatSession).count()
    
    # Calculate average response time
    from sqlalchemy import func
    avg_latency = db.query(func.avg(WhatsappMessageLog.latency)).scalar()
    
    status_info.update({
        "today_messages": today_logs,
        "monthly_messages": total_logs,
        "successful_responses": success_count,
        "failed_responses": failed_count,
        "active_conversations": active_conversations,
        "total_conversations": active_conversations,
        "average_response_time": round(avg_latency or 0, 2),
        "webhook_status": "Active",
        "last_active": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    })
    
    return ApiResponse(success=True, data=status_info)

@router.get("/admin/conversations", response_model=ApiResponse[List[Dict[str, Any]]])
def get_whatsapp_conversations(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user),
    search: str = "",
    page: int = 1,
    limit: int = 20
):
    verify_admin(current_user)
    
    query = db.query(WhatsappChatSession)
    if search:
        query = query.filter(WhatsappChatSession.phone_number.like(f"%{search}%"))
    
    total = query.count()
    sessions = query.order_by(
        WhatsappChatSession.last_interaction.desc()
    ).offset((page - 1) * limit).limit(limit).all()
    
    res_list = []
    for s in sessions:
        last_msg = ""
        ai_reply = ""
        if s.history and len(s.history) >= 2:
            last_msg = s.history[-2].get("content", "")
            ai_reply = s.history[-1].get("content", "")
        elif s.history and len(s.history) == 1:
            last_msg = s.history[0].get("content", "")
            
        res_list.append({
            "phone_number": s.phone_number,
            "last_message": last_msg,
            "ai_reply": ai_reply,
            "last_interaction": s.last_interaction,
            "conversation_length": len(s.history) // 2 if s.history else 0,
            "total_messages": len(s.history) if s.history else 0
        })
        
    return ApiResponse(success=True, data=res_list)

@router.get("/admin/logs", response_model=ApiResponse[List[Dict[str, Any]]])
def get_whatsapp_logs(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user),
    search: str = "",
    page: int = 1,
    limit: int = 50
):
    verify_admin(current_user)
    
    query = db.query(WhatsappMessageLog)
    if search:
        query = query.filter(
            WhatsappMessageLog.phone_number.like(f"%{search}%") |
            WhatsappMessageLog.query.like(f"%{search}%")
        )
    
    total = query.count()
    logs = query.order_by(
        WhatsappMessageLog.timestamp.desc()
    ).offset((page - 1) * limit).limit(limit).all()
    
    res_list = []
    for l in logs:
        res_list.append({
            "id": l.id,
            "phone_number": l.phone_number,
            "query": l.query,
            "response": l.response,
            "status": l.status,
            "timestamp": l.timestamp,
            "latency": round(l.latency, 3) if l.latency else 0.0
        })
        
    return ApiResponse(success=True, data=res_list)
