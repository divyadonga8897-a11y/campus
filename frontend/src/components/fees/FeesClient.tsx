"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  IndianRupee,
  Download,
  Info,
  CheckCircle2,
  Calendar,
  Filter,
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { academicService, type FeeItem, type CourseSummary } from "@/services/academicService";

export default function FeesClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedYear, setSelectedYear] = useState("2024-25");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    Promise.all([
      academicService.getFees(),
      academicService.getCourses()
    ]).then(([feeRes, courseRes]) => {
      setFees(feeRes.data || []);
      setCourses(courseRes.data || []);
      setLoading(false);
    }).catch(err => {
      console.error("Error loading fees catalog:", err);
      setLoading(false);
    });
  }, []);

  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const matchCourse = selectedCourse === "all" || fee.course_id === selectedCourse;
      const matchYear = fee.academic_year === selectedYear;
      return matchCourse && matchYear;
    });
  }, [fees, selectedCourse, selectedYear]);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(
        "Fee Brochure Download Started!\n\nBrochure generation will download the current structure."
      );
    }, 1500);
  };

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        
        {/* Widescreen Hero */}
        <PageHero
          eyebrow="Financial Information"
          title="Complete Fee Transparency &"
          highlight="Tiers"
          description={
            <div className="space-y-2">
              <p>
                Explore detailed breakdowns of tuition fees, board rates, hostel configurations, and examination fees structured across seat quotas.
              </p>
              <p>
                Sri Satya Institute of Engineering and Technology guarantees clear billing practices with no hidden charges.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Fees" }]}
          actions={
            <div className="flex flex-wrap gap-3 pointer-events-auto">
              <Button variant="primary" onClick={handleDownload} rightIcon={<Download className="w-4 h-4" />}>
                {downloading ? "Generating Brochure..." : "Brochure PDF"}
              </Button>
              <Button variant="secondary" onClick={() => setAiOpen(true)}>
                Ask AI About Concessions
              </Button>
            </div>
          }
        />

        <section className="container py-12">
          
          {/* Controls / Filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-white/45 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.015)] rounded-3xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-black uppercase tracking-wider">
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Filters:</span>
              </div>
              <select
                id="fee-course-filter"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white/40 hover:bg-white/60 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold outline-none transition-all cursor-pointer backdrop-blur-sm shadow-sm"
              >
                <option value="all">All Programs</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.course_name}
                  </option>
                ))}
              </select>
              <select
                id="fee-year-filter"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white/40 hover:bg-white/60 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold outline-none transition-all cursor-pointer backdrop-blur-sm shadow-sm"
              >
                <option value="2024-25">A.Y. 2024-25</option>
                <option value="2023-24">A.Y. 2023-24</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              leftIcon={<Download className="w-4 h-4 text-slate-600" />}
              className="w-full sm:w-auto font-black"
            >
              {downloading ? "Building Brochure..." : "Download Brochure"}
            </Button>
          </motion.div>

          {/* Fee Cards Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {[1, 2].map((_, idx) => (
                <div key={idx} className="skeleton h-80 rounded-3xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {filteredFees.map((fee, i) => (
                <motion.div
                  key={fee.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                >
                  <Card
                    variant="glass"
                    className="p-6 sm:p-8 flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-blue-500/5 blur-xl pointer-events-none" />

                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Badge variant="light" color="blue" className="font-extrabold text-[9px] tracking-wide uppercase">
                            {fee.fee_type}
                          </Badge>
                          <h3 className="text-slate-900 font-black text-sm sm:text-base mt-2.5 leading-snug">
                            {fee.course_name}
                          </h3>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-slate-500 text-xs font-bold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-blue-500" />
                            {fee.academic_year}
                          </div>
                        </div>
                      </div>

                      {/* Fee Breakdown */}
                      <div className="space-y-3 py-4 border-y border-slate-100 my-4">
                        {[
                          { label: "Annual Tuition Fee", value: fee.tuition_fee },
                          { label: "Hostel Fee (Optional)", value: fee.hostel_fee },
                          { label: "Other Admin Charges", value: fee.other_charges },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                            <span className="text-slate-500">{item.label}</span>
                            <span className="text-slate-900 font-extrabold flex items-center gap-0.5">
                              <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                              {item.value.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      {/* Total Fee */}
                      <div className="flex items-center justify-between py-2 mb-4">
                        <span className="text-slate-900 font-black text-xs sm:text-sm uppercase tracking-wide">Total Fee / Year</span>
                        <span className="text-xl sm:text-2xl font-black text-blue-600 flex items-center gap-0.5">
                          <IndianRupee className="w-5 h-5 shrink-0" />
                          {fee.total_fee.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-extrabold uppercase tracking-wide">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Scholarships Applicable
                        </span>
                        <Link
                          href="/scholarships"
                          className="text-xs text-blue-600 hover:text-blue-700 underline font-bold"
                        >
                          Scholarship Criteria
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Guidelines Alert */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Card variant="glass" className="p-6 border-amber-200/50 bg-amber-50/50 flex items-start gap-4 shadow-sm">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-slate-950 font-black text-sm mb-1">Important Fee Guidelines</h4>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
                  Tuition fees are subject to regular state university regulations. Optional hostel room fees include dining halls and lodging facilities. Payments can be submitted via university online portal registries or offline DD.
                </p>
              </div>
            </Card>
          </motion.div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
