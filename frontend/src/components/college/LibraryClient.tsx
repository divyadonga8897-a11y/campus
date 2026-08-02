"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { BookOpen, Laptop } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { campusService, type LibraryInfo } from "@/services/campusService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function LibraryClient() {
  const [aiOpen, setAiOpen]           = useState(false);
  const [libraryData, setLibraryData] = useState<LibraryInfo | null>(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
     campusService.getLibrary()
      .then((res) => { setLibraryData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Central Library"
          title="Dr. A.P.J. Abdul Kalam"
          highlight="Library"
          description="50,000+ books, digital resources, silent study cabins, and online learning access — all in one place."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Library" }]}
        />

        <div className="container py-12">
          {loading || !libraryData ? (
            <div className="grid lg:grid-cols-2 gap-8 animate-pulse">
              <div className="skeleton h-64 rounded-xl" />
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}
              </div>
            </div>
          ) : (
            <>
              {/* Overview */}
              <div className="grid lg:grid-cols-2 gap-8 mb-10 items-center">
                {/* Library Image */}
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative aspect-video rounded-2xl overflow-hidden shadow-md border border-slate-200"
                >
                  <Image
                    src={libraryData.image_url || "/images/campus/library.webp"}
                    alt="SSIET Central Library"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>

                {/* Library Info */}
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className="space-y-4"
                >
                  <h2 className="text-slate-900 font-extrabold text-sm sm:text-base leading-snug">{libraryData.title}</h2>
                  <p className="text-xs text-slate-500 leading-relaxed">{libraryData.description}</p>

                  {/* Quick Stat Chips */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="filled" color="blue">{libraryData.book_count?.toLocaleString()}+ Books</Badge>
                    <Badge variant="light" color="green">{libraryData.digital_resources?.length}+ Digital Resources</Badge>
                    <Badge variant="light" color="amber">{libraryData.seating_capacity} Seats Available</Badge>
                  </div>
                </motion.div>
              </div>

              {/* Facilities Grid */}
              {libraryData.facilities && libraryData.facilities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-blue-600" /> Library Facilities & Services
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {libraryData.facilities.map((facility, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="flex flex-col h-full"
                      >
                        <Card variant="default" className="p-4 hover:border-blue-400 group">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                              <BookOpen className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-xs font-bold text-slate-700">{facility}</p>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Digital Resources */}
              {libraryData.digital_resources && libraryData.digital_resources.length > 0 && (
                <Card variant="default" className="p-6">
                  <h2 className="text-xs font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Laptop className="w-4.5 h-4.5 text-blue-600" /> Digital Journal & E-Library Subscriptions
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {libraryData.digital_resources.map((r, i) => (
                      <Badge key={i} variant="light" color="blue">{r}</Badge>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
