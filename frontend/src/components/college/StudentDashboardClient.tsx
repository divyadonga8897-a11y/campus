"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, BookOpen, Calendar, HelpCircle, User, Settings,
  LogOut, CheckCircle2, AlertCircle, Clock, CheckSquare, 
  MapPin, ShieldAlert, CreditCard, Sparkles, Phone, Download
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { StatCard } from "@/components/ui/StatCard";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";

interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: "Completed" | "Pending" | "Overdue";
}

interface Result {
  id: string;
  subject: string;
  code: string;
  grade: string;
  credits: number;
}

const assignmentsData: Assignment[] = [
  { id: "a-1", subject: "Artificial Intelligence", title: "Mini Project - Implementation of Heuristic Search", dueDate: "Aug 05, 2026", status: "Pending" },
  { id: "a-2", subject: "Cryptography", title: "Practical Cryptanalysis of RSA cipher", dueDate: "Aug 02, 2026", status: "Completed" },
  { id: "a-3", subject: "Database Systems", title: "SQL Complex Query optimisation sheet", dueDate: "July 28, 2026", status: "Completed" },
  { id: "a-4", subject: "Microprocessors", title: "Assembly Language Interfacing Circuit Design", dueDate: "July 25, 2026", status: "Overdue" },
];

const resultsData: Result[] = [
  { id: "r-1", subject: "Compiler Design", code: "CS401", grade: "A+", credits: 4 },
  { id: "r-2", subject: "Software Engineering", code: "CS402", grade: "A", credits: 3 },
  { id: "r-3", subject: "Web Technologies", code: "CS403", grade: "O", credits: 4 },
  { id: "r-4", subject: "Data Warehousing", code: "CS404", grade: "B+", credits: 3 },
];

export default function StudentDashboardClient() {
  const router = useRouter();
  const [aiOpen, setAiOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("dashboard"); // dashboard, academic, fees
  const [checkedAssignments, setCheckedAssignments] = useState<Record<string, boolean>>({
    "a-2": true, "a-3": true
  });

  const toggleAssignment = (id: string) => {
    setCheckedAssignments(prev => ({ ...prev, [id]: !prev[id] }));
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
                DD
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug">Divya Donga</h3>
                <p className="text-[10px] text-slate-400 font-medium">Roll: 22871A0501 (CSE)</p>
              </div>
            </div>

            <nav className="space-y-1">
              {[
                { id: "dashboard", label: "Student Home", icon: GraduationCap },
                { id: "academic", label: "Academic Records", icon: BookOpen },
                { id: "fees", label: "Fees & Dues", icon: CreditCard },
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
          
          {/* VIEW: Student Home */}
          {currentTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* StatCards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Class Attendance" 
                  value="84.2%" 
                  icon={Clock} 
                  trend={{ value: "Safe limits (>75%)", isPositive: true }} 
                />
                <StatCard 
                  title="CGPA Score" 
                  value="9.12 / 10" 
                  icon={GraduationCap} 
                  trend={{ value: "Rank #3 in CSE-A", isPositive: true }} 
                />
                <StatCard 
                  title="Pending Assignments" 
                  value="2 Pending" 
                  icon={CheckSquare} 
                  trend={{ value: "1 overdue task", isPositive: false }} 
                />
                <StatCard 
                  title="Library Borrowed" 
                  value="3 Books" 
                  icon={BookOpen} 
                  trend={{ value: "Due in 5 days", isPositive: true }} 
                />
              </div>

              {/* Main row: Assignments + Library/Hostel info */}
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Assignments */}
                <div className="lg:col-span-8">
                  <Card variant="default" className="p-6">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                      <CheckSquare className="w-4.5 h-4.5 text-blue-600" /> Active Assignment Tasks
                    </h3>

                    <div className="space-y-4">
                      {assignmentsData.map((asg) => {
                        const isDone = checkedAssignments[asg.id] || false;
                        return (
                          <div key={asg.id} className="flex items-start justify-between p-3.5 rounded-xl border border-slate-200/60 bg-white hover:border-blue-400 hover:shadow-sm transition-all group">
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              {/* Custom Floating Checkbox */}
                              <button 
                                onClick={() => toggleAssignment(asg.id)}
                                className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all shrink-0 ${
                                  isDone 
                                    ? "bg-emerald-500 border-emerald-500 text-white" 
                                    : "border-slate-300 bg-slate-50 group-hover:border-blue-400"
                                }`}
                              >
                                {isDone && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>
                              <div className="min-w-0 flex-1">
                                <h4 className={`text-xs font-bold text-slate-900 leading-snug break-words ${isDone ? "line-through text-slate-400" : ""}`}>
                                  {asg.title}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{asg.subject}</p>
                              </div>
                            </div>

                            <div className="text-right flex flex-col items-end gap-1">
                              <Badge 
                                variant={isDone ? "filled" : asg.status === "Overdue" ? "outline" : "light"} 
                                color={isDone ? "green" : asg.status === "Overdue" ? "red" : "blue"}
                              >
                                {isDone ? "Completed" : asg.status}
                              </Badge>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Due: {asg.dueDate}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>

                {/* Right: Residency & Library Widget */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Residency details */}
                  <Card variant="default" className="p-5">
                    <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" /> Hostel Room Allotment
                    </h4>
                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-400">Residency Hall:</span>
                        <span className="font-bold text-slate-800">Newton Block-A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-400">Room Number:</span>
                        <span className="font-bold text-slate-800">Room 304 (Double sharing)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-400">Mess Plan:</span>
                        <span className="font-bold text-slate-800">Veg & Non-Veg Standard</span>
                      </div>
                    </div>
                  </Card>

                  {/* Ask AI Prompt box */}
                  <Card variant="default" className="p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-700 shadow-md">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-blue-200 mt-0.5 shrink-0 animate-pulse" />
                      <div>
                        <h4 className="font-bold text-xs mb-1">Need Academic Advice?</h4>
                        <p className="text-blue-100 text-[10px] leading-relaxed mb-3">
                          Ask Campus AI helper about lecture schedules, lab journals, CGPA estimations, or library extensions.
                        </p>
                        <Button 
                          variant="secondary" 
                          size="xs" 
                          onClick={() => setAiOpen(true)}
                          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                        >
                          Start AI Session
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

              </div>
            </div>
          )}

          {/* VIEW: Academic Records */}
          {currentTab === "academic" && (
            <div className="space-y-8 animate-fadeIn">
              <Card variant="default" className="p-6 sm:p-8">
                <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <GraduationCap className="w-5 h-5 text-blue-600" /> B.Tech Semesters Results Ledger
                </h3>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject Code</TableHead>
                      <TableHead>Subject Name</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Grade Secured</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultsData.map((res) => (
                      <TableRow key={res.id}>
                        <TableCell className="font-mono text-slate-400 font-bold">{res.code}</TableCell>
                        <TableCell className="font-bold text-slate-800">{res.subject}</TableCell>
                        <TableCell>{res.credits}</TableCell>
                        <TableCell>
                          <Badge variant="light" color={res.grade === "O" || res.grade.includes("A") ? "green" : "blue"}>
                            {res.grade}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* VIEW: Fees & Dues */}
          {currentTab === "fees" && (
            <div className="space-y-8 animate-fadeIn">
              <Card variant="default" className="p-6 sm:p-8">
                <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <CreditCard className="w-5 h-5 text-blue-600" /> Fee Payment Schedules (2026-27)
                </h3>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fee Header</TableHead>
                      <TableHead>Billing Cycle</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold text-slate-800">Tuition Fees - Convener Quota</TableCell>
                      <TableCell>Semester I & II</TableCell>
                      <TableCell className="font-semibold text-slate-700">₹75,000</TableCell>
                      <TableCell className="text-slate-400 font-medium">Aug 20, 2026</TableCell>
                      <TableCell>
                        <Badge variant="outline" color="amber">Pending Pay</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="primary" size="xs" rightIcon={<CreditCard className="w-3 h-3" />}>
                          Pay Now
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold text-slate-800">Newton Hostel Double Sharing Mess Fee</TableCell>
                      <TableCell>Annual mess charges</TableCell>
                      <TableCell className="font-semibold text-slate-700">₹35,000</TableCell>
                      <TableCell className="text-slate-400 font-medium">July 15, 2026</TableCell>
                      <TableCell>
                        <Badge variant="filled" color="green">Paid Successfully</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="secondary" size="xs" leftIcon={<Download className="w-3 h-3" />}>
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

        </main>
      </div>

      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
