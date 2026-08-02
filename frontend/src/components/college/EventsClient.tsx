"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { campusService, type CampusEventItem } from "@/services/campusService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const categories = ["All", "Hackathons", "Festivals", "Workshops", "Technical Events", "Cultural Events"];

const catColors: Record<string, "blue" | "green" | "amber" | "slate" | "indigo"> = {
  "Hackathons":       "blue",
  "Festivals":        "amber",
  "Workshops":        "green",
  "Technical Events": "blue",
  "Cultural Events":  "amber",
};

export default function EventsClient() {
  const [aiOpen, setAiOpen]           = useState(false);
  const [events, setEvents]           = useState<CampusEventItem[]>([]);
  const [loading, setLoading]         = useState(true);
  const [selectedCat, setSelectedCat] = useState("All");

  useEffect(() => {
    campusService.getEvents()
      .then((res) => { setEvents(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) =>
    selectedCat === "All" || e.category?.toLowerCase() === selectedCat.toLowerCase()
  );

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Events & Activities"
          title="Campus Life &"
          highlight="Events"
          description={
            <div className="space-y-2">
              <p>
                Our campus is alive with year-round activities, technical symposia, hackathons, and cultural festivals that provide students a stage to showcase talents and build lasting collaborations.
              </p>
              <p>
                Browse through our event calendar to find upcoming computational contests, national engineering workshops, and annual cultural celebrations.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Events" }]}
        />

        <div className="container py-12">
          {/* Filters */}
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

          {/* Events Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-52 rounded-3xl animate-pulse bg-slate-200" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event, i) => {
                const bColor = catColors[event.category] ?? "slate";
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="flex flex-col h-full"
                  >
                    <Card variant="glass" className="flex flex-col h-full p-5 sm:p-6 group hover:border-blue-500/30">
                      <div className="flex items-start justify-between mb-3 shrink-0">
                        <Badge variant="light" color={bColor} className="font-extrabold text-[9px] tracking-wide uppercase">
                          {event.category}
                        </Badge>
                      </div>

                      <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                        {event.event_name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-grow line-clamp-3 font-semibold">{event.description}</p>

                      <div className="space-y-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border-t border-slate-100 pt-3.5 shrink-0 mt-auto">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>{event.event_date}</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <Card variant="glass" className="p-10 text-center max-w-sm mx-auto">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-xs font-bold">No events in this category.</p>
            </Card>
          )}
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
