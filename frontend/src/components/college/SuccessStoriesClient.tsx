"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, User, Building, Award } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { careerService, type SuccessStory } from "@/services/careerService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function SuccessStoriesClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careerService.getStudentStories()
      .then((res) => {
        setStories(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading success stories:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        
        <PageHero
          eyebrow="Inspiring Journeys"
          title="Student Success"
          highlight="Stories"
          description="Read inspiring career path stories from engineering students who successfully converted academic training into placements at multinational firms."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Success Stories" }]}
        />

        <div className="container py-12">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="skeleton h-64 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {stories.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="flex flex-col h-full"
                >
                  <Card variant="default" className="flex flex-col h-full p-6 sm:p-8 group hover:border-blue-400 relative overflow-hidden">
                    <div className="absolute top-6 right-6 text-slate-100 group-hover:text-blue-50/60 transition-colors pointer-events-none">
                      <Quote className="w-16 h-16 transform rotate-180" />
                    </div>

                    <div className="flex-grow space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {story.student_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-slate-900 font-extrabold text-sm sm:text-base leading-snug">{story.student_name}</h3>
                          <Badge variant="light" color="blue" className="mt-1 leading-none">
                            Batch of {story.graduation_year} | {story.department_id.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed italic pl-4 border-l-2 border-blue-200">
                        "{story.story}"
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between mt-auto shrink-0">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <Building className="w-3.5 h-3.5 text-blue-500" />
                        <span>Company: <strong className="text-slate-700">{story.current_company}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>Role: <strong className="text-slate-700">{story.current_role}</strong></span>
                      </div>
                    </div>
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
