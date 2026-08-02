"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Cpu, Users } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { campusService, type LaboratoryItem } from "@/services/campusService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const deptFilters: Record<string, string> = {
  all: "All", cse: "CSE", aids: "AI & DS", ece: "ECE",
};

export default function LabsClient() {
  const [aiOpen, setAiOpen]           = useState(false);
  const [labs, setLabs]               = useState<LaboratoryItem[]>([]);
  const [loading, setLoading]         = useState(true);
  const [selectedDept, setSelectedDept] = useState("all");

  useEffect(() => {
    campusService.getLabs()
      .then((res) => { setLabs(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredLabs = labs.filter((lab) =>
    selectedDept === "all" || lab.department_id === selectedDept
  );

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Laboratories"
          title="State-of-the-Art"
          highlight="Labs & Research Spaces"
          description="Over 15 specialized labs with modern equipment, GPU clusters, and dedicated research zones for every engineering department."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Laboratories" }]}
        />

        <div className="container py-12">
          {/* Department Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.entries(deptFilters).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setSelectedDept(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                  selectedDept === id
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-48 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLabs.map((lab, i) => (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex flex-col h-full"
                >
                  <Card variant="default" className="flex flex-col h-full p-5 group hover:border-blue-400">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                          <FlaskConical className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {lab.lab_name}
                          </h3>
                          {lab.department_id && (
                            <Badge variant="light" color="blue" className="mt-1 leading-none">
                              {deptFilters[lab.department_id] ?? lab.department_id}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        {lab.description}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-auto shrink-0">
                      {lab.capacity > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-blue-500" /> {lab.capacity} seats
                        </span>
                      )}
                      {lab.equipment_details && lab.equipment_details.length > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-blue-500" /> {lab.equipment_details.length}+ equipment
                        </span>
                      )}
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
