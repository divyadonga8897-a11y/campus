"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CheckCircle2, FileText, Calendar, GraduationCap, ArrowRight,
  ClipboardList, Sparkles, BookmarkCheck, ChevronDown
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import {
  enquiryService,
  type ProcessStep, type RequiredDoc, type TimelineEvent, type EligibilityDetail
} from "@/services/enquiryService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";
import { Timeline } from "@/components/ui/Timeline";

const availableCourses = [
  { value: "b-tech-cse",  label: "B.Tech Computer Science Engineering (CSE)"         },
  { value: "b-tech-aids", label: "B.Tech AI & Data Science (AI&DS)"                  },
  { value: "b-tech-ece",  label: "B.Tech Electronics & Communication (ECE)"          },
  { value: "b-tech-mech", label: "B.Tech Mechanical Engineering (MECH)"              },
  { value: "b-tech-civil",label: "B.Tech Civil Engineering (CIVIL)"                  },
];

export default function AdmissionsClient() {
  const router = useRouter();
  const [aiOpen, setAiOpen]               = useState(false);
  const [steps, setSteps]                 = useState<ProcessStep[]>([]);
  const [docs, setDocs]                   = useState<RequiredDoc[]>([]);
  const [timeline, setTimeline]           = useState<TimelineEvent[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("b-tech-cse");
  const [eligibility, setEligibility]     = useState<EligibilityDetail | null>(null);
  const [loading, setLoading]             = useState(true);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      enquiryService.getAdmissionProcess(),
      enquiryService.getDocuments(),
      enquiryService.getTimeline(),
    ]).then(([procRes, docRes, timeRes]) => {
      setSteps(procRes.data || []);
      setDocs(docRes.data || []);
      setTimeline(timeRes.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setEligibilityLoading(true);
    enquiryService.getEligibility(selectedCourse)
      .then((res) => { setEligibility(res.data); setEligibilityLoading(false); })
      .catch(() => setEligibilityLoading(false));
  }, [selectedCourse]);

  const admissionTimelineSteps = timeline.map((evt, idx) => ({
    id: evt.id || idx,
    title: evt.event_name,
    subtitle: `Admissions 2026-27`,
    description: evt.description,
    date: evt.start_date,
    status: (idx === 0 ? "active" : idx === 1 ? "completed" : "upcoming") as any
  }));

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Admissions 2026-27 Open"
          title="Your Engineering Journey"
          highlight="Starts Here"
          variant="image"
          bgImage="/images/campus/library-interior.png"
          description={
            <div className="space-y-2">
              <p>
                We welcome students from diverse backgrounds who possess a strong curiosity for engineering, data science, and modern technology. Our transparent admissions process is designed to select individuals who show a passion for learning, creative problem-solving, and professional excellence.
              </p>
              <p>
                Explore our detailed guidelines on eligibility criteria, mandatory certification documentation, tuition fee schedules, and important timeline thresholds to secure your place.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admissions" }]}
          actions={
            <div className="flex flex-wrap gap-3 pointer-events-auto">
              <button
                type="button"
                onClick={() => router.push("/enquiry")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 transition-all cursor-pointer uppercase tracking-wider hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
              >
                Submit Enquiry <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setAiOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 backdrop-blur-sm font-bold text-xs px-5 py-2.5 rounded-full transition-all cursor-pointer uppercase tracking-wider hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                Ask AI Assistant
              </button>
            </div>
          }
        />

        <div className="container py-12">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Main: Steps + Eligibility ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Admission Steps */}
              <div className="bg-white/35 backdrop-blur-xl border border-white/45 p-6 sm:p-8 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-300">
                <h2 className="text-base sm:text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-white/40 pb-3.5 uppercase tracking-wider">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                  Admission Process
                </h2>
                {loading ? (
                  <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-16 w-full rounded-xl animate-pulse bg-slate-200" />)}</div>
                ) : (
                  <div className="relative border-l-2 border-slate-200 ml-4.5 pl-6.5 space-y-6">
                    {steps.map((st, i) => (
                      <motion.div
                        key={st.id}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="relative"
                      >
                        <span className="absolute -left-[38px] top-0.5 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-black shadow-sm">
                          {st.step_number < 10 ? `0${st.step_number}` : st.step_number}
                        </span>
                        <div className="bg-white/50 hover:bg-white/80 border border-white/35 hover:border-blue-400 p-4 rounded-2xl shadow-sm transition-all duration-300">
                          <h3 className="text-sm sm:text-base font-bold text-slate-950 mb-1 leading-snug">{st.title}</h3>
                          <p className="text-xs sm:text-sm text-slate-655 leading-relaxed">{st.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Eligibility Explorer */}
              <div className="bg-white/35 backdrop-blur-xl border border-white/45 p-6 sm:p-8 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-300">
                <h2 className="text-base sm:text-lg font-black text-slate-900 mb-1 flex items-center gap-2 uppercase tracking-wider">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Eligibility Explorer
                </h2>
                <p className="text-xs sm:text-sm text-slate-450 mb-5 border-b border-white/40 pb-3 font-semibold">Select a program to check eligibility criteria.</p>

                {/* Glass Custom Dropdown */}
                <div className="relative w-full max-w-md mb-6">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full appearance-none bg-white/40 hover:bg-white/65 border border-white/35 text-slate-750 text-xs sm:text-sm font-bold pl-10 pr-9 py-2 sm:py-2.5 rounded-full outline-none transition-all cursor-pointer backdrop-blur-sm shadow-sm"
                  >
                    {availableCourses.map((c) => (
                      <option key={c.value} value={c.value} className="bg-white text-slate-800">
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>

                <AnimatePresence mode="wait">
                  {eligibilityLoading ? (
                    <div className="space-y-3">
                      <div className="skeleton h-14 w-full rounded-xl animate-pulse bg-slate-200" />
                      <div className="skeleton h-14 w-full rounded-xl animate-pulse bg-slate-200" />
                    </div>
                  ) : eligibility && (
                    <motion.div
                      key={eligibility.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-blue-50/40 border border-blue-100/50 rounded-2xl p-5 space-y-4 shadow-sm"
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <div className="text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Entrance Exam</div>
                          <div className="text-xs sm:text-sm font-bold text-slate-850 flex items-center gap-1.5">
                            <BookmarkCheck className="w-4 h-4 text-blue-600 font-black shrink-0" /> {eligibility.entrance_requirement}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Minimum Marks</div>
                          <div className="text-xs sm:text-sm font-bold text-slate-850 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 font-black shrink-0" /> {eligibility.minimum_percentage}% in MPC
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-slate-200/50 pt-4">
                        <div className="text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mb-1.5">Academic Qualification</div>
                        <p className="text-xs sm:text-sm text-slate-655 leading-relaxed">{eligibility.qualification}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* ── Sidebar: Documents + Dates ── */}
            <div className="space-y-6">

              {/* Documents Card */}
              <div className="bg-white/35 backdrop-blur-xl border border-white/45 p-6 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-300">
                <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2 border-b border-white/40 pb-3 uppercase tracking-wider">
                  <FileText className="w-4.5 h-4.5 text-blue-600" /> Required Documents
                </h3>
                {loading ? (
                  <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="skeleton h-8 w-full rounded animate-pulse bg-slate-200" />)}</div>
                ) : (
                  <ul className="space-y-3.5">
                    {docs.map((d) => (
                      <li key={d.id} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-655 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                        <span>{d.document_name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Admissions Timeline */}
              <div className="bg-white/35 backdrop-blur-xl border border-white/45 p-6 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-300">
                <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2 border-b border-white/40 pb-3 uppercase tracking-wider">
                  <Calendar className="w-4.5 h-4.5 text-blue-600" /> Key Dates
                </h3>
                {loading ? (
                  <div className="space-y-3"><div className="skeleton h-28 w-full rounded-xl animate-pulse bg-slate-200" /></div>
                ) : (
                  <Timeline steps={admissionTimelineSteps} />
                )}
              </div>

            </div>

          </div>
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
