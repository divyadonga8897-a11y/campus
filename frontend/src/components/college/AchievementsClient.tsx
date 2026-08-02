"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Microscope, Award, Calendar } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { collegeService, type CollegeAchievement } from "@/services/collegeService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const categories = [
  { value: "all",         label: "All" },
  { value: "Academic",   label: "Academic" },
  { value: "Research",   label: "Research" },
  { value: "Awards",     label: "Awards" },
  { value: "Recognition",label: "Recognition" },
];

const categoryIconMap: Record<string, React.ElementType> = {
  Academic:    Trophy,
  Research:    Microscope,
  Awards:      Award,
  Recognition: Medal,
};

const catColors: Record<string, "blue" | "green" | "amber" | "slate" | "indigo"> = {
  Academic:    "blue",
  Research:    "green",
  Awards:      "amber",
  Recognition: "slate",
};

export default function AchievementsClient() {
  const [aiOpen, setAiOpen]               = useState(false);
  const [loading, setLoading]             = useState(true);
  const [achievements, setAchievements]   = useState<CollegeAchievement[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    setLoading(true);
    const cat = activeCategory === "all" ? undefined : activeCategory;
    collegeService.getAchievements(cat)
      .then((res) => { setAchievements(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Achievements"
          title="Milestones of"
          highlight="Excellence"
          description={
            <div className="space-y-2">
              <p>
                Sri Satya Institute of Engineering and Technology takes immense pride in our track record of research accomplishments, academic accolades, and national recognitions.
              </p>
              <p>
                Browse through our timeline of key achievements, featuring excellence awards, patent grants, paper citations, and state-level athletic championship trophies.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Achievements" }]}
        />

        <div className="container py-12">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                  activeCategory === cat.value
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-355 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-44 rounded-xl" />)}
            </div>
          ) : (
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {achievements.map((ach, i) => {
                  const Icon  = categoryIconMap[ach.category] ?? Trophy;
                  const bColor = catColors[ach.category] ?? "slate";
                  return (
                    <motion.div
                      key={ach.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="flex flex-col h-full"
                    >
                      <Card variant="default" className="flex flex-col h-full p-5 group hover:border-blue-400">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                            <Icon className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Badge variant="light" color={bColor} className="mb-1 leading-none">
                              {ach.category}
                            </Badge>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                              {ach.title}
                            </h3>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-grow line-clamp-3">
                          {ach.description}
                        </p>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-3 border-t border-slate-100 mt-auto shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>Filed Year: {ach.year}</span>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && achievements.length === 0 && (
            <div className="card p-12 text-center max-w-sm mx-auto">
              <Trophy className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-xs font-semibold">No achievements in this category.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
