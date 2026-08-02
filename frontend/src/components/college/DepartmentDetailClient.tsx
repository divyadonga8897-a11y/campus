"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Code2, Brain, Cpu, Settings, Building, Users, GraduationCap, ArrowRight, BookOpen, UserCheck, Microscope } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import type { DepartmentDetail } from "@/services/academicService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const iconMap: Record<string, React.ElementType> = {
  cse: Code2,
  aids: Brain,
  ece: Cpu,
  mech: Settings,
  civil: Building
};

const badgeColorMap: Record<string, "blue" | "green" | "amber" | "indigo" | "slate"> = {
  cse: "blue",
  aids: "indigo",
  ece: "indigo",
  mech: "amber",
  civil: "slate",
};

interface Props {
  department: DepartmentDetail;
}

export default function DepartmentDetailClient({ department: dept }: Props) {
  const [aiOpen, setAiOpen] = useState(false);
  const Icon = iconMap[dept.id] ?? Code2;
  const bColor = badgeColorMap[dept.id] ?? "blue";

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        
        <PageHero
          eyebrow={`${dept.short_name} Division`}
          title={dept.department_name}
          highlight=""
          description={dept.description}
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Departments", href: "/departments" }, { label: dept.short_name }]}
          actions={
            <div className="flex flex-wrap gap-3">
              <Badge variant="filled" color={bColor} className="text-xs py-2 px-4 shadow-sm">
                Established {dept.established_year}
              </Badge>
              <Badge variant="light" color="blue" className="text-xs py-2 px-4 shadow-sm">
                {dept.faculty_count}+ Faculty
              </Badge>
              <Badge variant="light" color="green" className="text-xs py-2 px-4 shadow-sm">
                {dept.student_count}+ Active Students
              </Badge>
            </div>
          }
        />

        {/* Details Grid */}
        <section className="pb-20 container mt-12">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Head of Department */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <Card variant="default" className="p-6">
                  <h2 className="text-slate-900 font-bold text-xs sm:text-sm uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <UserCheck className="w-4.5 h-4.5 text-blue-600" />
                    Head of Department
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-lg font-bold text-blue-600 border border-blue-100">
                      {dept.head_of_department.split(" ").slice(-1)[0][0]}
                    </div>
                    <div>
                      <div className="text-slate-900 font-bold text-sm sm:text-base leading-snug">{dept.head_of_department}</div>
                      <div className="text-slate-500 text-xs mt-0.5">Professor & Department Chair</div>
                      <Badge variant="light" color={bColor} className="mt-2">
                        {dept.short_name} HOD Desk
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Department Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <Card variant="default" className="p-6">
                  <h2 className="text-slate-900 font-bold text-xs sm:text-sm uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Microscope className="w-4.5 h-4.5 text-blue-600" />
                    Department Highlights & Facilities
                  </h2>
                  <div className="space-y-3.5">
                    {dept.highlights.map((high, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-slate-600 text-xs sm:text-sm leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                        <span>{high}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Faculty Grid */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card variant="default" className="p-6">
                  <h2 className="text-slate-900 font-bold text-xs sm:text-sm uppercase tracking-wider mb-5 border-b border-slate-100 pb-3">
                    Expert Faculty Board
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {dept.faculty.map((fac, idx) => (
                      <Card key={idx} variant="default" className="p-4 text-center hover:border-blue-400">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 font-bold text-slate-600 text-xs">
                          {fac.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="text-slate-900 font-bold text-xs line-clamp-1">{fac.name}</div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold mt-1.5">{fac.designation}</div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Courses Offered */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <Card variant="default" className="p-6">
                  <h2 className="text-slate-900 font-bold text-xs sm:text-sm uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <BookOpen className="w-4.5 h-4.5 text-blue-600" />
                    Available Courses
                  </h2>
                  <div className="space-y-3">
                    {dept.courses.map((course) => (
                      <Card key={course.id} variant="default" className="p-4 hover:border-blue-400">
                        <div className="text-slate-900 font-bold text-xs sm:text-sm mb-1">{course.course_name}</div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{course.duration} | {course.intake} seats</span>
                          <Link href={`/courses/${course.id}`} className="text-[10px] font-black uppercase tracking-wider text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                            Details <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Admission counseling Redirect */}
              <Card variant="default" className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-md">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-2">B.Tech Admissions Open</h3>
                <p className="text-blue-100 text-xs mb-5 leading-relaxed">
                  Secure seat allocation based on EAMCET ranks or inquire at the counseling wing.
                </p>
                <Link
                  href="/admissions"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-blue-600 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all duration-200 shadow-sm"
                >
                  Apply & Counsel
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            </div>

          </div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
