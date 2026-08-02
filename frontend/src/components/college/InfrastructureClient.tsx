"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Monitor, Brain, Cpu, BookOpen, Lightbulb, MapPin, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { campusService, type Facility } from "@/services/campusService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const iconMap: Record<string, React.ElementType> = {
  "smart-classrooms": Monitor,
  "ai-labs": Brain,
  "programming-labs": Cpu,
  "central-library": BookOpen,
  "innovation-center": Lightbulb,
};

export default function InfrastructureClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    campusService.getFacilities().then((res) => {
      setFacilities(res.data || []);
    });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        
        <PageHero
          eyebrow="Campus Assets"
          title="Premium Academic"
          highlight="Infrastructure"
          description="Explore our tech-integrated academic assets engineered to facilitate high-intensity learning, computing research, and design innovation."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Infrastructure" }]}
        />

        <div className="container py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((fac, i) => {
              const Icon = iconMap[fac.id] ?? Monitor;
              return (
                <motion.div
                  key={fac.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="flex flex-col h-full"
                >
                  <Card variant="default" className="flex flex-col h-full p-5 group hover:border-blue-400">
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-350">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <Badge variant="light" color="slate" className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-blue-500" />
                          <span>{fac.location}</span>
                        </Badge>
                      </div>

                      <h3 className="text-slate-900 font-extrabold text-sm sm:text-base mb-2 group-hover:text-blue-600 transition-colors">
                        {fac.name}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed mb-6">
                        {fac.description}
                      </p>
                    </div>

                    {/* Highlights checklist footer */}
                    <div className="pt-4 border-t border-slate-100 space-y-2 mt-auto shrink-0">
                      {[
                        "Fully air-conditioned environments",
                        "24/7 dedicated support technicians",
                        "Integration with student digital IDs",
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
