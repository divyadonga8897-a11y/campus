"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Building, Award } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { careerService, type AlumniProfile } from "@/services/careerService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Input";

export default function AlumniClient() {
  const [aiOpen, setAiOpen]           = useState(false);
  const [alumni, setAlumni]           = useState<AlumniProfile[]>([]);
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    careerService.getAlumni()
      .then((res) => { setAlumni(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const years = ["All", ...Array.from(new Set(alumni.map((a) => a.graduation_year.toString()))).sort()];

  const filtered = alumni.filter((al) => {
    const matchSearch = al.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        al.current_company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        al.achievement.toLowerCase().includes(searchQuery.toLowerCase());
    const matchYear   = selectedYear === "All" || al.graduation_year.toString() === selectedYear;
    return matchSearch && matchYear;
  });

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Alumni Network"
          title="SSIET Proud"
          highlight="Alumni"
          description={
            <div className="space-y-2">
              <p>
                Our global network of engineering graduates spans across top-tier technological companies, research organizations, and entrepreneurial domains worldwide.
              </p>
              <p>
                Connect with our alumni board, read success stories, and find professional opportunities through our collaborative network of engineering graduates.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Alumni" }]}
        />

        <div className="container py-12">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8 items-center">
            <div className="relative flex-1 w-full">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                placeholder="Search by name, company, or achievement..."
              />
            </div>
            <div className="w-full sm:w-40 shrink-0">
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                options={years.map((y) => ({
                  value: y,
                  label: y === "All" ? "All Years" : `Batch ${y}`
                }))}
              />
            </div>
          </div>

          {/* Alumni Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-44 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card p-12 text-center max-w-sm mx-auto">
              <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-xs font-semibold">No alumni match your search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((al, i) => (
                <motion.div
                  key={al.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex flex-col h-full"
                >
                  <Card variant="default" className="flex flex-col h-full p-5 group hover:border-blue-400">
                    {/* Avatar + name */}
                    <div className="flex items-center gap-3 mb-3 shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 font-bold text-sm">
                        {al.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {al.name}
                        </h3>
                        <Badge variant="light" color="blue" className="mt-1 leading-none">
                          Batch {al.graduation_year}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3 flex-grow">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Building className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="font-semibold">{al.designation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Building className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <span>{al.current_company}</span>
                      </div>
                    </div>

                    {al.achievement && (
                      <div className="flex items-start gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500 mt-auto shrink-0">
                        <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{al.achievement}</span>
                      </div>
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
