"use client";

import { useState, useEffect } from "react";
import { Search, Bot, HelpCircle } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { enquiryService, type FAQItem } from "@/services/enquiryService";

const categories = ["All", "Admission", "Fees", "Courses", "Hostel", "Campus", "General"];

export default function FAQClient() {
  const [aiOpen, setAiOpen]       = useState(false);
  const [faqs, setFaqs]           = useState<FAQItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  useEffect(() => {
    enquiryService.getFAQs()
      .then((res) => { setFaqs(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredFaqs = faqs.filter((faq) => {
    const matchSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat    = selectedCat === "All" || faq.category.toLowerCase() === selectedCat.toLowerCase();
    return matchSearch && matchCat;
  });

  const accordionItems = filteredFaqs.map((f) => ({
    id: f.id,
    title: f.question,
    content: f.answer,
  }));

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="FAQs"
          title="Frequently Asked"
          highlight="Questions"
          description={
            <div className="space-y-2">
              <p>
                Have queries regarding eligibility, fees, or campus residence? We have compiled standard answers to assist you with immediate information.
              </p>
              <p>
                Browse through our categories below or start a live workspace chat with our Campus AI Assistant to resolve complex individual inquiries.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
          actions={
            <Button variant="primary" onClick={() => setAiOpen(true)} leftIcon={<Bot className="w-4 h-4 text-emerald-300" />}>
              Ask Campus AI
            </Button>
          }
        />

        <div className="container py-10 max-w-3xl">
          
          {/* Frosted search input */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/60 p-4 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.015)] mb-6 flex items-center transition-all">
            <div className="w-full bg-white/40 border border-slate-200 shadow-sm focus-within:border-blue-500/50 focus-within:bg-white/80 transition-all rounded-full px-5 py-2 flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs by keywords..."
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
          </div>

          {/* Categories list */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-full text-xs font-black border cursor-pointer transition-all select-none backdrop-blur-sm ${
                  selectedCat === cat
                    ? "bg-blue-600 border-blue-650 text-white shadow-sm hover:scale-105 active:scale-95"
                    : "bg-white/45 border-slate-200 text-slate-650 hover:text-slate-900 hover:bg-white/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-14 rounded-3xl animate-pulse bg-slate-200" />)}
            </div>
          ) : filteredFaqs.length === 0 ? (
            <Card variant="glass" className="p-10 text-center max-w-md mx-auto">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-xs font-bold mb-2">No matching questions found.</p>
              <button onClick={() => { setSearchQuery(""); setSelectedCat("All"); }} className="text-xs text-blue-600 font-bold hover:underline">
                Clear Filters
              </button>
            </Card>
          ) : (
            <Accordion items={accordionItems} />
          )}
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
