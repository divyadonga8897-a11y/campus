"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Bot, Send, Sparkles, GraduationCap, ArrowLeft,
  BookOpen, IndianRupee, Home, Briefcase, HelpCircle,
  Lightbulb, RotateCcw, X
} from "lucide-react";
import { chatService, type ChatMessage } from "@/services/chatService";

const categories = [
  {
    label: "Courses & Programs",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    questions: [
      "What B.Tech programs are offered?",
      "What is the CSE course curriculum?",
      "What is the intake for AI & Data Science?",
      "Tell me about the ECE department",
    ],
  },
  {
    label: "Fees & Scholarships",
    icon: IndianRupee,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    questions: [
      "What is the fee for B.Tech CSE?",
      "Are merit scholarships available?",
      "Is there a government scholarship for SC/ST?",
      "What is the total yearly cost with hostel?",
    ],
  },
  {
    label: "Campus & Hostel",
    icon: Home,
    color: "bg-amber-50 text-amber-600 border-amber-200",
    questions: [
      "Tell me about the hostel facilities",
      "How is the campus infrastructure?",
      "What sports facilities are available?",
      "How is the campus Wi-Fi and internet?",
    ],
  },
  {
    label: "Placements",
    icon: Briefcase,
    color: "bg-purple-50 text-purple-600 border-purple-200",
    questions: [
      "What is the placement rate?",
      "What is the highest package offered?",
      "Which companies visit for placements?",
      "Is there a career training program?",
    ],
  },
  {
    label: "Admissions",
    icon: HelpCircle,
    color: "bg-rose-50 text-rose-600 border-rose-200",
    questions: [
      "What is the EAMCET cutoff for CSE?",
      "What documents are needed for admission?",
      "When do admissions open for 2026-27?",
      "What is the admission process?",
    ],
  },
];

const WELCOME_MSG: ChatMessage = {
  role: "assistant",
  content:
    "Hello! I'm the **SSIET Campus AI** — your intelligent guide to Sri Satya Institute of Engineering and Technology.\n\n I can answer questions about **courses, fees, scholarships, hostel, placements, labs, events, and admissions**.\n\nWhat would you like to know today? 🎓",
};

export default function CampusAIClient() {
  const [messages, setMessages]       = useState<ChatMessage[]>([WELCOME_MSG]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef  = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.slice(1);
      const res = await chatService.sendMessage(trimmed, history);
      setMessages((p) => [...p, { role: "assistant", content: res.data }]);
    } catch {
      setMessages((p) => [
        ...p,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages([WELCOME_MSG]);
    setActiveCategory(null);
    inputRef.current?.focus();
  };

  const renderContent = (text: string) =>
    text.split("**").map((chunk, idx) =>
      idx % 2 === 1
        ? <strong key={idx} className="font-semibold text-slate-900">{chunk}</strong>
        : chunk
    );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ── Left Sidebar: Topic Categories ── */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-black text-slate-700 group-hover:text-blue-600 transition-colors">
              ← Back to SSIET
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">
            Browse by Topic
          </div>

          <div className="space-y-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-[13px] font-semibold transition-all cursor-pointer ${
                    activeCategory === cat.label
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Expanded category questions */}
          <AnimatePresence>
            {activeCategory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 overflow-hidden"
              >
                <div className="space-y-1 pl-2">
                  {categories
                    .find((c) => c.label === activeCategory)
                    ?.questions.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="w-full text-left text-[12px] text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom: Reset */}
        <div className="p-3 border-t border-slate-200">
          <button
            onClick={resetChat}
            className="btn btn-ghost btn-sm w-full text-slate-500"
          >
            <RotateCcw className="w-3.5 h-3.5" /> New Conversation
          </button>
        </div>
      </aside>

      {/* ── Main Chat Area ── */}
      <main className="flex flex-col flex-1 min-w-0">

        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 leading-tight">Campus AI — SSIET</div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online · Instant Answers
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={resetChat} className="btn btn-ghost btn-sm hidden sm:inline-flex">
              <RotateCcw className="w-3.5 h-3.5" /> Clear
            </button>
            <Link href="/" className="btn btn-secondary btn-sm">
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] sm:max-w-xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {renderContent(msg.content)}
                </div>
              </motion.div>
            );
          })}

          {/* Typing indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="shrink-0 bg-white border-t border-slate-200 p-4">
          {/* Quick chips — only show when fresh */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {categories.slice(0, 3).flatMap((c) => c.questions.slice(0, 1)).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[11px] px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              id="campus-ai-input"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about SSIET — courses, fees, hostel, placements..."
              className="input resize-none flex-1 min-h-[44px] max-h-32 leading-relaxed"
              style={{ height: "auto" }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              id="campus-ai-send-btn"
              className="btn btn-primary shrink-0 h-11 w-11 p-0 rounded-xl disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            AI answers are based on SSIET college data. Verify critical details with the admissions office.
          </p>
        </div>

      </main>

    </div>
  );
}
