"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, GraduationCap, Info, HelpCircle } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { careerService, type InternshipDetail } from "@/services/careerService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function InternshipsClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [internships, setInternships] = useState<InternshipDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careerService.getInternships()
      .then((res) => {
        setInternships(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading internships list:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        
        <PageHero
          eyebrow="Practical Learning"
          title="Industry Internship"
          highlight="Opportunities"
          description="Bridge your classroom engineering fundamentals with active product development by matching with internships at top technology firms."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Internships" }]}
        />

        <div className="container py-12">
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="skeleton h-56 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-8">
              {internships.map((intern, i) => (
                <motion.div
                  key={intern.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="flex flex-col h-full"
                >
                  <Card variant="default" className="flex flex-col h-full p-6 sm:p-8 group hover:border-blue-400">
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="light" color="blue">
                          {intern.domain}
                        </Badge>
                      </div>
                      <h3 className="text-slate-900 font-extrabold text-sm sm:text-base mb-1 group-hover:text-blue-600 transition-colors">
                        {intern.company_name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-4">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>Duration: {intern.duration}</span>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed mb-6">
                        {intern.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100 mt-auto shrink-0">
                      {intern.eligibility && (
                        <div className="flex items-start gap-2.5 text-xs text-slate-600">
                          <GraduationCap className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <span><strong>Eligibility:</strong> {intern.eligibility}</span>
                        </div>
                      )}
                      {intern.application_information && (
                        <div className="flex items-start gap-2.5 text-xs text-slate-500">
                          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span><strong>Application Info:</strong> {intern.application_information}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Guidelines box */}
          <div className="mt-12">
            <Card variant="default" className="p-6 flex items-start gap-4">
              <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-slate-900 font-semibold text-xs sm:text-sm mb-1">Internships Credit Auditing</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Industrial projects completed during the 6th or 7th semesters can be mapped to academic credits subject to validation audits by the department HOD boards.
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
