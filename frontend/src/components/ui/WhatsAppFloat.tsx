"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Bot, Sparkles, RefreshCw } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am the **CampusConnect AI Assistant** for Sri Satya Institute.\n\nAsk me about B.Tech departments, fees, placement packages, scholarships, or hostel facilities. How can I help you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // WhatsApp Simulated Session States
  const [phoneInput, setPhoneInput] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    let storedPhone = localStorage.getItem("whatsapp_user_phone");
    if (!storedPhone) {
      storedPhone = `Visitor-${Math.floor(1000 + Math.random() * 9000)}`;
      localStorage.setItem("whatsapp_user_phone", storedPhone);
    }
    setWhatsappPhone(storedPhone);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Poll conversation history from server
  useEffect(() => {
    if (!whatsappPhone || !isOpen) return;

    const fetchHistory = async () => {
      try {
        const apiBase = getApiBase();
        const res = await fetch(`${apiBase}/api/v1/whatsapp/session/${whatsappPhone}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && json.data.history) {
            const historyMsgs = json.data.history.map((m: any) => ({
              role: m.role,
              content: m.sender === "admin" ? `**[Admin Manual Response]**\n${m.content}` : m.content
            }));
            if (historyMsgs.length > 0) {
              setMessages(historyMsgs);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch WhatsApp history:", err);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 3000);
    return () => clearInterval(interval);
  }, [whatsappPhone, isOpen]);

  // Hide on admin console routes
  if (!mounted || pathname?.startsWith("/admin")) {
    return null;
  }

  const getApiBase = () => {
    const envVal = process.env.NEXT_PUBLIC_API_URL;
    if (!envVal) return "http://localhost:8000";
    if (envVal.includes(",")) return envVal.split(",")[0].trim();
    return envVal.trim();
  };

  const handleConnectPhone = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneInput.replace(/\D/g, "");
    if (cleaned.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    localStorage.setItem("whatsapp_user_phone", cleaned);
    setWhatsappPhone(cleaned);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // If not logged in, ignore send
    if (!whatsappPhone) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/api/v1/whatsapp/session/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: whatsappPhone,
          message: text
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.detail || "Failed to send message to assistant.");
      }

      if (json.success && json.data && json.data.history) {
        const historyMsgs = json.data.history.map((m: any) => ({
          role: m.role,
          content: m.sender === "admin" ? `**[Admin Manual Response]**\n${m.content}` : m.content
        }));
        setMessages(historyMsgs);
      }
    } catch (err: any) {
      console.error("[ChatBot-Web] Error query:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I am having trouble connecting to the CampusConnect servers right now. Please try again in a moment."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (query: string) => {
    handleSendMessage(query);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Floating Chat Popup Window */}
      {isOpen && (
        <div
          className="mb-4 w-[360px] sm:w-[400px] h-[550px] max-h-[80vh] rounded-3xl overflow-hidden border flex flex-col shadow-2xl animate-fadeIn transition-all duration-300 transform origin-bottom-right"
          style={{
            background: "rgba(9, 13, 22, 0.95)",
            backdropFilter: "blur(24px) saturate(200%)",
            WebkitBackdropFilter: "blur(24px) saturate(200%)",
            borderColor: "rgba(255, 255, 255, 0.08)",
            boxShadow: "0 24px 64px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
          }}
        >
          {/* Popup Header with Liquid Glass Gradient */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#075e54] to-[#128c7e] text-white flex items-center justify-between shadow-sm relative border-b border-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 relative shadow-inner">
                {/* Custom WhatsApp Icon inside Header */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5.5 h-5.5 text-white">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.054L2 22l5.077-1.331a9.907 9.907 0 004.933 1.309h.005c5.505 0 9.988-4.478 9.99-9.984A9.972 9.972 0 0012.012 2zm4.7 13.991c-.26.732-1.285 1.332-1.782 1.41-.497.078-.992.115-3.19-.773a11.517 11.517 0 01-4.817-4.225c-.56-.745-1.002-1.611-1.002-2.502 0-1.802.946-2.686 1.285-3.023.34-.337.745-.422.993-.422.248 0 .497.003.712.013.232.01.522-.09.815.61.298.711 1.016 2.476 1.104 2.656.088.18.147.39.028.627-.118.237-.179.37-.356.577-.177.206-.372.46-.532.617-.18.176-.369.367-.159.728.21.36.932 1.54 2.0 2.49 1.377 1.229 2.535 1.61 2.894 1.787.36.177.568.148.78-.098.21-.247.915-1.066 1.162-1.433.248-.367.496-.307.828-.184.33.123 2.102 1.033 2.462 1.213.36.18.6.27.69.426.09.156.09.905-.17 1.637z"/>
                </svg>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#128c7e] rounded-full animate-pulse" />
              </div>
              <div className="text-left">
                <h3 className="font-display font-extrabold text-sm tracking-wide leading-none flex items-center gap-1">
                  CampusConnect AI <Sparkles className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
                </h3>
                <span className="text-[10px] text-emerald-100 font-semibold mt-1 block">
                  Admissions Office (Live)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  if (confirm("This will clear your conversation history and start a new chat. Proceed?")) {
                    localStorage.removeItem("whatsapp_user_phone");
                    const newPhone = `Visitor-${Math.floor(1000 + Math.random() * 9000)}`;
                    localStorage.setItem("whatsapp_user_phone", newPhone);
                    setWhatsappPhone(newPhone);
                    setMessages([
                      {
                        role: "assistant",
                        content: "Hello! I am the **CampusConnect AI Assistant** for Sri Satya Institute.\n\nAsk me about B.Tech departments, fees, placement packages, scholarships, or hostel facilities. How can I help you today?"
                      }
                    ]);
                  }
                }}
                title="Clear Chat History"
                className="p-1.5 hover:bg-white/15 active:bg-white/25 rounded-full transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-emerald-100" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/15 active:bg-white/25 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-slate-950">
            {messages.map((msg, idx) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={idx}
                  className={`flex ${isAssistant ? "justify-start" : "justify-end"} animate-fadeIn`}
                >
                  <div className={`flex gap-2.5 max-w-[85%] ${isAssistant ? "flex-row" : "flex-row-reverse"}`}>
                    {isAssistant && (
                      <div className="w-7 h-7 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm border border-white/20">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed text-left whitespace-pre-wrap select-text transition-all ${
                        isAssistant
                          ? "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm font-medium"
                          : "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-tr-none shadow-md font-bold"
                      }`}
                    >
                      {/* Simple markdown parsing for bold text */}
                      {msg.content.split("\n\n").map((paragraph, pIdx) => (
                        <p key={pIdx} className={pIdx > 0 ? "mt-2" : ""}>
                          {paragraph.split("**").map((part, partIdx) =>
                            partIdx % 2 === 1 ? <strong key={partIdx} className="font-extrabold text-white">{part}</strong> : part
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Dynamic Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex gap-2.5 max-w-[85%] flex-row">
                  <div className="w-7 h-7 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm border border-white/20">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div
                    className="p-3.5 rounded-2xl text-xs bg-slate-900 border border-slate-800 text-slate-200 shadow-sm rounded-tl-none flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Pills */}
          {messages.length === 1 && (
            <div className="px-5 pb-3 pt-1.5 flex flex-wrap gap-1.5 justify-start bg-slate-950">
              {[
                "What is B.Tech CSE fee?",
                "What scholarships can I get?",
                "What was the highest placement package?",
                "Tell me about hostel details"
              ].map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 hover:text-white font-bold rounded-full transition-all cursor-pointer shadow-xs"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Glassy Input Bar Area */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
              placeholder="Ask a question about the college..."
              className="flex-grow py-2.5 px-4 rounded-xl border border-slate-880 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-slate-950 text-white font-medium shadow-inner placeholder-slate-500"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={isLoading || !inputValue.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-40"
            >
              {isLoading ? (
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <Send className="w-4.5 h-4.5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Glow + Pulse Floating Button Trigger */}
      {!isOpen && (
        <div className="relative group">
          {/* Tooltip bubble on hover */}
          <div
            className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 px-4 py-2.5 rounded-2xl border text-xs font-bold shadow-lg transition-all duration-300 transform origin-right whitespace-nowrap ${
              showTooltip
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 translate-x-4 scale-95 pointer-events-none"
            }`}
            style={{
              background: "rgba(9,13,22,0.9)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              borderColor: "rgba(255,255,255,0.08)",
              color: "#f8fafc",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)"
            }}
          >
            Chat with CampusConnect AI
            <div
              className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0"
              style={{
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: "6px solid rgba(9,13,22,0.9)"
              }}
            />
          </div>

          {/* Pulse animation rings */}
          <div
            className="absolute -inset-2 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(37,211,102,0.2) 0%, transparent 70%)",
              animation: "chatbot-pulse 2s ease-in-out infinite"
            }}
          />

          {/* Actual button */}
          <button
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="relative flex items-center justify-center w-14 h-14 rounded-full text-white cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
              boxShadow: "0 8px 32px rgba(37,211,102,0.35), 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.15)",
              animation: "chatbot-float 3s ease-in-out infinite"
            }}
          >
            {/* High-quality WhatsApp SVG Icon */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.054L2 22l5.077-1.331a9.907 9.907 0 004.933 1.309h.005c5.505 0 9.988-4.478 9.99-9.984A9.972 9.972 0 0012.012 2zm4.7 13.991c-.26.732-1.285 1.332-1.782 1.41-.497.078-.992.115-3.19-.773a11.517 11.517 0 01-4.817-4.225c-.56-.745-1.002-1.611-1.002-2.502 0-1.802.946-2.686 1.285-3.023.34-.337.745-.422.993-.422.248 0 .497.003.712.013.232.01.522-.09.815.61.298.711 1.016 2.476 1.104 2.656.088.18.147.39.028.627-.118.237-.179.37-.356.577-.177.206-.372.46-.532.617-.18.176-.369.367-.159.728.21.36.932 1.54 2.0 2.49 1.377 1.229 2.535 1.61 2.894 1.787.36.177.568.148.78-.098.21-.247.915-1.066 1.162-1.433.248-.367.496-.307.828-.184.33.123 2.102 1.033 2.462 1.213.36.18.6.27.69.426.09.156.09.905-.17 1.637z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Styled JSX Keyframes */}
      <style jsx>{`
        @keyframes chatbot-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes chatbot-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
