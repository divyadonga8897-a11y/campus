from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.database.connection import get_db
from app.schemas.schemas import ApiResponse
from app.services.rag_service import RagService

router = APIRouter(prefix="/api/v1/chat", tags=["AI Chat Assistant"])
rag_service = RagService()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

@router.post("", response_model=ApiResponse[str])
def post_chat_query(payload: ChatRequest, db: Session = Depends(get_db)):
    if not payload.message:
        raise HTTPException(status_code=400, detail="Query message cannot be empty")
    
    # Map pydantic history models back to simple dict arrays for service layer
    history_list = [{"role": h.role, "content": h.content} for h in payload.history]
    
    response_text = rag_service.query_assistant(payload.message, history_list, db)
    return ApiResponse(data=response_text)
