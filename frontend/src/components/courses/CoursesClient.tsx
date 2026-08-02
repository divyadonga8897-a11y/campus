"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Code2, Brain, Cpu, Settings, Building, Search, ArrowRight, Clock, Users, FlaskConical, Award } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { academicService, type CourseSummary, type DepartmentSummary } from "@/services/academicService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const iconMap: Record<string, React.ElementType> = {
  cse: Code2,
  aids: Brain,
  ece: Cpu,
  mech: Settings,
  civil: Building
};

// Static mapping for placement % and labs count per department
const deptMetrics: Record<string, { placementRate: number; labsCount: number; image: string }> = {
  cse:   { placementRate: 96, labsCount: 8, image: "/images/campus/computer-lab.png" },
  aids:  { placementRate: 98, labsCount: 5, image: "/images/campus/computer-lab.png" },
  ece:   { placementRate: 90, labsCount: 6, image: "/images/campus/academic-block.webp" },
  mech:  { placementRate: 86, labsCount: 5, image: "/images/campus/sports.webp" },
  civil: { placementRate: 84, labsCount: 4, image: "/images/campus/main-building.webp" },
};

export default function CoursesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const querySearch = searchParams.get("search") || "";
  const queryDept = searchParams.get("dept") || "all";

  const [aiOpen, setAiOpen] = useState(false);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [depts, setDepts] = useState<DepartmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState(querySearch);
  const [selectedDept, setSelectedDept] = useState(queryDept);

  useEffect(() => {
    Promise.all([
      academicService.getCourses(),
      academicService.getDepartments()
    ]).then(([courseRes, deptRes]) => {
      setCourses(courseRes.data || []);
      setDepts(deptRes.data || []);
      setLoading(false);
    }).catch((err) => {
      console.error("Error fetching courses page data:", err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setSearchQuery(querySearch);
  }, [querySearch]);

  useEffect(() => {
    setSelectedDept(queryDept);
  }, [queryDept]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchSearch =
        !searchQuery ||
        course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.department_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = selectedDept === "all" || course.department_id === selectedDept;
      return matchSearch && matchDept;
    });
  }, [courses, searchQuery, selectedDept]);

  const displayCourses = useMemo(() => {
    return filteredCourses.map((c) => {
      const deptInfo = depts.find((d) => d.id === c.department_id);
      const metrics = deptMetrics[c.department_id] || { placementRate: 90, labsCount: 4, image: "/images/campus/ai-lab.webp" };
      return {
        ...c,
        facultyCount: deptInfo?.faculty_count || 20,
        studentCount: deptInfo?.student_count || 300,
        placementRate: metrics.placementRate,
        labsCount: metrics.labsCount,
        image: metrics.image
      };
    });
  }, [filteredCourses, depts]);

  const uniqueDepartments = useMemo(() => {
    const list: { id: string; name: string }[] = [];
    courses.forEach(c => {
      if (!list.find(x => x.id === c.department_id)) {
        list.push({ id: c.department_id, name: c.department_name });
      }
    });
    return list;
  }, [courses]);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        <PageHero
          eyebrow="Courses Catalog"
          title="Engineering & Science"
          highlight="Programs"
          variant="image"
          bgImage="/images/campus/academic-block.webp"
          description={
            <div className="space-y-2">
              <p>
                Explore our comprehensive catalog of Bachelor of Technology programs designed to meet the demands of modern technology, computing, and physical engineering.
              </p>
              <p>
                Each specialization focuses on practical lab experience, design-thinking projects, and robust industry placement tracks to build successful professional careers.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Courses" }]}
        />

        <div className="container py-12">
          
          {/* Frosted Glass Search & Filter Toolbar */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/60 p-4 sm:p-5 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.015)] flex flex-col md:flex-row gap-4 mb-12 items-center transition-all duration-300">
            <div className="w-full md:flex-1 bg-white/40 border border-slate-200 shadow-sm focus-within:border-blue-500/50 focus-within:bg-white/80 transition-all rounded-full px-5 py-2 sm:py-2.5 flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses (e.g. CSE, VLSI, AI...)"
                className="w-full text-slate-800 text-xs sm:text-sm focus:outline-none bg-transparent placeholder-slate-400 font-semibold"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-[10px] text-slate-400 hover:text-slate-700 font-bold uppercase cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            
            {/* Filter chips */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <button
                onClick={() => setSelectedDept("all")}
                className={`px-4 py-2 rounded-full text-xs font-black border cursor-pointer transition-all select-none backdrop-blur-sm ${
                  selectedDept === "all"
                    ? "bg-blue-600 border-blue-650 text-white shadow-sm hover:scale-105 active:scale-95"
                    : "bg-white/45 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white/70"
                }`}
              >
                All Streams
              </button>
              {uniqueDepartments.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDept(d.id)}
                  className={`px-4 py-2 rounded-full text-xs font-black border cursor-pointer transition-all uppercase select-none backdrop-blur-sm ${
                    selectedDept === d.id
                      ? "bg-blue-600 border-blue-650 text-white shadow-sm hover:scale-105 active:scale-95"
                      : "bg-white/45 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white/70"
                  }`}
                >
                  {d.id}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Listing */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton h-80 rounded-2xl animate-pulse bg-slate-200" />
              ))}
            </div>
          ) : displayCourses.length === 0 ? (
            <Card variant="glass" className="p-12 text-center max-w-md mx-auto">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-950 mb-1">No Programs Found</h3>
              <p className="text-xs text-slate-500 mb-4 font-semibold">We couldn't find any courses matching your current query.</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => { setSearchQuery(""); setSelectedDept("all"); }}
              >
                Clear Filters
              </Button>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayCourses.map((course, i) => {
                const Icon = iconMap[course.department_id] ?? Code2;

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.05 }}
                    className="flex flex-col h-full cursor-pointer"
                    onClick={() => router.push(`/courses/${course.id}`)}
                  >
                    <Card
                      variant="glass"
                      className="overflow-hidden flex flex-col h-full hover:shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:border-blue-500/30 transition-all duration-350 group"
                    >
                      {/* Department image overlay */}
                      <div className="relative h-44 bg-slate-100 overflow-hidden shrink-0">
                        <img
                          src={course.image}
                          alt={course.course_name}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-slate-950/60 border border-white/10 text-white rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm">
                            {course.degree_type}
                          </span>
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-5 flex flex-col flex-grow text-left">
                        <div className="flex items-start gap-3 mb-3 shrink-0">
                          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/25">
                            <Icon className="w-4.5 h-4.5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-950 group-hover:text-blue-600 transition-colors leading-snug">
                              {course.course_name}
                            </h3>
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mt-0.5">
                              {course.department_name}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mb-5 flex-grow line-clamp-3">
                          {course.overview}
                        </p>

                        {/* Complete metrics list */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[9px] text-slate-500 font-black uppercase tracking-wider pt-4 border-t border-slate-100 mb-5 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{course.facultyCount} Faculty</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FlaskConical className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>{course.labsCount} Labs</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{course.placementRate}% Placed</span>
                          </div>
                        </div>

                        <div className="text-xs font-black text-blue-600 flex items-center gap-1.5 hover:underline tracking-wider uppercase group cursor-pointer mt-auto pt-2">
                          Explore Details <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>

                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
