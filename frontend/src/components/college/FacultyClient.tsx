"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { User, Mail, GraduationCap, Award, BookOpen, Search, FlaskConical } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";

interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  experience: number;
  researchAreas: string[];
  email: string;
  image: string;
}

const facultyList: FacultyMember[] = [
  // CSE
  {
    id: "f-1",
    name: "Dr. Ramesh Kumar",
    designation: "HOD & Professor",
    department: "cse",
    qualification: "Ph.D in Computer Science & Engineering",
    experience: 18,
    researchAreas: ["Machine Learning", "Cloud Computing"],
    email: "ramesh.kumar@ssiet.ac.in",
    image: "/images/alumni/success-story.webp",
  },
  {
    id: "f-2",
    name: "Dr. A. K. Sastry",
    designation: "Associate Professor",
    department: "cse",
    qualification: "M.Tech, Ph.D (Information Security)",
    experience: 12,
    researchAreas: ["Cyber Security", "Blockchain Architecture"],
    email: "sastry.ak@ssiet.ac.in",
    image: "/images/alumni/career-growth.webp",
  },
  {
    id: "f-3",
    name: "Mrs. G. Sujatha",
    designation: "Assistant Professor",
    department: "cse",
    qualification: "M.Tech (Software Engineering)",
    experience: 8,
    researchAreas: ["Data Structures", "Algorithm Design"],
    email: "sujatha.g@ssiet.ac.in",
    image: "/images/alumni/career-growth.webp",
  },
  // AIDS
  {
    id: "f-4",
    name: "Dr. Priya Sharma",
    designation: "HOD & Professor",
    department: "aids",
    qualification: "Ph.D in Artificial Intelligence",
    experience: 15,
    researchAreas: ["Deep Neural Networks", "Computer Vision"],
    email: "priya.sharma@ssiet.ac.in",
    image: "/images/alumni/success-story.webp",
  },
  {
    id: "f-5",
    name: "Mr. K. V. Rao",
    designation: "Associate Professor",
    department: "aids",
    qualification: "M.Tech in Data Science",
    experience: 10,
    researchAreas: ["Big Data Analytics", "Natural Language Processing"],
    email: "rao.kv@ssiet.ac.in",
    image: "/images/alumni/career-growth.webp",
  },
  // ECE
  {
    id: "f-6",
    name: "Dr. Vijay Rao",
    designation: "HOD & Professor",
    department: "ece",
    qualification: "Ph.D in Digital Signal Processing",
    experience: 20,
    researchAreas: ["Wireless Communications", "IoT Networks"],
    email: "vijay.rao@ssiet.ac.in",
    image: "/images/alumni/success-story.webp",
  },
  {
    id: "f-7",
    name: "Mrs. S. Lakshmi",
    designation: "Assistant Professor",
    department: "ece",
    qualification: "M.Tech in VLSI Systems",
    experience: 6,
    researchAreas: ["VLSI Circuits", "Embedded System Design"],
    email: "lakshmi.s@ssiet.ac.in",
    image: "/images/alumni/career-growth.webp",
  },
  // MECH
  {
    id: "f-8",
    name: "Dr. S. K. Nayak",
    designation: "HOD & Professor",
    department: "mech",
    qualification: "Ph.D in Robotics & CAD/CAM",
    experience: 22,
    researchAreas: ["Advanced Robotics", "Industrial Automation"],
    email: "nayak.sk@ssiet.ac.in",
    image: "/images/alumni/success-story.webp",
  },
  {
    id: "f-9",
    name: "Mr. M. Harish",
    designation: "Assistant Professor",
    department: "mech",
    qualification: "M.Tech (Thermal Engineering)",
    experience: 7,
    researchAreas: ["Fluid Dynamics", "Thermal Simulation"],
    email: "harish.m@ssiet.ac.in",
    image: "/images/alumni/career-growth.webp",
  },
  // CIVIL
  {
    id: "f-10",
    name: "Dr. M. Prasad",
    designation: "HOD & Professor",
    department: "civil",
    qualification: "Ph.D in Structural Engineering",
    experience: 19,
    researchAreas: ["Smart City Infrastructure", "Concrete Materials"],
    email: "prasad.m@ssiet.ac.in",
    image: "/images/alumni/success-story.webp",
  },
];

const deptFilters = [
  { value: "all", label: "All Departments" },
  { value: "cse", label: "CSE" },
  { value: "aids", label: "AI & DS" },
  { value: "ece", label: "ECE" },
  { value: "mech", label: "Mechanical" },
  { value: "civil", label: "Civil" },
];

export default function FacultyClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  const filteredFaculty = useMemo(() => {
    return facultyList.filter((f) => {
      const matchSearch =
        !searchQuery ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.researchAreas.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchDept = selectedDept === "all" || f.department === selectedDept;
      return matchSearch && matchDept;
    });
  }, [searchQuery, selectedDept]);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        <PageHero
          eyebrow="SSIET Directory"
          title="Distinguished"
          highlight="Faculty Board"
          description={
            <div className="space-y-2">
              <p>
                Our engineering instructors, research leads, and industry mentors bring decades of combined academic and consulting experience to the classrooms.
              </p>
              <p>
                Search through our directory of department chairs, senior professors, and researchers who guide CAPSTONE projects and lead scientific discovery at SSIET.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Faculty" }]}
        />

        <div className="container py-12">
          {/* Filters Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 items-center">
            <div className="w-full md:flex-1">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                placeholder="Search faculty by name or research area..."
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {deptFilters.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDept(d.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                    selectedDept === d.value
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Grid */}
          {filteredFaculty.length === 0 ? (
            <div className="card p-12 text-center max-w-md mx-auto">
              <User className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900 mb-1">No Faculty Members Found</h3>
              <p className="text-xs text-slate-500">Try refining search query or switching stream filters.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFaculty.map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex flex-col h-full"
                >
                  <Card variant="default" className="flex flex-col h-full p-6 text-center group">
                    {/* Visual initials badge */}
                    <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-700 font-black text-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                      {f.name.split(" ").slice(-1)[0].charAt(0) || "F"}
                    </div>

                    <span className="badge badge-blue text-[10px] mb-2 mx-auto uppercase tracking-wider font-bold">
                      {f.department} · {f.designation}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                      {f.name}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-3">
                      <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{f.qualification}</span>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-4">
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span>{f.experience} Years of Experience</span>
                    </div>

                    {/* Research areas */}
                    {f.researchAreas && f.researchAreas.length > 0 && (
                      <div className="border-t border-slate-100 pt-3.5 mt-auto text-left">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 block flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-slate-400" /> Research Areas
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {f.researchAreas.map((area) => (
                            <span key={area} className="badge badge-slate text-[9px]">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <a
                      href={`mailto:${f.email}`}
                      className="flex items-center justify-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 font-bold mt-4 transition-colors pt-3 border-t border-slate-100/50"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{f.email}</span>
                    </a>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
