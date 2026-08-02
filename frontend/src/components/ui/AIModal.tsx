"use client";

import { useState, useRef, useEffect } from "react";
import { chatService, type ChatMessage } from "@/services/chatService";
import { Sparkles, Send, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
}

const suggestionChips = [
  "What are the fees for B.Tech CSE?",
  "Are there sports scholarships?",
  "What is the highest placement package?",
  "Tell me about the hostel mess.",
];

export default function AIModal({ isOpen, onClose, initialQuestion }: AIModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const initialSentRef = useRef(false);

  // Monitor Escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && initialQuestion && !initialSentRef.current) {
      setTimeout(() => {
        handleSend(initialQuestion);
      }, 300);
      initialSentRef.current = true;
    }
    if (!isOpen) {
      initialSentRef.current = false;
    }
  }, [isOpen, initialQuestion]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Welcome to the SSIET Campus AI Assistant! Ask me anything about courses, fees, scholarships, or hostel life.",
        },
      ]);
    }
  }, [isOpen, messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setLoading(true);

    try {
      const historyToSend = messages.slice(1);
      const res = await chatService.sendMessage(text, historyToSend);
      setMessages((prev) => [...prev, { role: "assistant", content: res.data }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I am experiencing connection issues. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Campus AI Assistant"
    >
      <div 
        className="w-full max-w-2xl h-[560px] glass-modal rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Block */}
        <div className="px-6 py-4 border-b border-slate-200/50 flex items-center justify-between bg-white/50 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/10 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left">
              <h3 className="font-display font-extrabold text-sm text-text-dark">Ask Campus AI</h3>
              <p className="text-[10px] text-text-gray font-medium">Verify academics, fee details, and hostel guidelines</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            id="close-ai-modal"
            className="p-1.5 rounded-full hover:bg-slate-100 text-text-gray hover:text-text-dark cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-slate-50/30">
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div 
                key={i} 
                className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Profile Badge Indicator */}
                {!isUser ? (
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-primary shrink-0 text-xs font-bold font-mono">
                    AI
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-text-gray shrink-0 text-xs font-bold font-mono">
                    U
                  </div>
                )}

                {/* Bubble Container */}
                <div 
                  className={`rounded-2xl p-4 text-xs font-sans leading-relaxed text-left ${
                    isUser 
                      ? "bg-primary text-white shadow-sm shadow-primary/10" 
                      : "bg-white text-text-dark border border-slate-100 shadow-sm"
                  }`}
                >
                  {msg.content.split("**").map((chunk, idx) =>
                    idx % 2 === 1 ? <strong key={idx} className={isUser ? "font-extrabold text-white" : "font-extrabold text-primary"}>{chunk}</strong> : chunk
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-primary shrink-0 text-xs font-bold font-mono">
                AI
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 border border-slate-100 shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Suggestion Chips & Message Input */}
        <div className="px-6 py-5 border-t border-slate-200/50 bg-white/50 backdrop-blur shrink-0 space-y-4">
          
          {/* Quick suggestions row */}
          {messages.length < 3 && !loading && (
            <div className="flex flex-wrap gap-2 justify-start">
              {suggestionChips.map((chip) => (
                <button 
                  key={chip} 
                  onClick={() => handleSend(chip)}
                  className="px-3.5 py-1.5 rounded-full text-[10px] font-bold text-text-gray bg-white hover:bg-slate-50 border border-slate-200/60 transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Form Message input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            className="flex items-center gap-2.5 bg-white border border-slate-200/80 rounded-full p-1.5 pl-4 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-300 shadow-sm"
          >
            <input
              id="ai-chat-input"
              type="text"
              required
              placeholder="Ask me anything about fees, placement, eligibility..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full focus:outline-none text-[11px] font-sans placeholder-slate-400 text-text-dark bg-transparent"
            />
            <Button 
              type="submit" 
              disabled={loading || !inputVal.trim()}
              variant="primary"
              className="!px-4 !py-2 bg-gradient-to-r from-primary to-indigo-600 border-none shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
