"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Briefcase, GraduationCap, BookOpen, Calendar, User, Settings,
  LogOut, ClipboardList, CheckCircle2, AlertCircle, Plus, Users,
  Send, Sparkles, PlusCircle, Check
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { StatCard } from "@/components/ui/StatCard";
import { Input, Select } from "@/components/ui/Input";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";

interface ClassItem {
  code: string;
  name: string;
  semester: string;
  strength: number;
}

const allocatedClasses: ClassItem[] = [
  { code: "CS401", name: "Compiler Design", semester: "B.Tech IV-I (CSE)", strength: 64 },
  { code: "CS503", name: "Artificial Intelligence", semester: "B.Tech III-I (CSE)", strength: 60 },
  { code: "CS302", name: "Data Warehousing", semester: "B.Tech III-II (AI&DS)", strength: 58 },
];

export default function FacultyDashboardClient() {
  const router = useRouter();
  const [aiOpen, setAiOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("dashboard"); // dashboard, gradeBook, attendance
  
  // Grade form state
  const [gradeData, setGradeData] = useState({
    rollNo: "", course: "CS401", grade: "A+"
  });
  const [gradesList, setGradesList] = useState<any[]>([
    { id: 1, rollNo: "22871A0501", course: "CS401", grade: "O" },
    { id: 2, rollNo: "22871A0502", course: "CS401", grade: "A+" },
    { id: 3, rollNo: "22871A0503", course: "CS401", grade: "A" },
  ]);

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeData.rollNo.trim()) return;
    setGradesList(prev => [
      { id: Date.now(), ...gradeData },
      ...prev
    ]);
    setGradeData(prev => ({ ...prev, rollNo: "" }));
  };

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
        
        {/* Floating Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col justify-between shrink-0 shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                RK
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug">Dr. Ramesh Kumar</h3>
                <p className="text-[10px] text-slate-400 font-medium">Professor, Dept of CSE</p>
              </div>
            </div>

            <nav className="space-y-1">
              {[
                { id: "dashboard", label: "Faculty Home", icon: ClipboardList },
                { id: "gradeBook", label: "Grades Manager", icon: GraduationCap },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      active 
                        ? "bg-blue-50 border-l-4 border-blue-600 text-blue-700 shadow-sm" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-slate-400"}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-200 mt-6 space-y-2">
            <button
              onClick={() => router.push("/profile")}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-slate-400" />
              My Profile
            </button>
            <button
              onClick={() => router.push("/settings")}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              Settings
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              Log Out
            </button>
          </div>
        </aside>

        {/* Console Workspace */}
        <main className="flex-1 p-6 sm:p-10 min-w-0">
          
          {/* VIEW: Faculty Home */}
          {currentTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* StatCards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Allocated Lectures" 
                  value="3 Classes" 
                  icon={BookOpen} 
                  trend={{ value: "18 Hours/Week", isPositive: true }} 
                />
                <StatCard 
                  title="Students Guided" 
                  value="182 Students" 
                  icon={Users} 
                  trend={{ value: "Class strength limit", isPositive: true }} 
                />
                <StatCard 
                  title="Journals Published" 
                  value="12 Papers" 
                  icon={Briefcase} 
                  trend={{ value: "IEEE & Springer catalog", isPositive: true }} 
                />
                <StatCard 
                  title="Active Research Labs" 
                  value="2 Labs" 
                  icon={Sparkles} 
                  trend={{ value: "Edge IoT project", isPositive: true }} 
                />
              </div>

              {/* Grid: Classes List + AI advisor */}
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Classes allocated */}
                <div className="lg:col-span-8">
                  <Card variant="default" className="p-6">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                      <BookOpen className="w-4.5 h-4.5 text-blue-600" /> Current Semester Allocated Classes
                    </h3>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject Code</TableHead>
                          <TableHead>Subject Name</TableHead>
                          <TableHead>Semester & Branch</TableHead>
                          <TableHead>Total Students</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allocatedClasses.map((cl) => (
                          <TableRow key={cl.code}>
                            <TableCell className="font-mono text-slate-400 font-bold">{cl.code}</TableCell>
                            <TableCell className="font-bold text-slate-800">{cl.name}</TableCell>
                            <TableCell>{cl.semester}</TableCell>
                            <TableCell>{cl.strength}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>

                {/* Right: Smart Advice */}
                <div className="lg:col-span-4">
                  <Card variant="default" className="p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-700 shadow-md">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-blue-200 mt-0.5 shrink-0 animate-pulse" />
                      <div>
                        <h4 className="font-bold text-xs mb-1">Faculty Research Assistant</h4>
                        <p className="text-blue-100 text-[10px] leading-relaxed mb-3">
                          Need formatting assistance for IEEE research journals, or guidelines mapping for new syllabi? Let Campus AI help you.
                        </p>
                        <Button 
                          variant="secondary" 
                          size="xs" 
                          onClick={() => setAiOpen(true)}
                          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                        >
                          Start AI Assistant
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

              </div>
            </div>
          )}

          {/* VIEW: Gradebook Manager */}
          {currentTab === "gradeBook" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid lg:grid-cols-3 gap-8 items-start">
                
                {/* Form to submit grade */}
                <div>
                  <Card variant="default" className="p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3">
                      Upload Grade Points
                    </h3>
                    <form onSubmit={handleGradeSubmit} className="space-y-4">
                      <Input 
                        label="Student Roll Number" 
                        placeholder="e.g. 22871A0501" 
                        value={gradeData.rollNo}
                        onChange={(e) => setGradeData(prev => ({ ...prev, rollNo: e.target.value }))}
                      />
                      <Select 
                        label="Course Code"
                        options={[
                          { value: "CS401", label: "CS401 - Compiler Design" },
                          { value: "CS503", label: "CS503 - Artificial Intelligence" },
                        ]}
                        value={gradeData.course}
                        onChange={(e) => setGradeData(prev => ({ ...prev, course: e.target.value }))}
                      />
                      <Select 
                        label="Grade Secured"
                        options={[
                          { value: "O", label: "O - Outstanding" },
                          { value: "A+", label: "A+ - Excellent" },
                          { value: "A", label: "A - Very Good" },
                          { value: "B+", label: "B+ - Good" },
                        ]}
                        value={gradeData.grade}
                        onChange={(e) => setGradeData(prev => ({ ...prev, grade: e.target.value }))}
                      />
                      <Button type="submit" variant="primary" fullWidth rightIcon={<Send className="w-4 h-4" />}>
                        Upload Grade
                      </Button>
                    </form>
                  </Card>
                </div>

                {/* Grade ledger */}
                <div className="lg:col-span-2">
                  <Card variant="default" className="p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                      <GraduationCap className="w-5 h-5 text-blue-600" /> Recent Uploaded Grade Ledger
                    </h3>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Roll Number</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Grade Secured</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {gradesList.map((gr) => (
                          <TableRow key={gr.id}>
                            <TableCell className="font-bold text-slate-800">{gr.rollNo}</TableCell>
                            <TableCell>{gr.course}</TableCell>
                            <TableCell>
                              <Badge variant="light" color="blue">{gr.grade}</Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" /> Verified
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
