"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, CheckCircle2, ListOrdered, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { academicService, type ScholarshipItem } from "@/services/academicService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function ScholarshipsClient() {
  const router = useRouter();
  const [aiOpen, setAiOpen]             = useState(false);
  const [loading, setLoading]           = useState(true);
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [activeTab, setActiveTab]       = useState<string | null>(null);

  useEffect(() => {
    academicService.getScholarships()
      .then((res) => { setScholarships(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Scholarships & Financial Aid"
          title="Fund Your"
          highlight="Education"
          description={
            <div className="space-y-2">
              <p>
                We believe that financial constraints should never stand in the way of academic ambition. Our comprehensive aid programs are structured to recognize exceptional achievements and support students from all walks of life.
              </p>
              <p>
                Explore our diverse options: from merit-based tuition concessions and sports honors to government assistance schemes and dedicated inclusivity support systems.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Scholarships" }]}
          actions={
            <>
              <Button variant="primary" onClick={() => router.push("/admissions")} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Apply Now
              </Button>
              <Button variant="secondary" onClick={() => setAiOpen(true)}>
                Ask AI About Scholarships
              </Button>
            </>
          }
        />

        <div className="container py-12">
          {loading ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {scholarships.map((s, i) => {
                const isOpen = activeTab === s.id;
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="flex flex-col"
                  >
                    <Card
                      variant="glass"
                      className={`p-0 overflow-hidden transition-all duration-300 ${
                        isOpen ? "border-blue-500/50 shadow-md bg-white/75" : ""
                      }`}
                    >
                      {/* Header (toggle) */}
                      <button
                        onClick={() => setActiveTab(isOpen ? null : s.id)}
                        className="w-full flex items-center gap-4 p-5 text-left cursor-pointer bg-transparent hover:bg-white/30 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isOpen ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}>
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5">{s.title}</div>
                          <div className="text-xs text-slate-400 line-clamp-1">{s.description}</div>
                        </div>
                        {isOpen
                          ? <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                          : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        }
                      </button>

                      {/* Expandable content */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden bg-slate-50/30 border-t border-slate-100"
                          >
                            <div className="p-6 grid sm:grid-cols-2 gap-6">
                              {/* Eligibility */}
                              <div>
                                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Eligibility Criteria
                                </h4>
                                <ul className="space-y-2">
                                  {s.eligibility.map((e, idx) => (
                                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                      <span>{e}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Benefits */}
                              <div>
                                <h4 className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                  <Trophy className="w-3.5 h-3.5 text-amber-500" /> Benefits & Awards
                                </h4>
                                <ul className="space-y-2">
                                  {s.benefits.map((b, idx) => (
                                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                      <span>{b}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Application Process */}
                              {s.application_process && s.application_process.length > 0 && (
                                <div className="sm:col-span-2 pt-4 border-t border-slate-100">
                                  <h4 className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <ListOrdered className="w-3.5 h-3.5 text-blue-500" /> Step-by-Step Application Process
                                  </h4>
                                  <ol className="space-y-2">
                                    {s.application_process.map((step, idx) => (
                                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-2.5">
                                        <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                                        <span className="flex-1 leading-relaxed">{step}</span>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-10 max-w-3xl mx-auto">
            <Card variant="glass" className="p-6 text-center border-blue-200/50 bg-white/45 backdrop-blur-xl">
              <h3 className="text-slate-900 font-bold text-xs sm:text-sm uppercase tracking-wider mb-2">Need Help With Scholarships?</h3>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">Our AI can instantly answer questions about eligibility, deadlines, and the application process.</p>
              <Button variant="primary" size="sm" onClick={() => setAiOpen(true)} className="mx-auto">
                Ask Campus AI
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
