"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, MessagesSquare, Percent, Laptop, Calendar } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Timeline } from "@/components/ui/Timeline";

const trainingPrograms = [
  { icon: Code2, title: "Data Structures & Algorithms", desc: "Rigorous coding bootcamps covering lists, trees, search techniques, and dynamic programming patterns to clear MNC coding screenings." },
  { icon: MessagesSquare, title: "Soft Skills & Communication", desc: "Interactive modules focusing on mock group discussions, email etiquettes, professional resume formats, and pitch delivery." },
  { icon: Percent, title: "Quantitative & Logic Aptitude", desc: "Special training runs highlighting speed mathematics, logical charts, arithmetic shortcuts, and mental reasoning questions." },
  { icon: Laptop, title: "Technical Mock Interviews", desc: "Mock interviews with industry experts, structural system design tutorials, and live review feedback to build student confidence." },
];

const timelineSteps = [
  { year: "Year 1", phase: "Foundation Skills", desc: "Introduction to logical problem solving, algorithmic thinking, basic programming syntax, and english vocabulary drills." },
  { year: "Year 2", phase: "Technical Development", desc: "Core database concepts, data structures laboratory, web dev frameworks, and mini-project creations." },
  { year: "Year 3", phase: "Industry Preparation", desc: "Industrial internships, full-stack capstone projects, placement mock interviews, and advanced aptitude practice." },
  { year: "Year 4", phase: "Placement Success", desc: "On-campus placement drives, hiring rounds, portfolio presentations, and career transitions to corporatized offices." },
];

export default function CareerDevelopmentClient() {
  const [aiOpen, setAiOpen] = useState(false);

  const roadmapTimelineSteps = timelineSteps.map((step, idx) => ({
    id: idx,
    title: step.phase,
    subtitle: step.year,
    description: step.desc,
    date: step.year,
    status: (idx === 3 ? "active" : "completed") as any
  }));

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        
        <PageHero
          eyebrow="CDC Division"
          title="Career Development"
          highlight="Center"
          description="Our dedicated training wing ensures students are equipped with coding depth, logical aptitude, and communication confidence required to pass recruitment loops."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "CDC Center" }]}
        />

        {/* Programs Grid */}
        <section className="container py-16">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
            <Code2 className="w-4.5 h-4.5 text-blue-600" /> Career Training Programs
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 mb-20">
            {trainingPrograms.map((prog, i) => {
              const Icon = prog.icon;
              return (
                <motion.div
                  key={prog.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex flex-col h-full"
                >
                  <Card variant="default" className="flex flex-col h-full p-6 sm:p-8 group hover:border-blue-400">
                    <div className="flex gap-5 items-start">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug mb-2">{prog.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{prog.desc}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Timeline prep journey */}
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-8 flex items-center gap-2">
            <Calendar className="w-4.5 h-4.5 text-blue-600" /> Placement Preparation Roadmap
          </h2>

          <div className="max-w-xl mx-auto">
            <Timeline steps={roadmapTimelineSteps} />
          </div>
        </section>

      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
