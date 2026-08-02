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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

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

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Map format expected by /api/v1/chat endpoint
      const payloadHistory = messages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: payloadHistory
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.detail || "Failed to retrieve reply from assistant.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: json.data || "I couldn't generate a response." }
      ]);
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
            background: "rgba(255, 255, 255, 0.72)",
            backdropFilter: "blur(20px) saturate(190%)",
            WebkitBackdropFilter: "blur(20px) saturate(190%)",
            borderColor: "rgba(255, 255, 255, 0.28)",
            boxShadow: "0 24px 64px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)"
          }}
        >
          {/* Popup Header with Liquid Glass Gradient */}
          <div className="px-5 py-4 bg-gradient-to-tr from-emerald-600/90 to-teal-500/90 text-white flex items-center justify-between shadow-sm relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 relative shadow-inner">
                <Bot className="w-5.5 h-5.5 text-white" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-emerald-600 rounded-full animate-pulse" />
              </div>
              <div className="text-left">
                <h3 className="font-display font-extrabold text-sm tracking-wide leading-none flex items-center gap-1">
                  CampusConnect AI <Sparkles className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
                </h3>
                <span className="text-[10px] text-emerald-100 font-semibold mt-1 block">Sri Satya Institute Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/15 active:bg-white/25 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
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
                          ? "bg-white/70 text-text-dark border border-slate-200/50 shadow-sm rounded-tl-none font-medium"
                          : "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-tr-none shadow-md font-bold"
                      }`}
                    >
                      {/* Simple markdown parsing for bold text */}
                      {msg.content.split("\n\n").map((paragraph, pIdx) => (
                        <p key={pIdx} className={pIdx > 0 ? "mt-2" : ""}>
                          {paragraph.split("**").map((part, partIdx) =>
                            partIdx % 2 === 1 ? <strong key={partIdx} className="font-extrabold">{part}</strong> : part
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
                    className="p-3.5 rounded-2xl text-xs bg-white/70 text-text-dark border border-slate-200/50 shadow-sm rounded-tl-none flex items-center gap-1"
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
            <div className="px-5 pb-3 pt-1 flex flex-wrap gap-1.5 justify-start">
              {[
                "What is B.Tech CSE fee?",
                "What scholarships can I get?",
                "What was the highest placement package?",
                "Tell me about hostel details"
              ].map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-emerald-500/40 text-[10px] text-text-gray hover:text-emerald-700 font-bold rounded-full transition-all cursor-pointer shadow-xs"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Glassy Input Bar Area */}
          <div className="p-4 border-t border-slate-200/50 bg-white/30 backdrop-blur-md flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
              placeholder="Ask a question about the college..."
              className="flex-grow py-2.5 px-4 rounded-xl border border-slate-200/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs bg-white/80 text-text-dark font-medium shadow-inner"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={isLoading || !inputValue.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-40"
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
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              borderColor: "rgba(255,255,255,0.25)",
              color: "#1e293b",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)"
            }}
          >
            Chat with CampusConnect AI
            <div
              className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0"
              style={{
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: "6px solid rgba(255,255,255,0.72)"
              }}
            />
          </div>

          {/* Pulse animation rings */}
          <div
            className="absolute -inset-2 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)",
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
              background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
              boxShadow: "0 8px 32px rgba(16,185,129,0.35), 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.15)",
              animation: "chatbot-float 3s ease-in-out infinite"
            }}
          >
            <MessageCircle className="w-7 h-7" />
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
