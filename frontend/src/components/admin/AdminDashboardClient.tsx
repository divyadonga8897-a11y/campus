"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { adminService } from "@/services/adminService";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { 
  GraduationCap, LayoutDashboard, Building2, BookOpen, Coins, Mail, 
  Database, Settings, Users, LogOut, CheckCircle2, AlertTriangle, 
  Trash2, RefreshCw, UploadCloud, ShieldAlert, Sparkles, Activity, 
  Shield, HeartPulse, Bot, Calendar, Clock, ListFilter, Search, FileText, Check, XCircle, Send
} from "lucide-react";

const deptSchema = z.object({
  id: z.string().min(2, "Code must be at least 2 characters."),
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  hod: z.string().min(3, "HOD name is required.")
});

const courseSchema = z.object({
  id: z.string().min(3, "Code must be at least 3 characters."),
  name: z.string().min(3, "Name must be at least 3 characters."),
  dept_id: z.string().min(2, "Department is required."),
  duration: z.string().min(2, "Duration is required."),
  intake: z.number().min(10, "Intake capacity must be >= 10.")
});

const feeSchema = z.object({
  course_id: z.string().min(3, "Course is required."),
  academic_year: z.string().min(4, "Academic year is required."),
  tuition: z.number().min(1000, "Tuition must be >= 1000."),
  hostel: z.number().min(0, "Hostel must be >= 0."),
  other: z.number().min(0, "Other fee must be >= 0."),
  fee_type: z.enum(["Convener", "Management", "Scholarship"])
});

export default function AdminDashboardClient({ defaultView = "dashboard" }: { defaultView?: string }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState(defaultView); 
  
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [knowledgeDocs, setKnowledgeDocs] = useState<any[]>([]);
  const [kbStats, setKbStats] = useState<any>(null);
  const [kbLoading, setKbLoading] = useState(false);
  const [kbUploading, setKbUploading] = useState(false);
  const [kbUploadProgress, setKbUploadProgress] = useState(0);
  const [kbCategory, setKbCategory] = useState("General");

  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const [selectedDocForChunks, setSelectedDocForChunks] = useState<any>(null);
  const [chunksList, setChunksList] = useState<string[]>([]);
  const [chunksLoading, setChunksLoading] = useState(false);
  const [searchLogs, setSearchLogs] = useState<any[]>([]);
  const [searchLogsLoading, setSearchLogsLoading] = useState(false);

  // AI Management state
  const [aiTab, setAiTab] = useState("ai-whatsapp");
  const [waStatus, setWaStatus] = useState<any>(null);
  const [waConversations, setWaConversations] = useState<any[]>([]);
  const [waLogs, setWaLogs] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [waSearchQuery, setWaSearchQuery] = useState("");
  const [selectedConvo, setSelectedConvo] = useState<any>(null);
  const [convoReplyText, setConvoReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // RAG Playground state
  const [playgroundQuery, setPlaygroundQuery] = useState("");
  const [playgroundResult, setPlaygroundResult] = useState<any>(null);
  const [playgroundLoading, setPlaygroundLoading] = useState(false);

  // AI System Status connection health states
  const [pineconeHealth, setPineconeHealth] = useState<any>(null);
  const [groqHealth, setGroqHealth] = useState<any>(null);
  const [embeddingHealth, setEmbeddingHealth] = useState<any>(null);

  const [pineconeTesting, setPineconeTesting] = useState(false);
  const [groqTesting, setGroqTesting] = useState(false);
  const [embeddingTesting, setEmbeddingTesting] = useState(false);

  const [errorModalDoc, setErrorModalDoc] = useState<any>(null);

  const handlePlaygroundQuery = async () => {
    if (!playgroundQuery.trim()) return;
    setPlaygroundLoading(true);
    setPlaygroundResult(null);
    try {
      const res = await adminService.ragPlayground(playgroundQuery);
      if (res.success) {
        setPlaygroundResult(res.data);
      } else {
        triggerAlert(res.error || "RAG query failed", "error");
      }
    } catch (err: any) {
      triggerAlert(err.message || "An unexpected error occurred", "error");
    } finally {
      setPlaygroundLoading(false);
    }
  };

  const testPineconeConnection = async () => {
    setPineconeTesting(true);
    try {
      const res = await adminService.testPinecone();
      if (res.success) {
        setPineconeHealth(res.data);
        triggerAlert("Pinecone test successful! Status: Connected", "success");
      } else {
        setPineconeHealth({ status: "disconnected", error: res.error });
        triggerAlert(res.error || "Pinecone test failed", "error");
      }
    } catch (err: any) {
      setPineconeHealth({ status: "disconnected", error: err.message });
      triggerAlert(err.message || "Pinecone test failed", "error");
    } finally {
      setPineconeTesting(false);
    }
  };

  const testGroqConnection = async () => {
    setGroqTesting(true);
    try {
      const res = await adminService.testGroq();
      if (res.success) {
        setGroqHealth(res.data);
        triggerAlert("Groq test successful! Status: Connected", "success");
      } else {
        setGroqHealth({ status: "disconnected", error: res.error });
        triggerAlert(res.error || "Groq test failed", "error");
      }
    } catch (err: any) {
      setGroqHealth({ status: "disconnected", error: err.message });
      triggerAlert(err.message || "Groq test failed", "error");
    } finally {
      setGroqTesting(false);
    }
  };

  const testEmbeddingConnection = async () => {
    setEmbeddingTesting(true);
    try {
      const res = await adminService.testEmbedding();
      if (res.success) {
        setEmbeddingHealth(res.data);
        triggerAlert("Embedding service test successful! Status: Connected", "success");
      } else {
        setEmbeddingHealth({ status: "disconnected", error: res.error });
        triggerAlert(res.error || "Embedding service test failed", "error");
      }
    } catch (err: any) {
      setEmbeddingHealth({ status: "disconnected", error: err.message });
      triggerAlert(err.message || "Embedding service test failed", "error");
    } finally {
      setEmbeddingTesting(false);
    }
  };


  useEffect(() => {
    adminService.getCurrentUser()
      .then((res) => {
        if (!res.success) {
          router.push("/admin/login");
        } else {
          setCurrentUser(res.data);
          loadDashboardData();
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, []);

  const loadDashboardData = () => {
    setLoading(true);
    Promise.all([
      adminService.getStats(),
      adminService.getLogs(),
      adminService.getEnquiries()
    ]).then(([statsRes, logsRes, enqRes]) => {
      setStats(statsRes.data || null);
      setLogs(logsRes.data || []);
      setEnquiries(enqRes.data || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  };

  const loadKnowledgeData = () => {
    setKbLoading(true);
    Promise.all([
      adminService.getKnowledgeDocuments(),
      adminService.getKnowledgeStats()
    ]).then(([docsRes, statsRes]) => {
      setKnowledgeDocs(docsRes.data || []);
      setKbStats(statsRes.data || null);
      setKbLoading(false);
    }).catch((err) => {
      triggerAlert(err.message || "Failed to load knowledge base data", "error");
      setKbLoading(false);
    });
  };

  const loadSearchHistory = async () => {
    setSearchLogsLoading(true);
    const res = await adminService.getSearchHistory();
    setSearchLogsLoading(false);
    if (res.success) {
      setSearchLogs(res.data || []);
    } else {
      triggerAlert(res.error || "Failed to load search history", "error");
    }
  };

  const handleViewChunks = async (doc: any) => {
    setSelectedDocForChunks(doc);
    setChunksLoading(true);
    setChunksList([]);
    const res = await adminService.getDocumentChunks(doc.id);
    setChunksLoading(false);
    if (res.success) {
      setChunksList(res.data || []);
    } else {
      triggerAlert(res.error || "Failed to load chunks", "error");
      setSelectedDocForChunks(null);
    }
  };

  useEffect(() => {
    if (currentView === "knowledge-base") {
      loadKnowledgeData();
    } else if (currentView === "search-history") {
      loadSearchHistory();
    }
  }, [currentView]);

  useEffect(() => {
    if (currentView !== "knowledge-base") return;
    const hasProcessing = knowledgeDocs.some((d: any) => d.status === "Processing");
    if (!hasProcessing) return;

    const timer = setInterval(() => {
      adminService.getKnowledgeDocuments().then((res) => {
        if (res.success && res.data) {
          setKnowledgeDocs(res.data);
          const finishedIndex = res.data.some((d: any) => d.status !== "Processing" && knowledgeDocs.find((old: any) => old.id === d.id)?.status === "Processing");
          if (finishedIndex) {
            adminService.getKnowledgeStats().then((sRes: any) => {
              if (sRes.success) setKbStats(sRes.data);
            });
          }
        }
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [currentView, knowledgeDocs]);

  const handleKbDocReindex = async (id: string) => {
    triggerAlert("Re-indexing started...");
    const res = await adminService.reindexKnowledgeDocument(id);
    if (res.success) {
      triggerAlert("Document re-indexing triggered!");
      loadKnowledgeData();
    } else {
      triggerAlert(res.error || "Failed to start re-indexing", "error");
    }
  };

  const handleKbDocDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this document and all its indexed vectors from Pinecone? This action cannot be undone.")) return;
    const res = await adminService.deleteKnowledgeDocument(id);
    if (res.success) {
      triggerAlert("Document deleted and purged from Pinecone!");
      loadKnowledgeData();
    } else {
      triggerAlert(res.error || "Failed to delete document", "error");
    }
  };

  const handleKbFileUpload = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["pdf", "docx", "txt", "md"].includes(ext)) {
      triggerAlert("Unsupported file type. Only PDF, DOCX, TXT, MD files are allowed.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      triggerAlert("File is too large. Maximum size is 5MB.", "error");
      return;
    }

    setKbUploading(true);
    setKbUploadProgress(20);
    
    const progTimer = setInterval(() => {
      setKbUploadProgress(prev => (prev < 80 ? prev + 15 : prev));
    }, 300);

    const res = await adminService.uploadKnowledgeDocument(file, kbCategory);
    clearInterval(progTimer);
    setKbUploadProgress(100);

    setTimeout(() => {
      setKbUploading(false);
      setKbUploadProgress(0);
      if (res.success) {
        triggerAlert("Document uploaded successfully! Indexing started in background.");
        loadKnowledgeData();
      } else {
        triggerAlert(res.error || "Failed to upload document", "error");
      }
    }, 400);
  };

  const handleLogout = () => {
    adminService.logout().then(() => {
      router.push("/admin/login");
    });
  };

  const triggerAlert = (msg: string, type: "success" | "error" = "success") => {
    setAlertMessage(msg);
    setAlertType(type);
    setTimeout(() => setAlertMessage(""), 4000);
  };

  const [editingId, setEditingId] = useState<string | null>(null);

  const { register: regDept, handleSubmit: subDept, reset: resDept, setValue: setDeptValue } = useForm({
    resolver: zodResolver(deptSchema)
  });

  const onDeptSubmit = async (data: any) => {
    let res;
    if (editingId) {
      res = await adminService.updateDepartment(editingId, data.name, data.description, data.hod);
    } else {
      res = await adminService.createDepartment(data.id, data.name, data.description, data.hod);
    }
    if (res.success) {
      triggerAlert(editingId ? "Department updated successfully" : "Department created successfully");
      resDept();
      setEditingId(null);
      loadDashboardData();
    } else {
      triggerAlert(res.error || "Operation failed", "error");
    }
  };

  const { register: regCourse, handleSubmit: subCourse, reset: resCourse, setValue: setCourseValue } = useForm({
    resolver: zodResolver(courseSchema)
  });

  const onCourseSubmit = async (data: any) => {
    let res;
    if (editingId) {
      res = await adminService.updateCourse(editingId, data.name, data.duration, data.intake, "Overview details");
    } else {
      res = await adminService.createCourse(data.id, data.name, data.dept_id, data.duration, data.intake, "Overview details");
    }
    if (res.success) {
      triggerAlert(editingId ? "Course updated successfully" : "Course created successfully");
      resCourse();
      setEditingId(null);
      loadDashboardData();
    } else {
      triggerAlert(res.error || "Operation failed", "error");
    }
  };

  const { register: regFee, handleSubmit: subFee, reset: resFee } = useForm({
    resolver: zodResolver(feeSchema)
  });

  const onFeeSubmit = async (data: any) => {
    let res;
    if (editingId) {
      res = await adminService.updateFee(editingId, data.tuition, data.hostel, data.other);
    } else {
      res = await adminService.createFee(data.course_id, data.academic_year, data.tuition, data.hostel, data.other, data.fee_type);
    }
    if (res.success) {
      triggerAlert(editingId ? "Fee structure updated" : "Fee structure added");
      resFee();
      setEditingId(null);
      loadDashboardData();
    } else {
      triggerAlert(res.error || "Operation failed", "error");
    }
  };

  const handleEnquiryStatus = async (id: number, status: string) => {
    const res = await adminService.updateEnquiryStatus(id, status);
    if (res.success) {
      triggerAlert(`Enquiry marked as ${status.toLowerCase()}`);
      loadDashboardData();
    } else {
      triggerAlert(res.error || "Status update failed", "error");
    }
  };

  const loadAiManagementData = async () => {
    setAiLoading(true);
    try {
      const [statusRes, convRes, logsRes, healthRes] = await Promise.all([
        adminService.getWhatsappStatus(),
        adminService.getWhatsappConversations(),
        adminService.getWhatsappLogs(),
        adminService.getSystemHealth()
      ]);
      setWaStatus(statusRes.data || null);
      setWaConversations(convRes.data || []);
      setWaLogs(logsRes.data || []);
      setSystemHealth(healthRes.data || null);
    } catch (err) {
      console.error("Failed to load AI management data", err);
    }
    setAiLoading(false);
  };

  const handleSendAdminReply = async () => {
    if (!convoReplyText.trim() || !selectedConvo || sendingReply) return;
    setSendingReply(true);
    try {
      const res = await adminService.sendWhatsappAdminMessage(selectedConvo.phone_number, convoReplyText);
      if (res.success) {
        setConvoReplyText("");
        // Reload conversations to update chat logs
        const updatedConversations = await adminService.getWhatsappConversations();
        if (updatedConversations.success && updatedConversations.data) {
          setWaConversations(updatedConversations.data);
          const updatedConvo = updatedConversations.data.find((c: any) => c.phone_number === selectedConvo.phone_number);
          if (updatedConvo) {
            setSelectedConvo(updatedConvo);
          }
        }
        triggerAlert("Reply sent successfully!");
      } else {
        triggerAlert(res.error || "Failed to send message", "error");
      }
    } catch (err: any) {
      triggerAlert(err.message || "An unexpected error occurred", "error");
    } finally {
      setSendingReply(false);
    }
  };

  useEffect(() => {
    if (currentView !== "ai-management" || aiTab !== "ai-conversations" || !selectedConvo) return;
    
    const interval = setInterval(async () => {
      try {
        const res = await adminService.getWhatsappConversations();
        if (res.success && res.data) {
          setWaConversations(res.data);
          const updatedConvo = res.data.find((c: any) => c.phone_number === selectedConvo.phone_number);
          if (updatedConvo) {
            setSelectedConvo(updatedConvo);
          }
        }
      } catch (err) {
        console.error("Error polling conversations:", err);
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, [currentView, aiTab, selectedConvo]);

  const sidebarMenu = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "departments", label: "Departments", icon: Building2 },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "fees", label: "Fees Config", icon: Coins },
    { id: "enquiries", label: "Contact Inbox", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Alert Banner Notification */}
      {alertMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-xl border shadow-lg ${
          alertType === "success" 
            ? "bg-green-50 border-green-100 text-green-700" 
            : "bg-red-50 border-red-100 text-red-700"
        }`}>
          {alertType === "success" ? <CheckCircle2 className="w-4.5 h-4.5" /> : <ShieldAlert className="w-4.5 h-4.5" />}
          <span className="text-[10px] font-bold uppercase tracking-wider">{alertMessage}</span>
        </div>
      )}

      {/* Header Info Bar */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h1 className="font-display font-extrabold text-sm text-text-dark leading-none">SSIET Admin Portal</h1>
            <p className="text-[9px] text-text-gray font-medium pt-1">Sri Satya Institute of Engineering & Technology</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {currentUser && (
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-text-dark">{currentUser.full_name}</span>
              <span className="text-[9px] font-bold text-text-gray/80 uppercase tracking-wider">{currentUser.role}</span>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-text-gray hover:text-red-600 transition-colors text-[10px] font-bold uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Workspace layout */}
      <div className="flex-grow flex flex-col md:flex-row">
        
        {/* Left Console Sidebar Menu */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200/60 p-6 flex flex-col justify-between shrink-0 space-y-6">
          <div className="space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-wider text-text-gray/60 block text-left">
              Console Navigation
            </span>
            <nav className="flex flex-row md:flex-col flex-wrap gap-1">
              {sidebarMenu.map((item) => {
                const MenuIcon = item.icon;
                const active = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setEditingId(null);
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      active 
                        ? "bg-blue-50 text-primary shadow-sm shadow-blue-500/5 font-extrabold" 
                        : "text-text-gray hover:bg-slate-50 hover:text-text-dark"
                    }`}
                  >
                    <MenuIcon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </button>
                );
              })}

              {currentUser?.role === "super_admin" && (
                <>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-text-gray/40 block text-left pt-4">AI & RAG</span>
                  <button
                    onClick={() => {
                      setCurrentView("knowledge-base");
                      setEditingId(null);
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      currentView === "knowledge-base"
                        ? "bg-indigo-50 text-indigo-700 shadow-sm font-extrabold"
                        : "text-text-gray hover:bg-slate-50 hover:text-text-dark"
                    }`}
                  >
                    <Database className="w-4 h-4 shrink-0" />
                    Knowledge Base
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView("rag-flow");
                      setEditingId(null);
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      currentView === "rag-flow"
                        ? "bg-indigo-50 text-indigo-700 shadow-sm font-extrabold"
                        : "text-text-gray hover:bg-slate-50 hover:text-text-dark"
                    }`}
                  >
                    <RefreshCw className="w-4 h-4 shrink-0" />
                    How RAG Works
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView("search-history");
                      setEditingId(null);
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      currentView === "search-history"
                        ? "bg-indigo-50 text-indigo-700 shadow-sm font-extrabold"
                        : "text-text-gray hover:bg-slate-50 hover:text-text-dark"
                    }`}
                  >
                    <Clock className="w-4 h-4 shrink-0" />
                    Search History
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView("ai-management");
                      setEditingId(null);
                      loadAiManagementData();
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      currentView === "ai-management"
                        ? "bg-emerald-50 text-emerald-700 shadow-sm font-extrabold"
                        : "text-text-gray hover:bg-slate-50 hover:text-text-dark"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    AI Management
                  </button>
                </>
              )}
            </nav>
          </div>
        </aside>

        {/* Right Content Workplace */}
        <main className="flex-1 p-6 sm:p-8 min-w-0">
          {loading ? (
            <div className="h-44 flex items-center justify-center text-xs font-bold text-text-gray uppercase tracking-widest animate-pulse">
              Loading Central Console Data...
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-6">
              
              {/* VIEW 1: OVERVIEW */}
              {currentView === "dashboard" && stats && (
                <div className="space-y-6">
                  {/* Summary Metric Stats grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200/60 p-5 rounded-2xl text-left shadow-sm">
                      <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80">Total Courses</h4>
                      <h3 className="text-xl font-display font-extrabold text-text-dark pt-1">{stats.courses}</h3>
                    </div>
                    <div className="bg-white border border-slate-200/60 p-5 rounded-2xl text-left shadow-sm">
                      <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80">Departments</h4>
                      <h3 className="text-xl font-display font-extrabold text-text-dark pt-1">{stats.departments}</h3>
                    </div>
                    <div className="bg-white border border-slate-200/60 p-5 rounded-2xl text-left shadow-sm">
                      <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80">Pending Enquiries</h4>
                      <h3 className="text-xl font-display font-extrabold text-text-dark pt-1">{stats.pending_enquiries}</h3>
                    </div>
                    <div className="bg-white border border-slate-200/60 p-5 rounded-2xl text-left shadow-sm">
                      <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80">Active Admins</h4>
                      <h3 className="text-xl font-display font-extrabold text-text-dark pt-1">{stats.admins}</h3>
                    </div>
                  </div>

                  {/* Audit Logs activities */}
                  <Card>
                    <CardHeader>
                      <h3 className="font-display font-extrabold text-sm text-text-dark text-left">Administrative Audit Logs</h3>
                    </CardHeader>
                    <CardBody className="space-y-3 max-h-[400px] overflow-y-auto">
                      {logs.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-50 bg-slate-50/20 text-left text-xs font-sans">
                          <Badge color="blue" className="shrink-0 mt-0.5">{log.role}</Badge>
                          <div className="flex-1 space-y-1">
                            <p className="text-text-dark font-medium leading-relaxed">{log.action}</p>
                            <div className="flex items-center gap-2 text-[10px] text-text-gray/70">
                              <span>Actor: <strong>{log.username}</strong></span>
                              <span>•</span>
                              <span>Timestamp: {log.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardBody>
                  </Card>
                </div>
              )}

              {/* VIEW 2: DEPARTMENTS */}
              {currentView === "departments" && (
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Department form */}
                  <div className="lg:col-span-4">
                    <Card className="p-6 text-left space-y-5">
                      <h3 className="font-display font-extrabold text-sm text-text-dark border-b border-slate-100 pb-2">
                        {editingId ? "Edit Department" : "Add Department"}
                      </h3>
                      <form onSubmit={subDept(onDeptSubmit)} className="space-y-4">
                        <Input label="Code (ID)" disabled={!!editingId} {...regDept("id")} />
                        <Input label="Name" {...regDept("name")} />
                        <Input label="HOD Name" {...regDept("hod")} />
                        <Textarea label="Description" {...regDept("description")} />
                        <Button type="submit" fullWidth>Save Department</Button>
                        {editingId && (
                          <Button 
                            type="button" 
                            variant="secondary" 
                            fullWidth 
                            onClick={() => { setEditingId(null); resDept(); }}
                          >
                            Cancel Edit
                          </Button>
                        )}
                      </form>
                    </Card>
                  </div>

                  {/* Listings table */}
                  <div className="lg:col-span-8">
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <h3 className="font-display font-extrabold text-sm text-text-dark text-left">Department Listings</h3>
                      </CardHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>HOD</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats?.departments_list?.map((dept: any) => (
                            <TableRow key={dept.id}>
                              <TableCell className="font-bold text-primary font-mono">{dept.id}</TableCell>
                              <TableCell className="font-bold text-text-dark">{dept.name}</TableCell>
                              <TableCell>{dept.hod}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={() => {
                                    setEditingId(dept.id);
                                    setDeptValue("id", dept.id);
                                    setDeptValue("name", dept.name);
                                    setDeptValue("hod", dept.hod);
                                    setDeptValue("description", dept.description);
                                  }}
                                >
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                </div>
              )}

              {/* VIEW 3: COURSES */}
              {currentView === "courses" && (
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Course Form */}
                  <div className="lg:col-span-4">
                    <Card className="p-6 text-left space-y-5">
                      <h3 className="font-display font-extrabold text-sm text-text-dark border-b border-slate-100 pb-2">
                        {editingId ? "Edit Course" : "Add Course"}
                      </h3>
                      <form onSubmit={subCourse(onCourseSubmit)} className="space-y-4">
                        <Input label="Course Code" disabled={!!editingId} {...regCourse("id")} />
                        <Input label="Course Name" {...regCourse("name")} />
                        <div className="flex flex-col gap-1.5">
                          <label className="font-display font-semibold text-[10px] uppercase tracking-wider text-text-gray">
                            Department
                          </label>
                          <select 
                            {...regCourse("dept_id")}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[11px] font-sans bg-white focus:outline-none focus:border-primary"
                          >
                            <option value="">Select Department</option>
                            {stats?.departments_list?.map((d: any) => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                        <Input label="Duration" placeholder="e.g. 4 Years" {...regCourse("duration")} />
                        <Input label="Intake Seats" type="number" {...regCourse("intake", { valueAsNumber: true })} />
                        <Button type="submit" fullWidth>Save Course</Button>
                        {editingId && (
                          <Button 
                            type="button" 
                            variant="secondary" 
                            fullWidth 
                            onClick={() => { setEditingId(null); resCourse(); }}
                          >
                            Cancel Edit
                          </Button>
                        )}
                      </form>
                    </Card>
                  </div>

                  {/* Listings Table */}
                  <div className="lg:col-span-8">
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <h3 className="font-display font-extrabold text-sm text-text-dark text-left">Academic Programs List</h3>
                      </CardHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Seats</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats?.courses_list?.map((course: any) => (
                            <TableRow key={course.id}>
                              <TableCell className="font-bold font-mono text-primary">{course.id}</TableCell>
                              <TableCell className="font-bold text-text-dark">{course.name}</TableCell>
                              <TableCell>{course.duration}</TableCell>
                              <TableCell>{course.intake}</TableCell>
                              <TableCell>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    setEditingId(course.id);
                                    setCourseValue("id", course.id);
                                    setCourseValue("name", course.name);
                                    setCourseValue("dept_id", course.dept_id);
                                    setCourseValue("duration", course.duration);
                                    setCourseValue("intake", course.intake);
                                  }}
                                >
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                </div>
              )}

              {/* VIEW 4: FEES */}
              {currentView === "fees" && (
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Fee Form */}
                  <div className="lg:col-span-4">
                    <Card className="p-6 text-left space-y-5">
                      <h3 className="font-display font-extrabold text-sm text-text-dark border-b border-slate-100 pb-2">
                        {editingId ? "Edit Fee Structure" : "Add Fee Structure"}
                      </h3>
                      <form onSubmit={subFee(onFeeSubmit)} className="space-y-4">
                        {!editingId && (
                          <>
                            <div className="flex flex-col gap-1.5">
                              <label className="font-display font-semibold text-[10px] uppercase tracking-wider text-text-gray">
                                Course Select
                              </label>
                              <select 
                                {...regFee("course_id")}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[11px] font-sans bg-white focus:outline-none focus:border-primary"
                              >
                                <option value="">Select Course</option>
                                {stats?.courses_list?.map((c: any) => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                            <Input label="Academic Year" placeholder="2026-27" {...regFee("academic_year")} />
                            <div className="flex flex-col gap-1.5">
                              <label className="font-display font-semibold text-[10px] uppercase tracking-wider text-text-gray">
                                Allocation Quota
                              </label>
                              <select 
                                {...regFee("fee_type")}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[11px] font-sans bg-white focus:outline-none focus:border-primary"
                              >
                                <option value="Convener">Convener Quota</option>
                                <option value="Management">Management Quota</option>
                                <option value="Scholarship">Scholarship Reserved</option>
                              </select>
                            </div>
                          </>
                        )}
                        <Input label="Tuition Fee (INR)" type="number" {...regFee("tuition", { valueAsNumber: true })} />
                        <Input label="Hostel Fee (INR)" type="number" {...regFee("hostel", { valueAsNumber: true })} />
                        <Input label="Other Fee (INR)" type="number" {...regFee("other", { valueAsNumber: true })} />
                        <Button type="submit" fullWidth>Save Fee Config</Button>
                        {editingId && (
                          <Button 
                            type="button" 
                            variant="secondary" 
                            fullWidth 
                            onClick={() => { setEditingId(null); resFee(); }}
                          >
                            Cancel Edit
                          </Button>
                        )}
                      </form>
                    </Card>
                  </div>

                  {/* Listings Table */}
                  <div className="lg:col-span-8">
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <h3 className="font-display font-extrabold text-sm text-text-dark text-left">Fee Configurations Registry</h3>
                      </CardHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Course</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Tuition</TableHead>
                            <TableHead>Hostel</TableHead>
                            <TableHead>Other</TableHead>
                            <TableHead>Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats?.fees_list?.map((fee: any) => (
                            <TableRow key={fee.id}>
                              <TableCell className="font-bold text-text-dark">{fee.course_id}</TableCell>
                              <TableCell>{fee.academic_year}</TableCell>
                              <TableCell className="font-mono text-primary font-bold">₹{fee.tuition}</TableCell>
                              <TableCell className="font-mono">₹{fee.hostel}</TableCell>
                              <TableCell className="font-mono">₹{fee.other}</TableCell>
                              <TableCell>
                                <Badge color="blue">{fee.fee_type}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                </div>
              )}

              {/* VIEW 5: CONTACT ENQUIRIES */}
              {currentView === "enquiries" && (
                <Card className="overflow-hidden">
                  <CardHeader>
                    <h3 className="font-display font-extrabold text-sm text-text-dark text-left">Applicant Enquiries Inbox</h3>
                  </CardHeader>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Subject / Query Message</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enquiries.map((enq) => (
                        <TableRow key={enq.id}>
                          <TableCell className="text-[10px] text-text-gray/70">{enq.created_at?.split("T")[0]}</TableCell>
                          <TableCell className="font-bold text-text-dark">{enq.name}</TableCell>
                          <TableCell className="text-[10px]">
                            <p>{enq.email}</p>
                            <p className="text-text-gray/70">{enq.phone}</p>
                          </TableCell>
                          <TableCell className="text-left max-w-sm">
                            <p className="font-bold text-text-dark">{enq.subject}</p>
                            <p className="text-text-gray text-[10px] leading-relaxed pt-0.5">{enq.message}</p>
                          </TableCell>
                          <TableCell>
                            <Badge color={enq.status === "RESOLVED" ? "green" : "amber"}>
                              {enq.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {enq.status !== "RESOLVED" && (
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={() => handleEnquiryStatus(enq.id, "RESOLVED")}
                                >
                                  Resolve
                                </Button>
                              )}
                              {enq.status !== "PENDING" && (
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={() => handleEnquiryStatus(enq.id, "PENDING")}
                                >
                                  Mark Pending
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}

              {/* VIEW 6: KNOWLEDGE BASE */}
              {currentView === "knowledge-base" && currentUser?.role === "super_admin" && (
                <div className="space-y-6">
                  
                  {/* Upload document parameters */}
                  <div className="grid lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left: Upload and Stats */}
                    <div className="lg:col-span-5 space-y-6">
                      <Card className="p-6 text-left space-y-4">
                        <h3 className="font-display font-extrabold text-sm text-indigo-700 flex items-center gap-2">
                          <UploadCloud className="w-5 h-5 text-indigo-600 animate-pulse" /> Upload RAG Document
                        </h3>
                        <p className="text-[10px] text-text-gray leading-relaxed">
                          Drag and drop or select a file to ingest into the Pinecone Vector Database. Document contents will be parsed and indexed.
                        </p>
                        
                        <div className="space-y-3.5">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-display font-semibold text-[10px] uppercase tracking-wider text-text-gray">
                              Category Group
                            </label>
                            <select 
                              value={kbCategory} 
                              onChange={(e) => setKbCategory(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[11px] font-sans bg-white focus:outline-none focus:border-primary"
                            >
                              <option value="General">General Info</option>
                              <option value="Admissions">Admissions</option>
                              <option value="Fees">Fees & Quotas</option>
                              <option value="Courses">Courses & Syllabus</option>
                              <option value="Scholarships">Scholarships</option>
                              <option value="Placements">Placements</option>
                              <option value="Campus Life">Campus Life</option>
                            </select>
                          </div>

                          <div className="relative border-2 border-dashed border-slate-200 hover:border-primary/50 transition-colors p-6 rounded-2xl flex flex-col items-center justify-center gap-2 bg-slate-50/50">
                            <UploadCloud className="w-8 h-8 text-slate-400" />
                            <input
                              type="file"
                              accept=".txt,.md,.pdf,.docx"
                              disabled={kbUploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleKbFileUpload(file);
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-gray">Select File</span>
                            <span className="text-[9px] text-text-gray/60">PDF, DOCX, TXT, MD up to 5MB</span>
                          </div>

                          {kbUploading && (
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px] font-bold text-primary">
                                <span>Ingesting Document...</span>
                                <span>{kbUploadProgress}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full transition-all duration-300" style={{ width: `${kbUploadProgress}%` }} />
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>

                      {/* Pinecone metadata */}
                      <Card className="p-6 text-left">
                        <h3 className="font-display font-extrabold text-sm text-text-dark mb-4">Vector Database Metadata</h3>
                        {kbStats && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                              <span className="text-[9px] font-bold text-text-gray/80 uppercase">Total Files</span>
                              <h4 className="text-xl font-display font-extrabold text-text-dark pt-1">{kbStats.total_documents}</h4>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                              <span className="text-[9px] font-bold text-text-gray/80 uppercase">Active Vectors</span>
                              <h4 className="text-xl font-display font-extrabold text-text-dark pt-1">{kbStats.total_chunks}</h4>
                            </div>
                          </div>
                        )}
                      </Card>
                    </div>

                    {/* Right: Listings Table */}
                    <div className="lg:col-span-7">
                      <Card className="overflow-hidden">
                        <CardHeader>
                          <h3 className="font-display font-extrabold text-sm text-text-dark text-left">Uploaded Document Inventory</h3>
                        </CardHeader>
                        {kbLoading ? (
                          <div className="p-12 text-xs font-bold text-text-gray uppercase tracking-widest animate-pulse">Loading Inventory...</div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Filename</TableHead>
                                <TableHead>Group</TableHead>
                                <TableHead>Chunks</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {knowledgeDocs.map((doc) => (
                                <TableRow key={doc.id}>
                                  <TableCell className="font-bold text-text-dark text-left truncate max-w-[150px]">{doc.filename}</TableCell>
                                  <TableCell><Badge color="blue">{doc.category}</Badge></TableCell>
                                  <TableCell className="font-mono font-bold text-xs">{doc.chunk_count || 0}</TableCell>
                                  <TableCell>
                                    <Badge color={doc.status === "Processed" || doc.status === "Indexed" ? "green" : doc.status === "Processing" ? "amber" : "red"}>
                                      {doc.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-1.5 justify-end">
                                      <button 
                                        onClick={() => handleViewChunks(doc)}
                                        className="p-1.5 hover:bg-slate-100 rounded-lg text-text-gray hover:text-indigo-600 transition-colors cursor-pointer"
                                        title="View Chunks"
                                        disabled={doc.status !== "Processed" && doc.status !== "Indexed"}
                                      >
                                        <BookOpen className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => handleKbDocReindex(doc.id)}
                                        className="p-1.5 hover:bg-slate-100 rounded-lg text-text-gray hover:text-primary transition-colors cursor-pointer"
                                        title="Reindex Vectors"
                                      >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => handleKbDocDelete(doc.id)}
                                        className="p-1.5 hover:bg-red-50 rounded-lg text-text-gray hover:text-red-600 transition-colors cursor-pointer"
                                        title="Purge vectors & delete"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </Card>
                    </div>

                  </div>

                  {/* RAG System Parameters Ingestion Config */}
                  <Card className="p-6 text-left space-y-4 mt-6">
                    <h3 className="font-display font-extrabold text-sm text-text-dark">RAG Splitter & Embeddings Configuration</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <span className="text-[9px] font-bold text-text-gray/80 uppercase">Embedding Model</span>
                        <p className="font-bold text-text-dark pt-1">multilingual-e5-large</p>
                        <p className="text-[9px] text-text-gray/60">1024 dimensions</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <span className="text-[9px] font-bold text-text-gray/80 uppercase">Max Chunk Size</span>
                        <p className="font-bold text-text-dark pt-1">1,000 characters</p>
                        <p className="text-[9px] text-text-gray/60">Recursive Text Splitting</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <span className="text-[9px] font-bold text-text-gray/80 uppercase">Chunk Overlap</span>
                        <p className="font-bold text-text-dark pt-1">200 characters</p>
                        <p className="text-[9px] text-text-gray/60">Preserves text boundary</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <span className="text-[9px] font-bold text-text-gray/80 uppercase">Query Top K retrieve</span>
                        <p className="font-bold text-text-dark pt-1">5 matched chunks</p>
                        <p className="text-[9px] text-text-gray/60">Similarity score threshold ≥ 0.5</p>
                      </div>
                    </div>
                  </Card>

                  {/* File Chunks Breakdown Summary list */}
                  <Card className="p-6 text-left space-y-4 mt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-display font-extrabold text-sm text-text-dark">Knowledge Base Chunk Breakdown</h3>
                        <p className="text-[10px] text-text-gray">Detailed view of how each file is divided into vector chunks.</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                        Total Active Chunks: {kbStats?.total_chunks || 0}
                      </span>
                    </div>

                    <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                      {knowledgeDocs.length === 0 ? (
                        <div className="p-6 text-xs text-text-gray text-center uppercase tracking-wider">
                          No documents uploaded yet.
                        </div>
                      ) : (
                        knowledgeDocs.map((doc) => (
                          <div key={doc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors">
                            <div className="space-y-1">
                              <p className="font-bold text-xs text-text-dark truncate max-w-[280px]" title={doc.filename}>{doc.filename}</p>
                              <div className="flex items-center gap-2">
                                <Badge color="blue">{doc.category}</Badge>
                                <span className="text-[10px] text-text-gray">Status: {doc.status}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="text-[9px] font-bold text-text-gray uppercase block">Divided into</span>
                                <span className="font-mono font-extrabold text-xs text-indigo-600">{doc.chunk_count || 0} Chunks</span>
                              </div>
                              <button
                                onClick={() => handleViewChunks(doc)}
                                disabled={doc.status !== "Processed" && doc.status !== "Indexed"}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-100 hover:text-indigo-600 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                              >
                                Inspect Chunks
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {/* VIEW 7: HOW RAG WORKS FLOW SCHEMATIC */}
              {currentView === "rag-flow" && currentUser?.role === "super_admin" && (
                <div className="space-y-6 text-left animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-display font-extrabold text-base text-text-dark">How the RAG Pipeline Works</h2>
                      <p className="text-[10px] text-text-gray font-medium">Technical workflow of vector ingestion, recursive chunking, and similarity semantic retrieval</p>
                    </div>
                  </div>

                  {/* Flow Schematic Container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    
                    {/* Panel A: Ingestion Flow */}
                    <Card className="p-6 space-y-6">
                      <h3 className="font-display font-extrabold text-sm text-indigo-700 flex items-center gap-2">
                        <UploadCloud className="w-5 h-5 text-indigo-600" /> Phase 1: Document Ingestion Flow
                      </h3>
                      
                      <div className="space-y-4 relative">
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100 z-0" />

                        {/* Step 1 */}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                            1
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-dark">Document Upload</h4>
                            <p className="text-[10px] text-text-gray leading-relaxed font-normal">
                              Admin uploads a syllabus, placements statistics, or fee schedule document (.pdf, .docx, .txt, .md).
                            </p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                            2
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-dark">Text Extraction & Normalization</h4>
                            <p className="text-[10px] text-text-gray leading-relaxed font-normal">
                              Backend extracts raw text sequences and structures, eliminating page numbers or redundant whitespace.
                            </p>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                            3
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-dark">Recursive Text Chunking</h4>
                            <p className="text-[10px] text-text-gray leading-relaxed font-normal">
                              Paragraphs are recursively split into text chunks of maximum <strong>1,000 characters</strong> with a <strong>200 characters overlap</strong>. This overlap ensures key semantic context is not lost at block boundaries.
                            </p>
                          </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                            4
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-dark">Vector Generation & Index Ingestion</h4>
                            <p className="text-[10px] text-text-gray leading-relaxed font-normal">
                              Each chunk is processed through the <code>multilingual-e5-large</code> model to generate 1024-dimensional float vectors, which are upserted into the <strong>Pinecone</strong> vector index.
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Panel B: Retrieval Flow */}
                    <Card className="p-6 space-y-6">
                      <h3 className="font-display font-extrabold text-sm text-indigo-700 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600" /> Phase 2: RAG Query Retrieval Flow
                      </h3>

                      <div className="space-y-4 relative">
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100 z-0" />

                        {/* Step 1 */}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                            1
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-dark">User Prompts AI</h4>
                            <p className="text-[10px] text-text-gray leading-relaxed font-normal">
                              A visitor submits a prompt in the chatbot drawer, e.g. <em>"What are the hostel rules for boys?"</em>
                            </p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                            2
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-dark">Semantic Similarity Match</h4>
                            <p className="text-[10px] text-text-gray leading-relaxed font-normal">
                              The prompt is converted to a vector and compared against the Pinecone Index. The system retrieves the <strong>top 5 most similar chunks</strong> with a similarity threshold ≥ 0.5.
                            </p>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                            3
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-dark">Context Construction</h4>
                            <p className="text-[10px] text-text-gray leading-relaxed font-normal">
                              The retrieved context chunks are assembled into a structured system prompt, mapping direct citations to the original document sources.
                            </p>
                          </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                            4
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-text-dark">LLM Synthesis & Response Stream</h4>
                            <p className="text-[10px] text-text-gray leading-relaxed font-normal">
                              The LLM (Groq Llama-3.1) compiles the facts and streams a verified response containing source file links back to the user.
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>

                  </div>
                </div>
              )}

              {/* VIEW 8: SEARCH HISTORY */}
              {currentView === "search-history" && currentUser?.role === "super_admin" && (
                <Card className="overflow-hidden">
                  <CardHeader>
                    <h3 className="font-display font-extrabold text-sm text-text-dark text-left">Visitor Search & RAG Response History</h3>
                  </CardHeader>
                  {searchLogsLoading ? (
                    <div className="p-12 text-xs font-bold text-text-gray uppercase tracking-widest animate-pulse">
                      Retrieving search histories...
                    </div>
                  ) : searchLogs.length === 0 ? (
                    <div className="p-12 text-xs font-bold text-text-gray uppercase tracking-widest">
                      No search logs recorded.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[180px]">Timestamp</TableHead>
                            <TableHead className="w-[240px]">User Query</TableHead>
                            <TableHead>RAG Responded Information</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {searchLogs.map((log) => (
                            <TableRow key={log.id} className="align-top">
                              <TableCell className="font-mono text-[10px] text-text-gray/80 pt-4">
                                {log.timestamp}
                              </TableCell>
                              <TableCell className="font-bold text-text-dark text-left pt-4 leading-relaxed whitespace-normal break-words max-w-[240px]">
                                {log.query}
                              </TableCell>
                              <TableCell className="text-left text-text-gray text-[11px] pt-4 leading-relaxed whitespace-pre-wrap break-words">
                                {log.response}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </Card>
              )}

              {/* VIEW: AI MANAGEMENT */}
              {currentView === "ai-management" && (
                <div className="space-y-6">
                  {/* Sub-Tab Navigation */}
                  <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3">
                    {[
                      { id: "ai-kb", label: "Knowledge Base", icon: Database },
                      { id: "ai-docs", label: "Documents", icon: FileText },
                      { id: "ai-chunks", label: "Chunk Explorer", icon: BookOpen },
                      { id: "ai-playground", label: "RAG Playground", icon: Search },
                      { id: "ai-monitors", label: "Monitors", icon: Activity },
                      { id: "ai-whatsapp", label: "WhatsApp Bot", icon: Bot },
                      { id: "ai-conversations", label: "Conversations", icon: Users },
                      { id: "ai-visualizer", label: "RAG Visualizer", icon: RefreshCw },
                    ].map((tab) => {
                      const TabIcon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setAiTab(tab.id);
                            if (tab.id === "ai-kb" || tab.id === "ai-docs" || tab.id === "ai-chunks") {
                              loadKnowledgeData();
                            } else if (tab.id !== "ai-playground") {
                              loadAiManagementData();
                            }
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            aiTab === tab.id
                              ? "bg-emerald-50 text-emerald-700 shadow-sm font-extrabold"
                              : "text-text-gray hover:bg-slate-50 hover:text-text-dark"
                          }`}
                        >
                          <TabIcon className="w-3.5 h-3.5 shrink-0" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {aiLoading ? (
                    <div className="h-44 flex items-center justify-center text-xs font-bold text-text-gray uppercase tracking-widest animate-pulse">
                      Loading AI Management Data...
                    </div>
                  ) : (
                    <>
                      {/* TAB 1: KNOWLEDGE BASE CONFIG */}
                      {aiTab === "ai-kb" && (
                        <div className="space-y-8 animate-fadeIn text-left">
                          {/* AI System Status Section */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <HeartPulse className="w-5 h-5 text-emerald-500 animate-pulse shrink-0" />
                              <h2 className="font-display font-extrabold text-lg text-text-dark font-sans leading-none">AI System Status</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Pinecone Card */}
                              <div className="rounded-2xl p-5 border shadow-sm transition-all flex flex-col justify-between"
                                   style={{
                                     background: "rgba(255, 255, 255, 0.45)",
                                     backdropFilter: "blur(12px)",
                                     borderColor: "rgba(226, 232, 240, 0.8)",
                                   }}>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-1.5">
                                      <Database className="w-4 h-4 text-emerald-600 shrink-0" />
                                      <span className="text-[10px] font-bold text-text-gray uppercase tracking-wider">Pinecone Database</span>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                      pineconeHealth?.status === "connected" || kbStats?.pinecone_status === "Operational"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-250/20"
                                        : "bg-amber-50 text-amber-700 border border-amber-250/20"
                                    }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${
                                        pineconeHealth?.status === "connected" || kbStats?.pinecone_status === "Operational"
                                          ? "bg-emerald-500 animate-pulse"
                                          : "bg-amber-500 animate-pulse"
                                      }`} />
                                      {pineconeHealth?.status === "connected" || kbStats?.pinecone_status === "Operational" ? "Connected" : "Disconnected"}
                                    </span>
                                  </div>
                                  <div className="space-y-1.5 text-[11px] font-sans">
                                    <div className="flex justify-between"><span className="text-text-gray/80 text-[10px]">Index:</span> <span className="font-mono font-bold text-text-dark text-[10px]">{pineconeHealth?.index || "campusconnect-ai"}</span></div>
                                    <div className="flex justify-between"><span className="text-text-gray/80 text-[10px]">Vectors:</span> <span className="font-bold text-text-dark">{pineconeHealth?.vectors !== undefined ? pineconeHealth.vectors : (kbStats?.total_chunks || "—")}</span></div>
                                    <div className="flex justify-between"><span className="text-text-gray/80 text-[10px]">Dimension:</span> <span className="font-bold text-text-dark">{pineconeHealth?.dimension || "1024 (Cosine)"}</span></div>
                                  </div>
                                </div>
                                <button
                                  onClick={testPineconeConnection}
                                  disabled={pineconeTesting}
                                  className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                                >
                                  {pineconeTesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                  {pineconeTesting ? "Testing..." : "Test Pinecone"}
                                </button>
                              </div>

                              {/* Groq LLM Card */}
                              <div className="rounded-2xl p-5 border shadow-sm transition-all flex flex-col justify-between"
                                   style={{
                                     background: "rgba(255, 255, 255, 0.45)",
                                     backdropFilter: "blur(12px)",
                                     borderColor: "rgba(226, 232, 240, 0.8)",
                                   }}>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-1.5">
                                      <Bot className="w-4 h-4 text-indigo-600 shrink-0" />
                                      <span className="text-[10px] font-bold text-text-gray uppercase tracking-wider">Groq LLM Service</span>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                      groqHealth?.status === "connected" || kbStats?.groq_status === "Operational"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-250/20"
                                        : "bg-amber-50 text-amber-700 border border-amber-250/20"
                                    }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${
                                        groqHealth?.status === "connected" || kbStats?.groq_status === "Operational"
                                          ? "bg-emerald-500 animate-pulse"
                                          : "bg-amber-500 animate-pulse"
                                      }`} />
                                      {groqHealth?.status === "connected" || kbStats?.groq_status === "Operational" ? "Connected" : "Disconnected"}
                                    </span>
                                  </div>
                                  <div className="space-y-1.5 text-[11px] font-sans">
                                    <div className="flex justify-between"><span className="text-text-gray/80 text-[10px]">Model:</span> <span className="font-bold text-text-dark">{groqHealth?.model || "llama-3.3-70b-versatile"}</span></div>
                                    <div className="flex justify-between"><span className="text-text-gray/80 text-[10px]">Latency:</span> <span className="font-bold text-text-dark">{groqHealth?.response_time ? `${groqHealth.response_time}s` : "1.2s (avg)"}</span></div>
                                    <div className="flex justify-between"><span className="text-text-gray/80 text-[10px]">Model Type:</span> <span className="font-bold text-indigo-600">llama-3.3-70b</span></div>
                                  </div>
                                </div>
                                <button
                                  onClick={testGroqConnection}
                                  disabled={groqTesting}
                                  className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                                >
                                  {groqTesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Bot className="w-3 h-3" />}
                                  {groqTesting ? "Testing..." : "Test Groq LLM"}
                                </button>
                              </div>

                              {/* Embedding Service Card */}
                              <div className="rounded-2xl p-5 border shadow-sm transition-all flex flex-col justify-between"
                                   style={{
                                     background: "rgba(255, 255, 255, 0.45)",
                                     backdropFilter: "blur(12px)",
                                     borderColor: "rgba(226, 232, 240, 0.8)",
                                   }}>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-1.5">
                                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                                      <span className="text-[10px] font-bold text-text-gray uppercase tracking-wider">Embedding Service</span>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                      embeddingHealth?.status === "connected" || kbStats?.pinecone_status === "Operational"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-250/20"
                                        : "bg-amber-50 text-amber-700 border border-amber-250/20"
                                    }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${
                                        embeddingHealth?.status === "connected" || kbStats?.pinecone_status === "Operational"
                                          ? "bg-emerald-500 animate-pulse"
                                          : "bg-amber-500 animate-pulse"
                                      }`} />
                                      {embeddingHealth?.status === "connected" || kbStats?.pinecone_status === "Operational" ? "Connected" : "Disconnected"}
                                    </span>
                                  </div>
                                  <div className="space-y-1.5 text-[11px] font-sans">
                                    <div className="flex justify-between"><span className="text-text-gray/80 text-[10px]">Model:</span> <span className="font-bold text-text-dark">{embeddingHealth?.model || "multilingual-e5-large"}</span></div>
                                    <div className="flex justify-between"><span className="text-text-gray/80 text-[10px]">Dimensions:</span> <span className="font-bold text-text-dark">{embeddingHealth?.dimension || "1024"}</span></div>
                                    <div className="flex justify-between"><span className="text-text-gray/80 text-[10px]">Total Chunks:</span> <span className="font-bold text-text-dark">{kbStats?.total_embeddings || "—"}</span></div>
                                  </div>
                                </div>
                                <button
                                  onClick={testEmbeddingConnection}
                                  disabled={embeddingTesting}
                                  className="mt-4 w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                                >
                                  {embeddingTesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                  {embeddingTesting ? "Testing..." : "Test Embedding"}
                                </button>
                              </div>
                            </div>
                          </div>

                          <hr className="border-slate-200/80 my-4" />

                          <div className="text-left">
                            <h2 className="font-display font-extrabold text-lg text-text-dark font-sans leading-none">Ingestion & Ingest Config</h2>
                            <p className="text-[11px] text-text-gray font-medium mt-1">Upload files and manage embedding chunk size parameters</p>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="lg:col-span-2 p-6 text-left space-y-4">
                              <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-text-gray">Ingestion Uploader</h3>
                              <div className="space-y-3.5">
                                <label className="text-[10px] font-bold text-text-gray uppercase block">Knowledge Base Directory Category</label>
                                <Select 
                                  value={kbCategory} 
                                  onChange={(e) => setKbCategory(e.target.value)}
                                  className="w-full text-xs font-sans"
                                  options={[
                                    { value: "General", label: "General Campus Directory" },
                                    { value: "Admissions", label: "Admissions & Eligibility" },
                                    { value: "Fees", label: "Fee Structures" },
                                    { value: "Placements", label: "Placements Statistics" },
                                    { value: "Hostel", label: "Hostel & Student Facilities" }
                                  ]}
                                />
                                
                                <div className="border-2 border-dashed border-slate-200 hover:border-primary/40 rounded-2xl p-8 text-center bg-slate-50/50 transition-colors relative">
                                  <input 
                                    type="file" 
                                    accept=".pdf,.docx,.txt,.md"
                                    onChange={(e) => e.target.files?.[0] && handleKbFileUpload(e.target.files[0])}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={kbUploading}
                                  />
                                  <div className="space-y-2.5">
                                    <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto" />
                                    <div>
                                      <p className="text-xs font-bold text-text-dark">Click to browse or drag file here</p>
                                      <p className="text-[10px] text-text-gray pt-1">PDF, DOCX, TXT or MD files up to 5MB</p>
                                    </div>
                                  </div>
                                </div>

                                {kbUploading && (
                                  <div className="space-y-1.5 pt-2">
                                    <div className="flex justify-between text-[10px] font-bold text-primary uppercase">
                                      <span>Uploading & Indexing document...</span>
                                      <span>{kbUploadProgress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-primary transition-all duration-300" style={{ width: `${kbUploadProgress}%` }}></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </Card>

                            <Card className="p-6 text-left space-y-4">
                              <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-text-gray">Splitter Parameters</h3>
                              <div className="space-y-3 font-sans text-xs">
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                  <span className="text-[9px] font-bold text-text-gray/80 uppercase">Embedding Target</span>
                                  <p className="font-bold text-text-dark pt-1">multilingual-e5-large</p>
                                  <p className="text-[9px] text-text-gray/60">1024 dimensions</p>
                                </div>
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                  <span className="text-[9px] font-bold text-text-gray/80 uppercase">Max Chunk Size</span>
                                  <p className="font-bold text-text-dark pt-1">1,000 characters</p>
                                </div>
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                  <span className="text-[9px] font-bold text-text-gray/80 uppercase">Chunk Overlap</span>
                                  <p className="font-bold text-text-dark pt-1">200 characters</p>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: DOCUMENT ANALYTICS */}
                      {aiTab === "ai-docs" && (
                        <div className="space-y-6 animate-fadeIn text-left">
                          <div className="text-left">
                            <h2 className="font-display font-extrabold text-lg text-text-dark font-sans">Document Analytics</h2>
                            <p className="text-[11px] text-text-gray font-medium">Index validation, files catalog, and status dashboard</p>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="bg-white border border-slate-200/60 p-4 rounded-xl text-left shadow-sm">
                              <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80">Total Files</h4>
                              <h3 className="text-lg font-display font-extrabold text-text-dark pt-1">{knowledgeDocs.length}</h3>
                            </div>
                            <div className="bg-white border border-slate-200/60 p-4 rounded-xl text-left shadow-sm">
                              <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80">Total Chunks</h4>
                              <h3 className="text-lg font-display font-extrabold text-text-dark pt-1">{kbStats?.total_chunks || 0}</h3>
                            </div>
                            <div className="bg-white border border-slate-200/60 p-4 rounded-xl text-left shadow-sm">
                              <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80">Indexed Count</h4>
                              <h3 className="text-lg font-display font-extrabold text-text-dark pt-1">{knowledgeDocs.filter((d: any) => d.status === "Indexed" || d.status === "Processed").length}</h3>
                            </div>
                            <div className="bg-white border border-slate-200/60 p-4 rounded-xl text-left shadow-sm">
                              <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80 font-sans">Namespace</h4>
                              <h3 className="text-sm font-mono font-extrabold text-indigo-600 pt-1">default</h3>
                            </div>
                            <div className="bg-white border border-slate-200/60 p-4 rounded-xl text-left shadow-sm">
                              <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80 font-sans">Last Ingestion</h4>
                              <h3 className="text-[10px] font-mono font-bold text-text-dark pt-1">{knowledgeDocs[0]?.created_at || 'Never'}</h3>
                            </div>
                          </div>

                          <Card className="overflow-hidden border border-slate-200/80 shadow-sm rounded-2xl bg-white/70 backdrop-blur-md">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-slate-50/70 border-b border-slate-200">
                                  <TableHead className="font-bold text-[10px] text-text-gray uppercase tracking-wider py-3.5">Filename</TableHead>
                                  <TableHead className="font-bold text-[10px] text-text-gray uppercase tracking-wider py-3.5">Upload Date</TableHead>
                                  <TableHead className="font-bold text-[10px] text-text-gray uppercase tracking-wider py-3.5">Category</TableHead>
                                  <TableHead className="font-bold text-[10px] text-text-gray uppercase tracking-wider py-3.5 text-center">Chunks</TableHead>
                                  <TableHead className="font-bold text-[10px] text-text-gray uppercase tracking-wider py-3.5 text-center">Embeddings</TableHead>
                                  <TableHead className="font-bold text-[10px] text-text-gray uppercase tracking-wider py-3.5 text-center">Pinecone</TableHead>
                                  <TableHead className="font-bold text-[10px] text-text-gray uppercase tracking-wider py-3.5">Status & Error</TableHead>
                                  <TableHead className="font-bold text-[10px] text-text-gray uppercase tracking-wider py-3.5 text-center">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {knowledgeDocs.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12 text-xs text-text-gray/75 italic">
                                      No documents in knowledge base. Upload one under the &ldquo;Knowledge Base&rdquo; tab.
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  knowledgeDocs.map((doc: any) => {
                                    const isIndexed = doc.status === "Indexed" || doc.status === "Processed";
                                    const isProcessing = doc.status === "Processing";
                                    const isFailed = doc.status === "Failed" || (doc.status && doc.status.startsWith("Failed"));

                                    return (
                                      <TableRow key={doc.id} className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors">
                                        {/* Filename */}
                                        <TableCell className="font-bold text-xs text-text-dark text-left py-4 truncate max-w-[200px]" title={doc.filename}>
                                          {doc.filename}
                                        </TableCell>
                                        {/* Upload Date */}
                                        <TableCell className="text-left font-mono text-[10px] text-text-gray py-4">
                                          {doc.upload_date || doc.created_at || "—"}
                                        </TableCell>
                                        {/* Category */}
                                        <TableCell className="text-left py-4">
                                          <Badge variant="info" className="text-[9px] px-2 py-0.5">{doc.category}</Badge>
                                        </TableCell>
                                        {/* Chunks */}
                                        <TableCell className="text-center font-mono text-xs font-bold text-indigo-600 py-4">
                                          {doc.chunk_count || 0}
                                        </TableCell>
                                        {/* Embeddings */}
                                        <TableCell className="text-center py-4">
                                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                                            isIndexed ? "text-emerald-700" : isProcessing ? "text-indigo-600 animate-pulse" : "text-red-600"
                                          }`}>
                                            {isIndexed ? (<><Check className="w-3 h-3" /> Done</>) : isProcessing ? "Running..." : (<><XCircle className="w-3 h-3" /> Failed</>)}
                                          </span>
                                        </TableCell>
                                        {/* Pinecone */}
                                        <TableCell className="text-center py-4">
                                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                                            isIndexed ? "text-emerald-700" : isProcessing ? "text-indigo-600 animate-pulse" : "text-red-600"
                                          }`}>
                                            {isIndexed ? (<><Database className="w-3 h-3" /> Synced</>) : isProcessing ? "Syncing..." : "Error"}
                                          </span>
                                        </TableCell>
                                        {/* Status & Error */}
                                        <TableCell className="text-left py-4 max-w-[220px]">
                                          {isFailed ? (
                                            <button
                                              onClick={() => setErrorModalDoc(doc)}
                                              className="flex items-center gap-1 text-[10px] font-bold text-red-600 hover:text-red-800 transition-colors cursor-pointer bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg border border-red-200/50"
                                            >
                                              <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                              <span className="truncate max-w-[130px]">{doc.error_message || "View failure cause"}</span>
                                            </button>
                                          ) : isProcessing ? (
                                            <span className="text-[10px] text-text-gray italic animate-pulse">Chunking & embedding...</span>
                                          ) : (
                                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50/50 border border-emerald-100/50 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                                              <Check className="w-3 h-3 text-emerald-600" /> Active in RAG
                                            </span>
                                          )}
                                        </TableCell>
                                        {/* Actions */}
                                        <TableCell className="py-4">
                                          <div className="flex items-center justify-center gap-1">
                                            <button
                                              onClick={() => handleViewChunks(doc)}
                                              className="p-2 hover:bg-slate-100 rounded-lg text-text-gray hover:text-indigo-600 transition-all cursor-pointer"
                                              disabled={!isIndexed}
                                              title="View Chunks"
                                            >
                                              <BookOpen className="w-4 h-4" />
                                            </button>
                                            <button
                                              onClick={() => handleKbDocReindex(doc.id)}
                                              className="p-2 hover:bg-slate-100 rounded-lg text-text-gray hover:text-emerald-700 transition-all cursor-pointer"
                                              disabled={isProcessing}
                                              title="Re-index Document"
                                            >
                                              <RefreshCw className="w-4 h-4" />
                                            </button>
                                            <button
                                              onClick={() => handleKbDocDelete(doc.id)}
                                              className="p-2 hover:bg-red-50 rounded-lg text-text-gray hover:text-red-600 transition-all cursor-pointer"
                                              title="Delete document"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })
                                )}
                              </TableBody>
                            </Table>
                          </Card>
                        </div>
                      )}

                      {/* TAB 3: CHUNK EXPLORER */}
                      {aiTab === "ai-chunks" && (
                        <div className="space-y-6 animate-fadeIn text-left">
                          <div className="text-left">
                            <h2 className="font-display font-extrabold text-lg text-text-dark font-sans">Chunk Explorer</h2>
                            <p className="text-[11px] text-text-gray font-medium">Select a document below to inspect parsed RAG segments</p>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="p-5 text-left space-y-3.5 h-fit bg-white">
                              <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-text-gray">Source Document Selection</h3>
                              <div className="space-y-2">
                                {knowledgeDocs.map((doc) => (
                                  <button
                                    key={doc.id}
                                    onClick={() => handleViewChunks(doc)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                      selectedDocForChunks?.id === doc.id 
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                                        : 'bg-white border-slate-200/60 hover:bg-slate-50 text-text-dark'
                                    }`}
                                  >
                                    <div className="truncate max-w-[200px]">
                                      <p className="text-xs font-bold truncate">{doc.filename}</p>
                                      <span className="text-[9px] text-text-gray block">{doc.category}</span>
                                    </div>
                                    <Badge variant="info" className="text-[9px]">{doc.chunk_count || 0}</Badge>
                                  </button>
                                ))}
                              </div>
                            </Card>

                            <div className="lg:col-span-2 space-y-4">
                              {selectedDocForChunks ? (
                                <Card className="p-6 text-left space-y-4">
                                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <div>
                                      <h3 className="font-display font-extrabold text-sm text-text-dark">Parsed Segments</h3>
                                      <p className="text-[10px] text-text-gray">Citations for {selectedDocForChunks.filename}</p>
                                    </div>
                                    <span className="text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                                      {chunksList.length} Chunks
                                    </span>
                                  </div>

                                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                                    {chunksLoading ? (
                                      <div className="p-12 text-center text-xs font-bold text-text-gray uppercase tracking-widest animate-pulse">
                                        Generating chunks list...
                                      </div>
                                    ) : (
                                      chunksList.map((chunk, idx) => (
                                        <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2.5 animate-fadeIn">
                                          <div className="flex items-center justify-between">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700">
                                              CHUNK #{idx + 1}
                                            </span>
                                            <span className="text-[9px] font-mono text-text-gray font-bold">
                                              Tokens: ~{Math.round(chunk.length / 4)} | Characters: {chunk.length}
                                            </span>
                                          </div>
                                          <p className="text-[11px] leading-relaxed text-text-dark font-mono bg-white p-3 rounded-lg border border-slate-200/50 whitespace-pre-wrap select-all select-text">
                                            {chunk}
                                          </p>
                                          <div className="text-[8px] font-mono text-text-gray text-right truncate">
                                            Embedding ID: {selectedDocForChunks.id}_chunk_{idx}
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </Card>
                              ) : (
                                <Card className="p-12 text-center text-xs font-bold text-text-gray uppercase tracking-widest bg-white">
                                  No document selected to view chunks
                                </Card>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 3.5: RAG PLAYGROUND */}
                      {aiTab === "ai-playground" && (
                        <div className="space-y-6 animate-fadeIn text-left">
                          <div className="text-left">
                            <h2 className="font-display font-extrabold text-lg text-text-dark font-sans">RAG Playground</h2>
                            <p className="text-[11px] text-text-gray font-medium">Test semantic retrieval, check chunk relevance scores, and verify LLM answers</p>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Input Form & Suggested Queries */}
                            <Card className="p-6 text-left space-y-4 h-fit bg-white border border-slate-200/60 shadow-sm">
                              <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-text-gray">Test Query Interface</h3>
                              <div className="space-y-4 font-sans text-xs">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-text-gray uppercase block">Enter Student Question</label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={playgroundQuery}
                                      onChange={(e) => setPlaygroundQuery(e.target.value)}
                                      onKeyDown={(e) => e.key === "Enter" && handlePlaygroundQuery()}
                                      placeholder="Ask about fees, admissions, placements..."
                                      className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs text-text-dark"
                                      disabled={playgroundLoading}
                                    />
                                    <button
                                      onClick={handlePlaygroundQuery}
                                      disabled={playgroundLoading || !playgroundQuery.trim()}
                                      className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-lg text-text-gray hover:text-emerald-600 transition-colors cursor-pointer"
                                    >
                                      <Search className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                <Button
                                  onClick={handlePlaygroundQuery}
                                  disabled={playgroundLoading || !playgroundQuery.trim()}
                                  className="w-full py-2.5 bg-emerald-650 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2"
                                >
                                  {playgroundLoading ? (
                                    <>
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                      Querying pipeline...
                                    </>
                                  ) : (
                                    "Execute RAG Chain"
                                  )}
                                </Button>

                                <div className="pt-4 border-t border-slate-100 space-y-2">
                                  <span className="text-[9px] font-bold text-text-gray uppercase block">Sample Test Scenarios</span>
                                  {[
                                    "What are the fees for B.Tech CSE?",
                                    "What was the highest package offered in placements?",
                                    "Is there a hostel facility inside the campus?",
                                    "What eligibility criteria exist for admission?"
                                  ].map((q, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => {
                                        setPlaygroundQuery(q);
                                      }}
                                      className="w-full p-2 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-lg text-left text-[11px] text-text-gray hover:text-text-dark transition-all block cursor-pointer truncate"
                                      disabled={playgroundLoading}
                                    >
                                      {q}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </Card>

                            {/* Results & Debug View */}
                            <div className="lg:col-span-2 space-y-4">
                              {playgroundLoading && (
                                <Card className="p-12 text-center text-xs font-bold text-text-gray uppercase tracking-widest bg-white animate-pulse flex flex-col items-center justify-center gap-3">
                                  <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                                  Evaluating RAG pipeline retrieval & synthesis...
                                </Card>
                              )}

                              {!playgroundLoading && !playgroundResult && (
                                <Card className="p-12 text-center text-xs font-bold text-text-gray uppercase tracking-widest bg-white">
                                  Enter a question to inspect RAG execution results
                                </Card>
                              )}

                              {!playgroundLoading && playgroundResult && (
                                <div className="space-y-5 animate-fadeIn">
                                  {/* Consolidated generated response */}
                                  <Card className="p-6 text-left space-y-3.5 bg-white border border-slate-200/60 shadow-sm">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                      <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-text-gray">Synthesized AI Response</h3>
                                      <Badge variant={playgroundResult.has_context ? "success" : "danger"} className="text-[9px]">
                                        {playgroundResult.has_context ? "Context Found" : "No Context"}
                                      </Badge>
                                    </div>
                                    <div className="text-xs leading-relaxed text-text-dark font-sans bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
                                      {playgroundResult.answer}
                                    </div>
                                  </Card>

                                  {/* Retrieved documents summary */}
                                  <Card className="p-6 text-left space-y-3.5 bg-white border border-slate-200/60 shadow-sm">
                                    <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-text-gray">Sources Referenced</h3>
                                    {playgroundResult.retrieved_documents && playgroundResult.retrieved_documents.length > 0 ? (
                                      <div className="flex flex-wrap gap-2 pt-1">
                                        {playgroundResult.retrieved_documents.map((doc: string, idx: number) => (
                                          <Badge key={idx} variant="info" className="text-[10px] px-2.5 py-1">
                                            {doc}
                                          </Badge>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-[11px] text-text-gray italic">No source files cited in context</p>
                                    )}
                                  </Card>

                                  {/* Ranked Semantic vector matches */}
                                  <Card className="p-6 text-left space-y-4 bg-white border border-slate-200/60 shadow-sm">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                      <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-text-gray">Ranked Vector Database Chunks</h3>
                                      <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                                        {playgroundResult.chunks_retrieved} Matches
                                      </span>
                                    </div>

                                    <div className="space-y-3.5 max-h-[40vh] overflow-y-auto pr-1 font-sans">
                                      {playgroundResult.matches && playgroundResult.matches.length > 0 ? (
                                        playgroundResult.matches.map((match: any, idx: number) => (
                                          <div key={idx} className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2.5">
                                            <div className="flex items-center justify-between text-[10px]">
                                              <span className="inline-flex items-center px-2 py-0.5 rounded-full font-mono font-bold bg-indigo-50 text-indigo-700 text-[9px]">
                                                MATCH #{idx + 1}
                                              </span>
                                              <span className="font-mono text-emerald-600 font-extrabold">{match.score}% Score</span>
                                            </div>

                                            {/* Relevance score visual bar */}
                                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                              <div 
                                                className={`h-full rounded-full transition-all ${
                                                  match.score > 70 ? "bg-emerald-500" : match.score > 55 ? "bg-amber-500" : "bg-red-400"
                                                }`}
                                                style={{ width: `${match.score}%` }}
                                              ></div>
                                            </div>

                                            <p className="text-[11px] leading-relaxed text-text-dark font-mono bg-white p-3 rounded-lg border border-slate-200/50 whitespace-pre-wrap select-text">
                                              {match.text}
                                            </p>

                                            <div className="flex justify-between items-center text-[8px] font-mono text-text-gray">
                                              <span>Source File: {match.filename}</span>
                                              <span>Chunk Index: #{match.chunk_number}</span>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-[11px] text-text-gray italic text-center py-4">No chunks met relevance search constraints</p>
                                      )}
                                    </div>
                                  </Card>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 4: EMBEDDING, PINECONE, GROQ MONITORS */}
                      {aiTab === "ai-monitors" && (
                        <div className="space-y-6 animate-fadeIn text-left">
                          <div className="text-left">
                            <h2 className="font-display font-extrabold text-lg text-text-dark font-sans">API & Vector Database Monitors</h2>
                            <p className="text-[11px] text-text-gray font-medium">Validations and health status checks for external services</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Ingestion Embedding model */}
                            <Card className="p-6 text-left space-y-4">
                              <div className="flex justify-between items-center">
                                <h3 className="font-display font-extrabold text-sm text-text-dark flex items-center gap-2 font-sans">
                                  <Activity className="w-4.5 h-4.5 text-indigo-600" /> Ingestion Model
                                </h3>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                              </div>
                              <p className="text-[10px] text-text-gray font-normal leading-relaxed">
                                Validates textual documents conversion into mathematical float arrays.
                              </p>
                              <div className="pt-2 space-y-2 text-xs font-sans">
                                <div className="flex justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                                  <span className="font-bold text-text-gray">Model</span>
                                  <span className="font-mono text-text-dark font-bold">multilingual-e5-large</span>
                                </div>
                                <div className="flex justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                                  <span className="font-bold text-text-gray">Dimensions</span>
                                  <span className="font-mono text-text-dark font-bold">1024</span>
                                </div>
                                <div className="flex justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                                  <span className="font-bold text-text-gray">Status</span>
                                  <span className="font-bold text-emerald-600 uppercase">Operational</span>
                                </div>
                              </div>
                            </Card>

                            {/* Pinecone Vector DB */}
                            <Card className="p-6 text-left space-y-4">
                              <div className="flex justify-between items-center">
                                <h3 className="font-display font-extrabold text-sm text-text-dark flex items-center gap-2 font-sans">
                                  <Database className="w-4.5 h-4.5 text-indigo-600" /> Pinecone Monitor
                                </h3>
                                <div className={`w-2.5 h-2.5 rounded-full ${systemHealth?.services?.pinecone === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}></div>
                              </div>
                              <p className="text-[10px] text-text-gray font-normal leading-relaxed">
                                Index status check for semantic retrieval search query responses.
                              </p>
                              <div className="pt-2 space-y-2 text-xs font-sans">
                                <div className="flex justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                                  <span className="font-bold text-text-gray">Index Name</span>
                                  <span className="font-mono text-text-dark font-bold">campusconnect-ai</span>
                                </div>
                                <div className="flex justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                                  <span className="font-bold text-text-gray">Distance Metric</span>
                                  <span className="font-mono text-text-dark font-bold">Cosine Similarity</span>
                                </div>
                                <div className="flex justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                                  <span className="font-bold text-text-gray">API Connection</span>
                                  <span className={`font-bold ${systemHealth?.services?.pinecone === 'connected' ? 'text-emerald-600' : 'text-red-500'} uppercase`}>
                                    {systemHealth?.services?.pinecone || 'Disconnected'}
                                  </span>
                                </div>
                              </div>
                            </Card>

                            {/* Groq LLM API */}
                            <Card className="p-6 text-left space-y-4">
                              <div className="flex justify-between items-center">
                                <h3 className="font-display font-extrabold text-sm text-text-dark flex items-center gap-2 font-sans">
                                  <Sparkles className="w-4.5 h-4.5 text-indigo-600" /> Groq Monitor
                                </h3>
                                <div className={`w-2.5 h-2.5 rounded-full ${systemHealth?.services?.groq === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}></div>
                              </div>
                              <p className="text-[10px] text-text-gray font-normal leading-relaxed">
                                Synthesis model endpoint validator for text reply content generation.
                              </p>
                              <div className="pt-2 space-y-2 text-xs font-sans">
                                <div className="flex justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                                  <span className="font-bold text-text-gray">Model</span>
                                  <span className="font-mono text-text-dark font-bold">Llama-3.3-70B</span>
                                </div>
                                <div className="flex justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                                  <span className="font-bold text-text-gray">Max Output</span>
                                  <span className="font-mono text-text-dark font-bold">8,192 Tokens</span>
                                </div>
                                <div className="flex justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                                  <span className="font-bold text-text-gray">Status</span>
                                  <span className={`font-bold ${systemHealth?.services?.groq === 'connected' ? 'text-emerald-600' : 'text-red-500'} uppercase`}>
                                    {systemHealth?.services?.groq === 'connected' ? 'Connected' : 'Missing Key'}
                                  </span>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </div>
                      )}

                      {/* TAB 5: WHATSAPP BOT STATUS */}
                      {aiTab === "ai-whatsapp" && (
                        <div className="space-y-6 animate-fadeIn text-left">
                          <div className="text-left">
                            <h2 className="font-display font-extrabold text-lg text-text-dark font-sans">WhatsApp Bot</h2>
                            <p className="text-[11px] text-text-gray font-medium">Wasender integration status and messaging statistics</p>
                          </div>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl text-left shadow-sm">
                              <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80 font-sans">Connection</h4>
                              <div className="flex items-center gap-2 pt-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${waStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}></div>
                                <span className="text-sm font-display font-extrabold text-text-dark">{waStatus?.device_status || 'Offline'}</span>
                              </div>
                            </div>
                            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl text-left shadow-sm">
                              <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80 font-sans">Today Messages</h4>
                              <h3 className="text-xl font-display font-extrabold text-text-dark pt-1">{waStatus?.today_messages || 0}</h3>
                            </div>
                            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl text-left shadow-sm">
                              <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80 font-sans">Total Messages</h4>
                              <h3 className="text-xl font-display font-extrabold text-text-dark pt-1">{waStatus?.monthly_messages || 0}</h3>
                            </div>
                            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl text-left shadow-sm">
                              <h4 className="text-[9px] uppercase tracking-wider font-bold text-text-gray/80 font-sans">Active Chats</h4>
                              <h3 className="text-xl font-display font-extrabold text-text-dark pt-1">{waStatus?.active_conversations || 0}</h3>
                            </div>
                          </div>

                          <Card className="p-6 text-left bg-white">
                            <h3 className="font-display font-extrabold text-sm text-text-dark pb-4">Connection Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                              {[
                                { label: "WhatsApp Number", value: waStatus?.whatsapp_number || "Connected via API" },
                                { label: "Device Status", value: waStatus?.device_status || "Connected" },
                                { label: "API Status", value: waStatus?.api_status || "Healthy" },
                                { label: "Session Status", value: waStatus?.session_status || "Active" },
                                { label: "Webhook", value: waStatus?.webhook_status || "Active" },
                                { label: "Total Conversations", value: String(waStatus?.total_conversations || 0) },
                              ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-gray">{item.label}</span>
                                  <span className="text-[11px] font-bold text-text-dark font-mono">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </Card>
                        </div>
                      )}

                      {/* TAB 6: CONVERSATIONS MONITOR */}
                      {aiTab === "ai-conversations" && (
                        <div className="space-y-6 animate-fadeIn text-left">
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <h2 className="font-display font-extrabold text-lg text-text-dark font-sans">Conversations Monitor</h2>
                              <p className="text-[11px] text-text-gray font-medium">{waConversations.length} active WhatsApp conversations</p>
                            </div>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-gray" />
                              <input
                                type="text"
                                placeholder="Search by phone..."
                                value={waSearchQuery}
                                onChange={(e) => setWaSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-[11px] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-56"
                              />
                            </div>
                          </div>

                          {selectedConvo ? (
                            <Card className="p-6 text-left space-y-6 bg-white">
                              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                <div>
                                  <h3 className="font-display font-extrabold text-sm text-text-dark">Chat: {selectedConvo.phone_number}</h3>
                                  <p className="text-[10px] text-text-gray font-medium">Last active: {selectedConvo.last_interaction}</p>
                                </div>
                                <button
                                  onClick={() => setSelectedConvo(null)}
                                  className="px-3.5 py-1.5 rounded-full border border-slate-200 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
                                >
                                  Back to List
                                </button>
                              </div>

                              {/* Scrollable Conversation Chat Messages */}
                              <div className="pt-2 space-y-4 max-h-[50vh] overflow-y-auto pr-1 flex flex-col gap-2">
                                {(selectedConvo.history || []).map((msg: any, idx: number) => {
                                  const isUser = msg.role === "user";
                                  const isAdmin = msg.sender === "admin";
                                  
                                  return (
                                    <div key={idx} className={`flex flex-col ${isUser ? "items-end text-right" : "items-start text-left"} space-y-1`}>
                                      <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                                        isUser 
                                          ? "bg-emerald-50 text-emerald-800 border border-emerald-100/80 rounded-br-sm" 
                                          : isAdmin
                                            ? "bg-blue-50 text-blue-800 border border-blue-100/80 rounded-bl-sm"
                                            : "bg-slate-50 text-text-dark border border-slate-100 rounded-bl-sm"
                                      }`}>
                                        <p className="whitespace-pre-line font-medium">{msg.content}</p>
                                      </div>
                                      <div className="flex items-center gap-1.5 px-1.5">
                                        <span className="text-[8px] text-text-gray font-bold uppercase tracking-wider">
                                          {isUser ? "Student" : isAdmin ? "Admin (You)" : "CampusConnect AI"}
                                        </span>
                                        {msg.timestamp && (
                                          <span className="text-[8px] text-text-gray/40 font-mono font-medium">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                                {(selectedConvo.history || []).length === 0 && (
                                  <div className="p-8 text-center text-[10px] uppercase font-bold text-text-gray tracking-wider">
                                    No messages in this conversation yet.
                                  </div>
                                )}
                              </div>

                              {/* Admin Response Box */}
                              <div className="border-t border-slate-100 pt-4 flex gap-3 items-end">
                                <textarea
                                  value={convoReplyText}
                                  onChange={(e) => setConvoReplyText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      handleSendAdminReply();
                                    }
                                  }}
                                  placeholder="Type your reply here to send to the student (Press Enter to Send)..."
                                  rows={2}
                                  className="flex-grow px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none font-sans"
                                />
                                <button
                                  onClick={handleSendAdminReply}
                                  disabled={!convoReplyText.trim() || sendingReply}
                                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-600/10"
                                >
                                  {sendingReply ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Send className="w-3.5 h-3.5" />
                                  )}
                                  <span>Send Reply</span>
                                </button>
                              </div>
                            </Card>
                          ) : (
                            <div className="space-y-2">
                              {waConversations
                                .filter((c: any) => !waSearchQuery || c.phone_number.includes(waSearchQuery))
                                .map((convo: any, idx: number) => (
                                  <button
                                    key={idx}
                                    onClick={() => setSelectedConvo(convo)}
                                    className="w-full flex items-center justify-between p-4 bg-white border border-slate-200/60 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-[10px] font-extrabold">
                                        {convo.phone_number?.slice(-2) || "?"}
                                      </div>
                                      <div>
                                        <h4 className="text-[11px] font-bold text-text-dark">{convo.phone_number}</h4>
                                        <p className="text-[10px] text-text-gray truncate max-w-[280px]">{convo.last_message || "—"}</p>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className="text-[9px] text-text-gray font-medium">{convo.last_interaction}</span>
                                      <div className="pt-0.5">
                                        <Badge variant="info" className="text-[8px]">{convo.conversation_length || 0} turns</Badge>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              {waConversations.length === 0 && (
                                <div className="p-12 text-center text-xs font-bold text-text-gray uppercase tracking-widest bg-white">
                                  No WhatsApp conversations yet
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* TAB 7: RAG PIPELINE VISUALIZATION */}
                      {aiTab === "ai-visualizer" && (
                        <div className="space-y-6 animate-fadeIn text-left">
                          <div className="text-left">
                            <h2 className="font-display font-extrabold text-lg text-text-dark font-sans">RAG Pipeline Visualization</h2>
                            <p className="text-[11px] text-text-gray font-medium">Interactive schematic mapping semantic database queries flow</p>
                          </div>

                          <Card className="p-8 bg-slate-900 text-white relative overflow-hidden rounded-3xl border border-slate-800 shadow-xl text-center space-y-8">
                            <div className="space-y-2">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/25 text-emerald-400 border border-emerald-500/20">
                                <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" /> Live Pipeline
                              </span>
                              <h3 className="font-display font-extrabold text-sm sm:text-base text-white tracking-tight">Semantic Query Execution Flow</h3>
                            </div>

                            {/* Flow schematic visualizer with animation steps */}
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center relative z-10 text-xs py-4 font-sans font-medium text-slate-300">
                              
                              {/* Step 1 */}
                              <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl space-y-2.5 relative">
                                <span className="absolute -top-3 left-4 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[8px] font-bold">1. PROMPT</span>
                                <Bot className="w-6 h-6 text-emerald-400 mx-auto" />
                                <p className="font-bold text-[10px]">User Query</p>
                                <p className="text-[9px] text-slate-400 leading-relaxed font-normal">Student prompts WhatsApp</p>
                              </div>

                              {/* Arrow 1 */}
                              <div className="hidden md:block text-slate-600 font-bold text-base">➔</div>

                              {/* Step 2 */}
                              <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl space-y-2.5 relative">
                                <span className="absolute -top-3 left-4 bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[8px] font-bold">2. EMBED</span>
                                <Activity className="w-6 h-6 text-indigo-400 mx-auto" />
                                <p className="font-bold text-[10px]">Embedding Model</p>
                                <p className="text-[9px] text-slate-400 leading-relaxed font-normal">e5-large vector convert</p>
                              </div>

                              {/* Arrow 2 */}
                              <div className="hidden md:block text-slate-600 font-bold text-base">➔</div>

                              {/* Step 3 */}
                              <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl space-y-2.5 relative">
                                <span className="absolute -top-3 left-4 bg-blue-600 text-white px-2 py-0.5 rounded-full text-[8px] font-bold">3. INDEX</span>
                                <Database className="w-6 h-6 text-blue-400 mx-auto" />
                                <p className="font-bold text-[10px]">Pinecone Index</p>
                                <p className="text-[9px] text-slate-400 leading-relaxed font-normal">Cosine search match</p>
                              </div>

                              {/* Arrow 3 */}
                              <div className="hidden md:block text-slate-600 font-bold text-base">➔</div>

                              {/* Step 4 */}
                              <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl space-y-2.5 relative col-span-2">
                                <span className="absolute -top-3 left-4 bg-violet-600 text-white px-2 py-0.5 rounded-full text-[8px] font-bold">4. LLM INFERENCE</span>
                                <Sparkles className="w-6 h-6 text-violet-400 mx-auto animate-bounce" />
                                <p className="font-bold text-[10px]">Groq Llama 3.3 70B</p>
                                <p className="text-[9px] text-slate-400 leading-relaxed font-normal">Generates factual response with source citations</p>
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </main>

      </div>

      {/* Document Chunks View Overlay Modal */}
      {selectedDocForChunks && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col p-6 overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="text-left">
                <h3 className="font-display font-extrabold text-sm text-text-dark">
                  Document Chunks: {selectedDocForChunks.filename}
                </h3>
                <p className="text-[10px] text-text-gray font-medium">
                  Showing {chunksList.length} chunks extracted using 1000/200 split size.
                </p>
              </div>
              <button 
                onClick={() => setSelectedDocForChunks(null)}
                className="px-3.5 py-1.5 rounded-full border border-slate-200 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto py-4 space-y-3.5">
              {chunksLoading ? (
                <div className="p-12 text-xs font-bold text-text-gray uppercase tracking-widest animate-pulse">
                  Parsing chunks from document...
                </div>
              ) : chunksList.length === 0 ? (
                <div className="p-12 text-xs font-bold text-text-gray uppercase tracking-widest">
                  No chunks extracted.
                </div>
              ) : (
                chunksList.map((chunk, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-left space-y-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700">
                      CHUNK #{idx + 1}
                    </span>
                    <p className="text-[11px] leading-relaxed text-text-dark font-mono bg-white p-3 rounded-lg border border-slate-200/50 select-all whitespace-pre-wrap">
                      {chunk}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Indexing Failure Error Modal */}
      {errorModalDoc && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setErrorModalDoc(null)}>
          <div className="w-full max-w-lg" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <Card className="w-full p-6 shadow-2xl bg-white text-left">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-650" />
                  <h3 className="font-display font-extrabold text-sm text-text-dark">
                    Indexing Failure Details
                  </h3>
                </div>
                <button
                  onClick={() => setErrorModalDoc(null)}
                  className="px-3.5 py-1.5 rounded-full border border-slate-200 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>

              <div className="py-4 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-text-gray uppercase">Document Reference</span>
                  <p className="text-xs font-bold text-text-dark">{errorModalDoc.filename}</p>
                  <span className="text-[9px] text-text-gray block font-mono">ID: {errorModalDoc.id}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-text-gray uppercase">Error Diagnostics</span>
                  <div className="bg-red-50/70 border border-red-200 p-4 rounded-xl">
                    <p className="text-xs font-mono font-bold text-red-700 leading-relaxed break-words whitespace-pre-wrap">
                      {errorModalDoc.error_message || "Indexing process failed silently without outputting a message trace. Verify your API connections and model permissions."}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-1 text-xs">
                  <span className="text-[9px] font-bold text-text-gray uppercase block">Suggested Resolutions</span>
                  <ul className="list-disc pl-4 space-y-1 text-text-gray text-[11px] font-medium">
                    <li>Verify if your <span className="font-semibold text-text-dark">PINECONE_API_KEY</span> is active and matches the index.</li>
                    <li>Check if the Pinecone index dimension matches (1024 or 1536).</li>
                    <li>Ensure the backend can write to <span className="font-mono bg-slate-100 px-1 rounded">public/uploads/kb</span>.</li>
                    <li>Check backend logs for detailed traceback.</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => {
                    const docId = errorModalDoc.id;
                    setErrorModalDoc(null);
                    handleKbDocReindex(docId);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-index Document
                </button>
                <button
                  onClick={() => setErrorModalDoc(null)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-text-dark text-xs font-bold rounded-xl cursor-pointer transition-all"
                >
                  Close
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
