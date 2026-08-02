"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { collegeService, type LeadershipMember } from "@/services/collegeService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function LeadershipClient() {
  const [aiOpen, setAiOpen]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [leaders, setLeaders] = useState<LeadershipMember[]>([]);

  useEffect(() => {
    collegeService.getLeadership()
      .then((res) => { setLeaders(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="College Administration"
          title="Visionary"
          highlight="Leadership Board"
          description="Meet the academic board, administrators, and advisors guiding excellence at Sri Satya Institute."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Leadership" }]}
        />

        <div className="container py-12">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-56 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {leaders.map((leader, i) => (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="flex flex-col h-full"
                >
                  <Card variant="default" className="flex flex-col h-full p-6 text-center group hover:border-blue-400">
                    <div className="flex-grow">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 text-blue-600 font-bold text-xl group-hover:bg-blue-100 transition-colors border border-blue-100">
                        {leader.name.charAt(0)}
                      </div>

                      <Badge variant="light" color="blue" className="mb-2 leading-none">
                        {leader.designation}
                      </Badge>
                      
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1 leading-snug">
                        {leader.name}
                      </h3>
                      {leader.qualification && (
                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                          <span>{leader.qualification}</span>
                        </div>
                      )}
                    </div>

                    {leader.description && (
                      <blockquote className="text-xs text-slate-500 italic leading-relaxed border-t border-slate-100 pt-3 mt-4 flex-grow shrink-0">
                        "{leader.description}"
                      </blockquote>
                    )}
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
