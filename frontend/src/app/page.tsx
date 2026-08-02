"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Search, BookOpen, ArrowRight, Trophy, GraduationCap, 
  Users, CheckCircle2, Cpu, Settings, Briefcase, Mail, Phone, MapPin, 
  FolderDown, Calendar, Shield, ExternalLink
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";

export default function HomePage() {
  const router = useRouter();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [initialQuestion, setInitialQuestion] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStream, setSelectedStream] = useState("all");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [facultyFilter, setFacultyFilter] = useState("all");

  const handleOpenAI = (question?: string) => {
    setInitialQuestion(question);
    setAiModalOpen(true);
  };

  const handleCloseAI = () => {
    setAiModalOpen(false);
    setInitialQuestion(undefined);
  };

  // Keyboard shortcut listener for Ctrl + K to open search/AI
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        handleOpenAI();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const streams = [
    { id: "all", label: "All Streams", icon: GraduationCap },
    { id: "cse", label: "Computer Science", icon: Cpu },
    { id: "aids", label: "AI & Data Science", icon: Sparkles },
    { id: "ece", label: "Electronics", icon: Settings },
    { id: "mech", label: "Mechanical", icon: Briefcase },
    { id: "civil", label: "Civil", icon: MapPin },
  ];

  const degreeOptions = [
    { value: "all", label: "Select Degree" },
    { value: "b-tech", label: "B.Tech" },
    { value: "m-tech", label: "M.Tech" },
    { value: "mba", label: "MBA" }
  ];

  const facultyOptions = [
    { value: "all", label: "Select Faculty" },
    { value: "engineering", label: "Engineering" },
    { value: "science", label: "Science & Humanities" },
    { value: "management", label: "Management Studies" }
  ];

  const programsList = [
    {
      id: "cse",
      stream: "cse",
      degree: "B.TECH",
      title: "B.Tech Computer Science and Engineering",
      description: "Build strong fundamentals in programming, algorithms, systems design, and software development with AI specialization options.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
      stats: { duration: "4 Years", faculty: "25 Faculty", labs: "5 Labs", placement: "96% Placed" },
      icon: Cpu,
      color: "blue"
    },
    {
      id: "aids",
      stream: "aids",
      degree: "B.TECH",
      title: "B.Tech AI & Data Science",
      description: "Specialized program in artificial intelligence, machine learning, data analytics, neural networks, and intelligent system designs.",
      image: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=800",
      stats: { duration: "4 Years", faculty: "18 Faculty", labs: "5 Labs", placement: "96% Placed" },
      icon: Sparkles,
      color: "indigo"
    },
    {
      id: "ece",
      stream: "ece",
      degree: "B.TECH",
      title: "B.Tech Electronics & Communication Engineering",
      description: "Learn about electronic system integrations, communication networks, VLSI architecture, and advanced signal processing setups.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
      stats: { duration: "4 Years", faculty: "22 Faculty", labs: "6 Labs", placement: "90% Placed" },
      icon: Settings,
      color: "emerald"
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    handleOpenAI(`Tell me about courses related to ${searchQuery}`);
  };

  const filteredPrograms = programsList.filter(p => {
    if (selectedStream !== "all" && p.stream !== selectedStream) return false;
    return true;
  });

  return (
    <>
      <Navbar onAIClick={() => handleOpenAI()} />

      <main className="min-h-screen bg-bg-soft font-sans pt-28 pb-16">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-12">
          <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-slate-900/10 min-h-[580px] flex items-center bg-slate-950">
            {/* Background Campus Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-85"
              style={{ backgroundImage: 'url("/hero_campus.png")' }}
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 card-overlay z-10" />

            {/* Hero Content Grid */}
            <div className="relative z-20 w-full max-w-3xl px-8 sm:px-12 md:px-16 py-16 text-left space-y-6">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20 backdrop-blur-sm">
                Academics
              </span>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
                Engineering & Science <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Programs</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                Explore our industry-aligned undergraduate programs designed to build strong foundations, practical skills, and future-ready careers in engineering and technology.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button 
                  variant="primary" 
                  onClick={() => router.push("/courses")}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Explore Programs
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleOpenAI("Give me the academic curriculum for engineering")}
                  leftIcon={<BookOpen className="w-3.5 h-3.5 text-white" />}
                  className="!text-white border-white/30 hover:bg-white/10"
                >
                  View Curriculum
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/admin/login")}
                  leftIcon={<Shield className="w-3.5 h-3.5 text-white" />}
                  className="!text-white border-white/30 hover:bg-white/10"
                >
                  Admin Portal
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH & FILTERS SECTION */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative -mt-20 z-30 mb-20">
          <div className="glass-search rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5">
            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">
              {/* Core Search Bar Row */}
              <div className="flex flex-col md:flex-row items-center gap-3 bg-white rounded-2xl p-2 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 pl-3 w-full">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What program or course are you looking for?"
                    className="w-full focus:outline-none text-xs sm:text-sm font-sans placeholder-slate-400 text-text-dark"
                  />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-between md:justify-end px-2">
                  <span className="hidden lg:inline-flex px-2.5 py-1 rounded bg-slate-100 text-[10px] text-text-gray font-bold font-mono">
                    Ctrl + K
                  </span>
                  <Button 
                    type="submit" 
                    variant="primary"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    className="bg-gradient-to-r from-primary to-indigo-600 border-none hover:shadow-indigo-500/10 px-8"
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Filtering Controls Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="w-full sm:w-44">
                    <Select
                      options={degreeOptions}
                      value={degreeFilter}
                      onChange={(e) => setDegreeFilter(e.target.value)}
                      className="!py-2 bg-transparent text-[11px]"
                    />
                  </div>
                  <div className="w-full sm:w-44">
                    <Select
                      options={facultyOptions}
                      value={facultyFilter}
                      onChange={(e) => setFacultyFilter(e.target.value)}
                      className="!py-2 bg-transparent text-[11px]"
                    />
                  </div>
                </div>

                {/* Popular Chip tags */}
                <div className="flex flex-wrap items-center gap-2">
                  {["[CSE]", "[AI & DS]", "[ECE]", "[MECH]", "[CIVIL]", "[IT]"].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        const cleanTag = chip.replace("[", "").replace("]", "");
                        handleOpenAI(`Tell me about the ${cleanTag} department`);
                      }}
                      className="px-3.5 py-1 rounded-lg text-[10px] font-bold font-mono text-primary/80 bg-blue-50/50 hover:bg-blue-50 border border-blue-100/50 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                  <button 
                    type="button"
                    onClick={() => router.push("/courses")}
                    className="px-3 py-1 text-[10px] text-text-gray hover:text-text-dark font-bold font-mono"
                  >
                    More ▾
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* STREAM CATEGORIES BAR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-12">
          <div className="flex flex-col gap-4 text-left">
            <span className="font-display font-bold text-[10px] uppercase tracking-wider text-text-gray/80">
              Browse by Stream
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {streams.map((stream) => {
                const Icon = stream.icon;
                const isActive = selectedStream === stream.id;
                return (
                  <button
                    key={stream.id}
                    onClick={() => setSelectedStream(stream.id)}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 ${
                      isActive 
                        ? "bg-primary text-white shadow-md shadow-primary/20 scale-105" 
                        : "bg-white text-text-gray hover:text-text-dark border border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {stream.label}
                  </button>
                );
              })}
              <button 
                onClick={() => router.push("/courses")}
                className="px-4 py-2 text-xs font-bold text-text-gray hover:text-text-dark"
              >
                More ▾
              </button>
            </div>
          </div>
        </section>

        {/* PROGRAM CARDS GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((prog) => {
              const Icon = prog.icon;
              return (
                <Card key={prog.id} className="group flex flex-col h-full bg-white relative">
                  
                  {/* Card Cover Image with Top Badges */}
                  <div className="h-52 w-full overflow-hidden relative bg-slate-100">
                    <img 
                      src={prog.image} 
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <Badge color="blue" className="bg-blue-600/90 text-white border-transparent backdrop-blur-sm">
                        {prog.degree}
                      </Badge>
                    </div>
                  </div>

                  {/* Circular Floating Tech Icon */}
                  <div className="absolute top-[184px] left-6 z-20">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white border-4 border-white shadow-md shadow-primary/10">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card Body content */}
                  <CardBody className="pt-8 flex-grow flex flex-col justify-between text-left space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-display font-extrabold text-base text-text-dark group-hover:text-primary transition-colors leading-snug">
                        {prog.title}
                      </h3>
                      <p className="text-text-gray text-xs leading-relaxed font-normal">
                        {prog.description}
                      </p>
                    </div>

                    {/* Stats metrics block */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50 text-[10px] text-text-gray/80 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{prog.stats.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{prog.stats.faculty}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Settings className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{prog.stats.labs}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{prog.stats.placement}</span>
                      </div>
                    </div>
                  </CardBody>

                  {/* Card Footer Actions */}
                  <CardFooter className="border-t border-slate-100 flex items-center justify-between">
                    <button 
                      onClick={() => router.push(`/courses`)}
                      className="text-primary hover:text-primary-hover font-display font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      Explore Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        {/* TRUST SIGNALS & CORE METRICS BAR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-24">
          <div className="bg-slate-900 rounded-3xl p-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-blue-500/10 blur-2xl" />
            
            <div className="text-left max-w-md space-y-3 z-10">
              <h2 className="font-display font-extrabold text-2xl tracking-tight leading-snug">
                Sri Satya Institute of Engineering & Technology
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed font-normal">
                Approved by AICTE, Affiliated to IKG Punjab Technical University, NAAC A+ Accredited premier technical institute.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full lg:w-auto shrink-0 z-10">
              {[
                { count: "15,000+", label: "Elite Alumni" },
                { count: "94.2%", label: "Placement Rate" },
                { count: "150+", label: "Ph.D Faculty" },
                { count: "25+", label: "Advanced Labs" }
              ].map((metric, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center min-w-[120px]">
                  <h4 className="font-display font-extrabold text-xl text-white">{metric.count}</h4>
                  <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500 pt-1">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI ADVISORY QUICK SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-24">
          <div className="bg-gradient-to-r from-blue-900 to-slate-950 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 text-left shadow-lg">
            <div className="space-y-4 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/20">
                <Sparkles className="w-3 h-3 text-blue-400 shrink-0" />
                AI RAG Integration
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight leading-snug">
                Confused about programs, career guidelines, or fees?
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed font-normal">
                Chat with our real-time CampusConnect AI assistant. It provides verified information extracted from our knowledge base on courses, hostels, faculty, and placement histories.
              </p>
            </div>
            <div className="shrink-0">
              <Button 
                variant="primary" 
                onClick={() => handleOpenAI()}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-white shrink-0" />}
                className="bg-white text-blue-900 hover:bg-slate-50 shadow-md shadow-white/10 px-8 py-3.5"
              >
                Start AI Assistant
              </Button>
            </div>
          </div>
        </section>

        {/* QUICK LINK DIRECTORIES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Admission Board", desc: "Eligibility criteria, seat intakes, and timelines.", href: "/admissions", icon: GraduationCap },
              { title: "Departments", desc: "Expert academic directories and HOD profiles.", href: "/departments", icon: Cpu },
              { title: "Fee Configurations", desc: "Convener and management quota allocations.", href: "/fees", icon: Shield },
              { title: "Placement Records", desc: "Recruiter summaries, packages, and reports.", href: "/placements", icon: Briefcase }
            ].map((box, idx) => {
              const BoxIcon = box.icon;
              return (
                <Card 
                  key={idx} 
                  clickable
                  onClick={() => router.push(box.href)}
                  className="p-6 flex flex-col justify-between text-left space-y-4 h-full"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary border border-blue-100/30">
                      <BoxIcon className="w-5 h-5" />
                    </div>
                    <h4 className="font-display font-extrabold text-sm text-text-dark">{box.title}</h4>
                    <p className="text-[11px] text-text-gray font-normal leading-relaxed">{box.desc}</p>
                  </div>
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider inline-flex items-center gap-1.5 pt-1">
                    Manage ▾
                  </span>
                </Card>
              );
            })}
          </div>
        </section>

      </main>

      <Footer />

      <AIModal isOpen={aiModalOpen} onClose={handleCloseAI} initialQuestion={initialQuestion} />
    </>
  );
}
