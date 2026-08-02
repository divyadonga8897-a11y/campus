"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Code2,
  Brain,
  Cpu,
  Settings,
  Building,
  GraduationCap,
  Calendar,
  Clock,
  ArrowRight,
  Briefcase,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Trophy,
  Award,
  ShieldCheck,
  Search
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import type { CourseDetail } from "@/services/academicService";

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Brain,
  Cpu,
  Settings,
  Building,
  Trophy,
  Award,
  Sparkles
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  cse: { bg: "bg-emerald-500/15", text: "text-emerald-600", border: "border-emerald-500/30" },
  aids: { bg: "bg-amber-500/15", text: "text-amber-600", border: "border-amber-500/30" },
  ece: { bg: "bg-blue-500/15", text: "text-blue-600", border: "border-blue-500/30" },
  mech: { bg: "bg-orange-500/15", text: "text-orange-600", border: "border-orange-500/30" },
  civil: { bg: "bg-yellow-500/15", text: "text-yellow-600", border: "border-yellow-500/30" },
};

const defaultColors = { bg: "bg-blue-500/15", text: "text-blue-600", border: "border-blue-500/30" };

interface Props {
  course: CourseDetail;
}

export default function CourseDetailClient({ course }: Props) {
  const [aiOpen, setAiOpen] = useState(false);
  const colors = colorMap[course.department_id] ?? defaultColors;

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="min-h-screen bg-slate-50">
        
        {/* Header Hero Section */}
        <PageHero
          eyebrow={`${course.degree_type} Specialization`}
          title={course.course_name}
          highlight="Program"
          description={`Hosted by Department of ${course.department_name}`}
          variant="image"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses" },
            { label: course.course_name }
          ]}
        />

        {/* Quick Stats Grid & Detail Content Modules */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          
          {/* Stats Bar */}
          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { icon: Clock, label: "Duration", value: course.duration },
              { icon: GraduationCap, label: "Intake capacity", value: `${course.intake} Seats` },
              { icon: Calendar, label: "Academic Year", value: "2026-27" },
            ].map((item) => (
              <div key={item.label} className="bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl px-5 py-3.5 shadow-sm flex items-center gap-3">
                <item.icon className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <div className="text-slate-950 font-bold text-sm leading-none">{item.value}</div>
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider mt-1">{item.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content Blocks */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/35 backdrop-blur-xl border border-white/45 p-6 sm:p-8 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-300"
              >
                <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4 uppercase tracking-wider border-b border-white/40 pb-2">Course Overview</h2>
                <p className="text-slate-655 text-sm sm:text-base leading-relaxed">
                  {course.overview}
                </p>
              </motion.div>

              {/* Course Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/35 backdrop-blur-xl border border-white/45 p-6 sm:p-8 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-300"
              >
                <h2 className="text-base sm:text-lg font-black text-slate-900 mb-2 flex items-center gap-2 uppercase tracking-wider">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Course Highlights
                </h2>
                <p className="text-slate-450 text-xs mb-6 border-b border-white/40 pb-3 font-semibold">
                  Key curriculum structures, laboratory exposures, and research initiatives that set this program apart.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {course.features.map((feat) => {
                    const FeatureIcon = iconMap[feat.icon.toLowerCase()] ?? Sparkles;
                    return (
                      <div
                        key={feat.id}
                        className="bg-white/50 hover:bg-white/80 border border-white/35 hover:border-blue-400 p-5 rounded-2xl shadow-sm transition-all duration-300 flex gap-3"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-600">
                          <FeatureIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-slate-950 font-bold text-sm mb-1">{feat.feature_title}</h4>
                          <p className="text-slate-655 text-xs leading-relaxed">{feat.feature_description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Career Opportunities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/35 backdrop-blur-xl border border-white/45 p-6 sm:p-8 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-300"
              >
                <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Career Pathways & Opportunities
                </h2>
                <p className="text-slate-450 text-xs mb-4 border-b border-white/40 pb-3 font-semibold">
                  Graduates from this specialization secure entry roles and research pathways inside top tech structures.
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {course.career_scope.map((career) => (
                    <div
                      key={career}
                      className="bg-white/50 hover:bg-white/80 border border-white/35 hover:border-blue-400 p-4 rounded-2xl shadow-sm text-center transition-all duration-300 flex flex-col justify-center"
                    >
                      <div className="text-slate-950 font-bold text-xs sm:text-sm mb-1">{career}</div>
                      <div className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Industry Designation</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar Columns */}
            <div className="space-y-6">
              {/* Eligibility Criteria */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/35 backdrop-blur-xl border border-white/45 p-6 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-300"
              >
                <h2 className="text-slate-900 font-black text-sm sm:text-base mb-4 flex items-center gap-2 border-b border-white/40 pb-3 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Academic Eligibility
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Required Qualification</div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{course.admission_requirements?.qualification}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Entrance Requirement</div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{course.admission_requirements?.entrance_exam}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Cut-off Criteria</div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">Minimum {course.admission_requirements?.minimum_percentage}% aggregate in qualifying board exam.</p>
                  </div>
                </div>
              </motion.div>

              {/* Required Documents Checklist */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/35 backdrop-blur-xl border border-white/45 p-6 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-300"
              >
                <h2 className="text-slate-900 font-black text-sm sm:text-base mb-4 border-b border-white/40 pb-3 uppercase tracking-wider">Required Documents</h2>
                <ul className="space-y-2.5">
                  {course.admission_requirements?.required_documents.slice(0, 5).map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-slate-655 text-xs sm:text-sm">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Quota Fees Link Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-lg text-white">
                <h3 className="font-extrabold text-base mb-2">Check Course Fees</h3>
                <p className="text-blue-100 text-xs mb-4 leading-relaxed">
                  Analyze tuition structures for Convener vs Management quotas, hostel boarding and transport concessions.
                </p>
                <Link
                  href="/fees"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-blue-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-all duration-200"
                >
                  View Quota Fees
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
