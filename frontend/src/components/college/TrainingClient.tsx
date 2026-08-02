"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, HelpCircle } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { careerService, type TrainingProgramDetail } from "@/services/careerService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function TrainingClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [programs, setPrograms] = useState<TrainingProgramDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careerService.getTrainingPrograms()
      .then((res) => {
        setPrograms(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading training catalog:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        
        <PageHero
          eyebrow="Training & Development"
          title="Empowering Student"
          highlight="Capabilities"
          description="Our placement cell organizes structured training modules covering core technologies, logical reasoning, public speaking, and HR interview strategies."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "CDC Training" }]}
        />

        <div className="container py-12">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-80 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((prog, i) => (
                <motion.div
                  key={prog.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="flex flex-col h-full"
                >
                  <Card variant="default" className="flex flex-col h-full p-6 sm:p-8 group hover:border-blue-400">
                    <div className="flex-grow space-y-4">
                      <div className="flex justify-between items-start">
                        <Badge variant="light" color="blue">
                          {prog.category}
                        </Badge>
                      </div>
                      <h3 className="text-slate-900 font-extrabold text-sm sm:text-base leading-snug">
                        {prog.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {prog.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider py-3 border-y border-slate-100">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Duration: {prog.duration}</span>
                      </div>
                    </div>

                    {prog.skills_covered && prog.skills_covered.length > 0 && (
                      <div className="space-y-2 pt-4 mt-auto shrink-0">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skills Covered</div>
                        <div className="flex flex-wrap gap-1.5">
                          {prog.skills_covered.map((skill, idx) => (
                            <span key={idx} className="badge badge-slate text-[9px]">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Help note */}
          <div className="mt-12">
            <Card variant="default" className="p-6 flex items-start gap-4">
              <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-slate-900 font-semibold text-xs sm:text-sm mb-1">Corporate Readiness Assessments</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  All training modules are accompanied by weekly AMCAT/CoCubes diagnostic test sets. Students are required to maintain a minimum of 80% attendance to secure options registration slots.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
