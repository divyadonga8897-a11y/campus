"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Send, Sparkles, BookOpen, ExternalLink, HelpCircle, History, 
  ArrowLeft, FileText, CheckCircle2, ChevronRight, MessageSquare, 
  Trash2, ShieldCheck, Download
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import { chatService, type ChatMessage } from "@/services/chatService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface CitationSource {
  title: string;
  url: string;
  type: "PDF Document" | "Web link" | "Official Notice";
}

const suggestedPrompts = [
  { text: "What is the highest placement package?", icon: Sparkles },
  { text: "What B.Tech programs are offered?", icon: BookOpen },
  { text: "Are there any merit scholarships?", icon: HelpCircle },
  { text: "Tell me about the hostel mess food", icon: FileText }
];

const mockHistory = [
  { id: "h-1", title: "Placement Statistics 2024", query: "What is the placement rate?" },
  { id: "h-2", title: "Hostel & Residency Rules", query: "Tell me about the hostel rooms" },
  { id: "h-3", title: "B.Tech Programs Syllabus", query: "What B.Tech programs are offered?" },
];

export default function ChatWorkspaceClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello! I am the **CampusConnect AI Assistant**.\n\nI can help you clear up any doubts about admissions, engineering departments, fee structures, hostel rules, or placement statistics.\n\nTry asking below or use one of the suggested prompts!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState("h-1");
  const [citations, setCitations] = useState<CitationSource[]>([
    { title: "SSIET Official Admissions Catalog 2026", url: "/admissions", type: "PDF Document" },
    { title: "Placement Cell Annual Report", url: "/placements", type: "Official Notice" }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const updateCitations = (query: string) => {
    const text = query.toLowerCase();
    if (text.includes("fee") || text.includes("cost") || text.includes("tuition")) {
      setCitations([
        { title: "Academic Fee Structure & Quota Schedule", url: "/fees", type: "PDF Document" },
        { title: "Scholarship Merit Schemes 2026", url: "/scholarships", type: "Official Notice" }
      ]);
    } else if (text.includes("placement") || text.includes("package") || text.includes("salary")) {
      setCitations([
        { title: "Corporate Placement Ledger 2024", url: "/placements", type: "Official Notice" },
        { title: "Recruiters Directory & Training", url: "/career-training", type: "Web link" }
      ]);
    } else if (text.includes("hostel") || text.includes("room") || text.includes("mess")) {
      setCitations([
        { title: "Residency Hall Guidelines & Mess Menus", url: "/campus", type: "PDF Document" },
        { title: "Campus Map & Infrastructure Guide", url: "/campus", type: "Web link" }
      ]);
    } else {
      setCitations([
        { title: "SSIET Official Admissions Catalog 2026", url: "/admissions", type: "PDF Document" },
        { title: "Placement Cell Annual Report", url: "/placements", type: "Official Notice" }
      ]);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    updateCitations(text);

    const res = await chatService.sendMessage(text, messages);
    setLoading(false);
    if (res.success && res.data) {
      setMessages(prev => [...prev, { role: "assistant", content: res.data }]);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      
      {/* Top Navbar */}
      <Navbar onAIClick={() => {}} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Pane: Chat History List */}
        <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col justify-between hidden md:flex shrink-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-4 h-4 text-slate-400" /> Past Sessions
              </span>
              <Button variant="outline" size="xs" onClick={() => setMessages([
                { role: "assistant", content: "Hello! New AI session started. Let me know what you would like to know about SSIET." }
              ])}>
                New Chat
              </Button>
            </div>

            <div className="space-y-1">
              {mockHistory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSession(item.id);
                    handleSend(item.query);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-semibold truncate transition-all cursor-pointer ${
                    activeSession === item.id 
                      ? "bg-blue-50 text-blue-700 font-bold" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Return to Campus Home
            </Link>
          </div>
        </aside>

        {/* Center Pane: Chat Conversation Space */}
        <div className="flex-1 flex flex-col bg-slate-50/50 relative overflow-hidden">
          
          {/* Header */}
          <div className="bg-white border-b border-slate-200/60 px-6 py-3.5 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold text-slate-900 leading-none">Campus AI Workspace</span>
              <Badge variant="light" color="green">Agent Online</Badge>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Startup prompt cards if only greeting exists */}
            {messages.length === 1 && (
              <div className="max-w-2xl mx-auto space-y-8 py-6">
                <div className="text-center space-y-2">
                  <h2 className="text-lg font-black text-slate-900">How can I help you discover SSIET?</h2>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">Ask about course schedules, fees structures, eligibility, placement metrics or dining facilities.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {suggestedPrompts.map((p, idx) => {
                    const Icon = p.icon;
                    return (
                      <Card 
                        key={idx} 
                        clickable 
                        onClick={() => handleSend(p.text)} 
                        className="p-4 flex items-center justify-between group hover:border-blue-400"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4.5 h-4.5 text-blue-600 group-hover:animate-bounce" />
                          <span className="text-xs font-bold text-slate-800">{p.text}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Conversation list */}
            {messages.length > 1 && (
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                        <Bot className="w-4.5 h-4.5" />
                      </div>
                    )}
                    
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[80%] border shadow-sm ${
                      msg.role === "user" 
                        ? "bg-blue-600 border-blue-700 text-white font-medium" 
                        : "bg-white border-slate-200 text-slate-700"
                    }`}>
                      {msg.content.split('\n').map((line, lIdx) => (
                        <p key={lIdx} className={line.trim() ? "mb-2 last:mb-0" : "h-2"}>
                          {line}
                        </p>
                      ))}
                    </div>

                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0 font-bold text-xs shadow-sm">
                        U
                      </div>
                    )}
                  </motion.div>
                ))}

                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                      <Bot className="w-4.5 h-4.5 animate-bounce" />
                    </div>
                    <div className="bg-white border border-slate-200/60 p-4 rounded-2xl flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

          </div>

          {/* Bottom Chat Bar input */}
          <div className="bg-white border-t border-slate-200 p-4 shrink-0 shadow-inner">
            <div className="max-w-3xl mx-auto relative flex items-center">
              <input
                id="chat-workspace-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                placeholder="Ask about admissions, syllabi, placements, fees..."
                className="w-full pl-5 pr-14 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 bg-slate-50/50 text-xs text-slate-800 placeholder-slate-400 shadow-sm"
                disabled={loading}
              />
              <button
                onClick={() => handleSend(input)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center cursor-pointer transition-colors shadow-sm disabled:bg-slate-300"
                disabled={!input.trim() || loading}
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center text-[10px] text-slate-400 mt-2">
              Campus AI assistant is powered by institutional databases. Citations are listed in the right panel.
            </div>
          </div>

        </div>

        {/* Right Pane: Cited Documents & Sources */}
        <aside className="w-64 bg-white border-l border-slate-200 p-4 flex flex-col hidden lg:flex shrink-0">
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> AI Citations & Sources
              </span>
            </div>

            <div className="space-y-4">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cited References</div>
              <div className="space-y-3">
                {citations.map((source, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1.5">
                    <div className="flex items-start justify-between gap-1.5">
                      <span className="text-[9px] font-bold text-slate-800 line-clamp-2 leading-tight">
                        {source.title}
                      </span>
                      <a href={source.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors">
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[9px] text-slate-400 font-bold uppercase">
                      <span>{source.type}</span>
                      <span className="text-emerald-500">Verified</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-4">College Documents</div>
              <div className="space-y-2">
                {[
                  { label: "B.Tech Syllabus CSE.pdf", size: "1.2 MB" },
                  { label: "Fee Schedule 2026.pdf", size: "840 KB" },
                  { label: "Hostel Guidelines.pdf", size: "450 KB" }
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                      <div className="text-[10px] text-slate-600 font-semibold group-hover:text-slate-900 truncate max-w-[130px]">
                        {doc.label}
                      </div>
                    </div>
                    <Download className="w-3.5 h-3.5 text-slate-350 group-hover:text-blue-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
