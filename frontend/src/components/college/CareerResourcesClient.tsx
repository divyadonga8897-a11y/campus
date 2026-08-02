"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, Download, HelpCircle } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { careerService, type CareerResourceDetail } from "@/services/careerService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function CareerResourcesClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [resources, setResources] = useState<CareerResourceDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careerService.getCareerResources()
      .then((res) => {
        setResources(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading career resources:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        
        <PageHero
          eyebrow="Preparation Desk"
          title="Career Guidance"
          highlight="Resources"
          description="Access self-study coding roadmaps, verbal reasoning guides, sample resumes, and common aptitude interview question lists curated by experts."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "CDC Resources" }]}
        />

        <div className="container py-12">
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="skeleton h-48 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-8">
              {resources.map((res, i) => (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex flex-col h-full"
                >
                  <Card variant="default" className="flex flex-col h-full p-6 sm:p-8 group hover:border-blue-400">
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="light" color="blue">
                          {res.resource_type}
                        </Badge>
                      </div>
                      <h3 className="text-slate-900 font-extrabold text-sm sm:text-base mb-2 group-hover:text-blue-600 transition-colors">
                        {res.title}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed mb-6">
                        {res.description}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => window.open(res.link, "_blank")}
                      leftIcon={<Download className="w-4 h-4 text-blue-200" />}
                      className="w-full sm:w-fit"
                    >
                      Download PDF Resource
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Help box */}
          <div className="mt-12">
            <Card variant="default" className="p-6 flex items-start gap-4">
              <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-slate-900 font-semibold text-xs sm:text-sm mb-1">Corporate Guest Lectures</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Stay updated on industry trends. We organize guest panels from Google, Amazon, and Microsoft tech leads on weekly schedule streams. Keep checking notification banners.
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
