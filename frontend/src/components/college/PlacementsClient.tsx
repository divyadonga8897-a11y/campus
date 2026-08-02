"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Briefcase, TrendingUp, Users, Award, Building2,
  ArrowUpRight, ArrowRight, Target
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { careerService, type PlacementOverviewData, type RecruiterDetail, type PlacementStep } from "@/services/careerService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

export default function PlacementsClient() {
  const router = useRouter();
  const [aiOpen, setAiOpen]                 = useState(false);
  const [overview, setOverview]             = useState<PlacementOverviewData | null>(null);
  const [recruiters, setRecruiters]         = useState<RecruiterDetail[]>([]);
  const [processSteps, setProcessSteps]     = useState<PlacementStep[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    Promise.all([
      careerService.getPlacementOverview(),
      careerService.getRecruiters(),
      careerService.getPlacementProcess(),
    ]).then(([overRes, recRes, procRes]) => {
      setOverview(overRes.data?.[0] || null);
      setRecruiters(recRes.data || []);
      setProcessSteps(procRes.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const industries   = ["All", ...Array.from(new Set(recruiters.map((r) => r.industry)))];
  const filteredRecs = recruiters.filter((r) => selectedIndustry === "All" || r.industry.toLowerCase() === selectedIndustry.toLowerCase());

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Placements & Careers"
          title="Building Careers"
          highlight="Beyond Classrooms"
          description={
            <div className="space-y-2">
              <p>
                Our dedicated Placement and Training Cell works continuously to connect aspiring engineers with market-leading multinational corporations, IT giants, and advanced core engineering firms.
              </p>
              <p>
                With a 92% placement success rate, 100+ active recruiting partners, and rigorous personality development training, we build successful, sustainable professional pathways for our students.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Placements" }]}
          actions={
            <div className="flex flex-wrap gap-3 pointer-events-auto">
              <Button variant="primary" onClick={() => router.push("/success-stories")} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Success Stories
              </Button>
              <Button variant="secondary" onClick={() => router.push("/career-training")}>
                Career Training
              </Button>
            </div>
          }
        />

        {/* Stats Section */}
        <section className="container py-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 rounded-3xl animate-pulse bg-slate-200" />)}
            </div>
          ) : overview ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Placement Rate"
                value={`${overview.placement_percentage}%`}
                icon={TrendingUp}
                trend={{ value: "Targeting 95%", isPositive: true }}
                sparklineData={[82, 85, 87, 90, 92]}
              />
              <StatCard
                title="Students Placed"
                value={String(overview.students_placed)}
                icon={Users}
                trend={{ value: "2024 batch", isPositive: true }}
              />
              <StatCard
                title="Highest Package"
                value={`${overview.highest_package} LPA`}
                icon={Award}
                trend={{ value: "MNC offering", isPositive: true }}
                sparklineData={[12, 14, 15, 18, 22]}
              />
              <StatCard
                title="Average Package"
                value={`${overview.average_package} LPA`}
                icon={Briefcase}
                trend={{ value: "Growing trend", isPositive: true }}
              />
            </div>
          ) : null}
        </section>

        {/* Recruiters + Process */}
        <section className="container pb-16">
          <div className="grid lg:grid-cols-12 gap-10">

            {/* Recruiters showcase column */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 uppercase tracking-wider">
                <Building2 className="w-4.5 h-4.5 text-blue-600" /> Recruiter Showcase
              </h2>

              {/* Industry Filters */}
              <div className="flex flex-wrap gap-2">
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setSelectedIndustry(ind)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black border cursor-pointer transition-all select-none backdrop-blur-sm ${
                      selectedIndustry === ind
                        ? "bg-blue-600 border-blue-650 text-white shadow-sm hover:scale-105 active:scale-95"
                        : "bg-white/45 border-slate-200 text-slate-650 hover:text-slate-900 hover:bg-white/70"
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => <div key={i} className="skeleton h-36 rounded-3xl animate-pulse bg-slate-200" />)}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredRecs.map((rec) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col h-full"
                    >
                      <Card variant="glass" className="flex flex-col h-full p-5 hover:border-blue-500/30 group">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                            {rec.company_name}
                          </h3>
                          {rec.website && (
                            <a href={rec.website} target="_blank" rel="noreferrer"
                              className="text-slate-400 hover:text-blue-500 transition-colors shrink-0">
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <Badge variant="light" color="slate" className="mb-3 mx-0 w-fit font-extrabold uppercase tracking-wide text-[9px]">
                          {rec.industry}
                        </Badge>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-grow line-clamp-3 font-semibold">
                          {rec.description}
                        </p>
                        {rec.hiring_roles && rec.hiring_roles.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-3.5 border-t border-slate-100 mt-auto shrink-0">
                            {rec.hiring_roles.slice(0, 3).map((role, idx) => (
                              <Badge key={idx} variant="light" color="blue" className="text-[8px] uppercase font-bold py-0.5 px-2">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Process Timeline column */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 uppercase tracking-wider">
                <Target className="w-4.5 h-4.5 text-blue-600" /> Recruitment Journey
              </h2>

              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-3xl animate-pulse bg-slate-200" />)}
                </div>
              ) : (
                <div className="relative border-l-2 border-slate-200 ml-4.5 pl-6.5 space-y-6">
                  {processSteps.map((step, i) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      className="relative"
                    >
                      <span className="absolute -left-[38px] top-0.5 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-black shadow-sm">
                        {step.step_number < 10 ? `0${step.step_number}` : step.step_number}
                      </span>
                      <Card variant="glass" className="p-4 hover:border-blue-500/30">
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 mb-1 leading-snug">{step.step_title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">{step.description}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Related Links */}
              <div className="space-y-3 mt-8">
                {[
                  { label: "Internship Portal", desc: "Industrial learning opportunities", href: "/internships" },
                  { label: "Career Training",   desc: "Mock interviews & coding prep", href: "/career-training" },
                  { label: "Alumni Network",    desc: "Connect with SSIET alumni",     href: "/alumni" },
                ].map((l) => (
                  <Card key={l.href} clickable onClick={() => router.push(l.href)} variant="glass" className="p-4 flex items-center justify-between group">
                    <div>
                      <div className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-none mb-1">{l.label}</div>
                      <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">{l.desc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
                  </Card>
                ))}
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
