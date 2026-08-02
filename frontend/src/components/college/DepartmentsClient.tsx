"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Code2, Brain, Cpu, Settings, Building, ArrowRight } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { academicService, type DepartmentSummary } from "@/services/academicService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const iconMap: Record<string, React.ElementType> = {
  cse: Code2, aids: Brain, ece: Cpu, mech: Settings, civil: Building,
};

const badgeColors: Record<string, "blue" | "green" | "amber" | "slate" | "indigo"> = {
  cse: "green",
  aids: "amber",
  ece: "blue",
  mech: "indigo",
  civil: "slate",
};

const deptImages: Record<string, string> = {
  cse:  "/images/campus/computer-lab.png",
  aids: "/images/campus/computer-lab.png",
  ece:  "/images/campus/academic-block.webp",
  mech: "/images/campus/academic-block.webp",
  civil:"/images/campus/academic-block.webp",
};

export default function DepartmentsClient() {
  const router = useRouter();
  const [aiOpen, setAiOpen]         = useState(false);
  const [loading, setLoading]       = useState(true);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);

  useEffect(() => {
    academicService.getDepartments()
      .then((res) => { setDepartments(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        <PageHero
          eyebrow="Departments Directory"
          title="Engineering &"
          highlight="Academia"
          description={
            <div className="space-y-2">
              <p>
                Our specialized divisions support advanced technical research, dedicated research labs, and structured B.Tech curricula.
              </p>
              <p>
                Each department is led by a veteran doctorate team and is equipped with professional lab systems designed to give students practical engineering experience.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Departments" }]}
        />

        <div className="container py-12">
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-72 rounded-3xl animate-pulse bg-slate-200" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {departments.map((dept, i) => {
                const Icon   = iconMap[dept.id] ?? Code2;
                const bColor = badgeColors[dept.id] ?? "blue";
                const img    = deptImages[dept.id] ?? "/images/campus/ai-lab.webp";

                return (
                  <motion.div
                    key={dept.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="flex flex-col h-full"
                  >
                    <Card
                      variant="glass"
                      clickable
                      onClick={() => router.push(`/departments/${dept.id}`)}
                      className="flex flex-col h-full group hover:border-blue-500/30"
                    >
                      {/* Department image overlay */}
                      <div className="relative h-44 overflow-hidden bg-slate-100 shrink-0">
                        <Image
                          src={img}
                          alt={dept.name}
                          fill
                          sizes="33vw"
                          className="object-cover group-hover:scale-102 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="light" color={bColor} className="font-extrabold text-[9px] uppercase tracking-wide">
                            {dept.short_name}
                          </Badge>
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-5 flex flex-col flex-grow text-left">
                        <div className="flex items-start gap-3 mb-3 shrink-0">
                          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/25">
                            <Icon className="w-4.5 h-4.5 text-blue-600" />
                          </div>
                          <h3 className="text-sm font-black text-slate-950 group-hover:text-blue-600 transition-colors leading-snug">
                            {dept.name}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed mb-5 flex-grow line-clamp-3 font-semibold">
                          {dept.description}
                        </p>

                        {/* Complete metrics list */}
                        <div className="grid grid-cols-3 gap-2 text-center mb-5 py-3 border-y border-slate-100 shrink-0 text-[10px] font-black uppercase tracking-wider text-slate-400">
                          <div>
                            <div className="text-sm font-black text-slate-900">{dept.faculty_count}+</div>
                            <div className="mt-0.5">Faculty</div>
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900">{dept.student_count}+</div>
                            <div className="mt-0.5">Students</div>
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900">{dept.established_year}</div>
                            <div className="mt-0.5">Since</div>
                          </div>
                        </div>

                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all font-black"
                        >
                          Explore Department <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
