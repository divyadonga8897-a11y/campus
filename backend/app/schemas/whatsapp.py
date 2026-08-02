from pydantic import BaseModel
from typing import List, Optional, Any

class WasenderWebhookMessage(BaseModel):
    event: str
    sender: str  # WhatsApp phone number
    message: str  # Incoming message text
    timestamp: Optional[int] = None
    device_id: Optional[str] = None
    session_id: Optional[str] = None

class WhatsappMessageLogSchema(BaseModel):
    id: int
    phone_number: str
    query: str
    response: Optional[str] = None
    status: str
    timestamp: str
    latency: Optional[float] = None

    class Config:
        from_attributes = True

class WhatsappChatSessionSchema(BaseModel):
    phone_number: str
    history: List[Any]
    last_interaction: str
    session_context: Optional[Any] = None

    class Config:
        from_attributes = True

class WhatsappBotStatusSchema(BaseModel):
    connected: bool
    whatsapp_number: str
    device_status: str
    api_status: str
    session_status: str
    webhook_status: str
    today_messages: int
    monthly_messages: int
    active_conversations: int
    total_conversations: int
