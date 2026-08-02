"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, Award, Search, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  domain: string;
  doi?: string;
}

interface PatentItem {
  id: string;
  title: string;
  inventors: string;
  patentNum: string;
  year: number;
  status: "Published" | "Granted";
}

const papers: ResearchPaper[] = [
  {
    id: "p-1",
    title: "Optimization of CNNs on Edge Devices for IoT Systems",
    authors: "Dr. Ramesh Kumar, Dr. Priya Sharma",
    journal: "IEEE Transactions on Industrial Informatics",
    year: 2024,
    domain: "AI & ML",
    doi: "https://doi.org/10.1109/TII.2024.12345",
  },
  {
    id: "p-2",
    title: "Symmetric Encryption Protocols for Decentralized Web Databases",
    authors: "Dr. A. K. Sastry, Mr. K. V. Rao",
    journal: "Springer Journal of Cyber Security",
    year: 2023,
    domain: "Cyber Security",
  },
  {
    id: "p-3",
    title: "Low-Power Silicon Architectures for Low-Orbit Telemetry Controllers",
    authors: "Dr. Vijay Rao, Mrs. S. Lakshmi",
    journal: "IEEE Solid-State Circuits Letters",
    year: 2024,
    domain: "VLSI Design",
  },
  {
    id: "p-4",
    title: "Smart Concrete Durability Metrics via High-Performance Stress Testing",
    authors: "Dr. M. Prasad",
    journal: "International Civil Engineering Journal",
    year: 2023,
    domain: "Structures",
  },
];

const patents: PatentItem[] = [
  {
    id: "pat-1",
    title: "Intelligent Thermal Cooling System for High-Frequency Transceiver Modules",
    inventors: "Dr. Vijay Rao, Dr. S. K. Nayak",
    patentNum: "IN-2024/098765",
    year: 2024,
    status: "Published",
  },
  {
    id: "pat-2",
    title: "Decentralized Smart Grid Allocator with Dynamic Flow Sensors",
    inventors: "Dr. Ramesh Kumar, Mrs. S. Lakshmi",
    patentNum: "IN-382910-B",
    year: 2023,
    status: "Granted",
  },
];

const domains = ["All", "AI & ML", "Cyber Security", "VLSI Design", "Structures"];

export default function ResearchClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");

  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.authors.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDomain = selectedDomain === "All" || p.domain === selectedDomain;
      return matchSearch && matchDomain;
    });
  }, [searchQuery, selectedDomain]);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        <PageHero
          eyebrow="SSIET Innovations"
          title="Scholarly Research &"
          highlight="Patents Board"
          description={
            <div className="space-y-2">
              <p>
                Our research cells, faculty initiatives, and student laboratories actively contribute to globally recognized publications and scientific breakthroughs.
              </p>
              <p>
                Browse through our patent filings and peer-reviewed journals indexing innovative solutions in artificial intelligence, chip design, solid-state electronics, and structural civil works.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Research" }]}
        />

        <div className="container py-12">
          {/* Section: Publications */}
          <div className="space-y-6 mb-12">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 uppercase tracking-wider">
              <FileText className="w-4.5 h-4.5 text-blue-600" /> Publications Catalog
            </h2>

            {/* Filter toolbar */}
            <div className="bg-white/45 backdrop-blur-xl border border-white/60 p-4 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.015)] flex flex-col md:flex-row gap-4 items-center transition-all duration-300">
              <div className="w-full md:flex-1 bg-white/40 border border-slate-200 shadow-sm focus-within:border-blue-500/50 focus-within:bg-white/80 transition-all rounded-full px-5 py-2 flex items-center gap-2.5">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search papers by title or author..."
                  className="w-full text-slate-800 text-xs sm:text-sm focus:outline-none bg-transparent placeholder-slate-400 font-semibold"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-[10px] text-slate-400 hover:text-slate-700 font-bold uppercase cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {domains.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDomain(d)}
                    className={`px-4 py-2 rounded-full text-xs font-black border cursor-pointer transition-all select-none backdrop-blur-sm ${
                      selectedDomain === d
                        ? "bg-blue-600 border-blue-650 text-white shadow-sm hover:scale-105 active:scale-95"
                        : "bg-white/45 border-slate-200 text-slate-650 hover:text-slate-900 hover:bg-white/70"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Papers grid */}
            {filteredPapers.length === 0 ? (
              <Card variant="glass" className="p-10 text-center max-w-sm mx-auto">
                <p className="text-slate-500 text-xs font-bold">No papers found matching criteria.</p>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredPapers.map((paper, i) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="flex flex-col h-full"
                  >
                    <Card variant="glass" className="flex flex-col h-full p-5 sm:p-6 group hover:border-blue-500/30">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="light" color="blue" className="font-extrabold text-[9px] tracking-wide uppercase">
                          {paper.domain}
                        </Badge>
                        {paper.doi && (
                          <a href={paper.doi} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors">
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                        {paper.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mb-1">{paper.authors}</p>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide mt-auto pt-3 border-t border-slate-100">
                        {paper.journal} · {paper.year}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Patents */}
          <div className="space-y-6">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 uppercase tracking-wider">
              <Award className="w-4.5 h-4.5 text-blue-600" /> Patents Granted & Published
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {patents.map((pat) => (
                <Card key={pat.id} variant="glass" className="p-5 sm:p-6 hover:border-blue-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="light" color={pat.status === "Granted" ? "green" : "blue"} className="font-extrabold text-[9px] tracking-wide uppercase">
                      {pat.status}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{pat.patentNum}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-2">
                    {pat.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Inventors: {pat.inventors}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Filed Year: {pat.year}
                  </p>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
