"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Info, Sparkles, Navigation, X, Check, Building2, Eye } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { campusService, type CampusLocation, type InfrastructureItem } from "@/services/campusService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const mapHotspots = [
  { id: "entrance", cx: 120, cy: 380, radius: 20, name: "Main Entrance", color: "from-blue-500 to-indigo-600" },
  { id: "acad-block", cx: 280, cy: 260, radius: 25, name: "Academic Block", color: "from-emerald-500 to-teal-600" },
  { id: "library", cx: 320, cy: 380, radius: 22, name: "Central Library", color: "from-purple-500 to-fuchsia-600" },
  { id: "hostel", cx: 680, cy: 220, radius: 24, name: "Hostel Block", color: "from-pink-500 to-rose-600" },
  { id: "sports", cx: 600, cy: 380, radius: 26, name: "Sports Arena", color: "from-orange-500 to-red-600" },
];

export default function CampusTourClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [infrastructures, setInfrastructures] = useState<InfrastructureItem[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<CampusLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      campusService.getCampusLocations(),
      campusService.getInfrastructure()
    ]).then(([locRes, infraRes]) => {
      setLocations(locRes.data || []);
      setInfrastructures(infraRes.data || []);
      setLoading(false);
    }).catch((err) => {
      console.error("Error fetching campus details:", err);
      setLoading(false);
    });
  }, []);

  const handleStartTour = () => {
    const mapElement = document.getElementById("interactive-map-section");
    mapElement?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        
        <PageHero
          eyebrow="Campus Virtual Tour"
          title="Experience Our"
          highlight="Vibrant Campus"
          description={
            <div className="space-y-2">
              <p>
                Take a virtual tour through the high-performance computer centers, accommodation residencies, digital library chambers, and sports fields of SSIET.
              </p>
              <p>
                Explore our world-class research hubs, smart classrooms, sports complexes, and learning environments designed to support academic and personal growth.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Campus Tour" }]}
          actions={
            <>
              <Button variant="primary" onClick={handleStartTour} rightIcon={<Navigation className="w-4 h-4" />}>
                Start Virtual Tour
              </Button>
            </>
          }
        />

        {/* Infrastructure Section */}
        <section id="infrastructure-section" className="py-16 container">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
            <Building2 className="w-4.5 h-4.5 text-blue-600" /> World-Class Facilities & Academic Spaces
          </h2>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-80 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {infrastructures.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="flex flex-col h-full"
                >
                  <Card variant="default" className="flex flex-col h-full p-5 group hover:border-blue-400">
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="light" color="blue">
                          {item.facility_type}
                        </Badge>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <span>{item.location} {item.capacity ? `| Cap: ${item.capacity}` : ""}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4 pt-3 border-t border-slate-100">
                      {item.features.map((feat) => (
                        <span key={feat} className="badge badge-slate text-[9px]">{feat}</span>
                      ))}
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleStartTour}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      View on Map
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Blueprint Map Exploration */}
        <section id="interactive-map-section" className="py-16 container">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
            <Navigation className="w-4.5 h-4.5 text-blue-600" /> Interactive Campus Radar
          </h2>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Map Canvas */}
            <div className="lg:col-span-8">
              <Card variant="default" className="p-4 relative bg-slate-150 border border-slate-200">
                <div className="absolute top-6 left-6 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 shadow-sm text-[10px] text-slate-700 font-bold uppercase tracking-wider border border-slate-200">
                  <Navigation className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
                  Active Radar Blueprint
                </div>

                <div className="relative aspect-[4/3] w-full bg-slate-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-slate-200/60">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.3" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#gridPattern)" />
                  </svg>

                  <svg
                    viewBox="0 0 800 500"
                    className="w-full h-full transition-all relative z-10"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Road pathways */}
                    <path d="M 120 400 L 320 400 L 600 400 L 680 240 M 320 400 L 320 280 L 280 280 M 320 280 L 480 200" fill="none" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                    <path d="M 120 400 L 320 400 L 600 400 L 680 240 M 320 400 L 320 280 L 280 280 M 320 280 L 480 200" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4" strokeLinecap="round" strokeOpacity="0.6" />

                    {/* Entrance Block Drawing */}
                    <rect x="70" y="340" width="100" height="80" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3" />
                    
                    {/* Academic Block Drawing */}
                    <rect x="220" y="210" width="120" height="100" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3" />

                    {/* Central Library Drawing */}
                    <circle cx="320" cy="380" r="45" fill="#faf5ff" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3" />

                    {/* Hostel Block Drawing */}
                    <rect x="620" y="160" width="120" height="120" rx="8" fill="#fff1f2" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3" />

                    {/* Sports Ground Drawing */}
                    <ellipse cx="600" cy="380" rx="60" ry="40" fill="#fff7ed" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3" />

                    {/* Intersections & Hotspots */}
                    {mapHotspots.map((spot) => {
                      const isSelected = selectedLoc?.id === spot.id;
                      return (
                        <g key={spot.id} className="cursor-pointer" onClick={() => {
                          const target = locations.find((l) => l.id === spot.id);
                          if (target) setSelectedLoc(target);
                        }}>
                          <circle
                            cx={spot.cx}
                            cy={spot.cy}
                            r={spot.radius + 8}
                            className={`fill-transparent stroke-slate-200 transition-all duration-300 ${isSelected ? "stroke-blue-500 scale-110" : ""}`}
                            strokeWidth="1.5"
                          />
                          <circle
                            cx={spot.cx}
                            cy={spot.cy}
                            r={spot.radius}
                            className={`fill-white stroke-slate-300 transition-all duration-300 ${isSelected ? "scale-105" : "hover:scale-105"}`}
                            strokeWidth="2.5"
                          />
                          <circle
                            cx={spot.cx}
                            cy={spot.cy}
                            r={spot.radius - 8}
                            className={`bg-gradient-to-r ${spot.color} opacity-75 animate-pulse`}
                          />
                          <text
                            x={spot.cx}
                            y={spot.cy + spot.radius + 18}
                            textAnchor="middle"
                            fill="#475569"
                            fontSize="9"
                            className="pointer-events-none select-none font-bold uppercase tracking-wider"
                          >
                            {spot.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </Card>
            </div>

            {/* Detail drawer / Panel */}
            <div className="lg:col-span-4 h-full">
              <AnimatePresence mode="wait">
                {selectedLoc ? (
                  <motion.div
                    key={selectedLoc.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card variant="default" className="p-6 border-blue-200 shadow-md">
                      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                        <h3 className="text-slate-900 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          {selectedLoc.name}
                        </h3>
                        <button
                          onClick={() => setSelectedLoc(null)}
                          className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        {selectedLoc.description}
                      </p>

                      <div className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100 mb-5">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Infrastructure details</div>
                        {[
                          "Full optical fiber high speed internet connectivity",
                          "24/7 surveillance cameras & monitoring wings",
                          "Full wheelchair integration and ramps",
                        ].map((hl) => (
                          <div key={hl} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                        <Link
                          href={selectedLoc.id === "hostel" ? "/hostel" : (selectedLoc.id === "library" ? "/library" : "/labs")}
                          className="w-full text-center py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                        >
                          Explore Sub-Section
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <Card variant="default" className="p-6 text-center border-slate-200">
                    <Info className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Radar Panel</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Click any glowing checkpoint hotspot on the blueprint vector map to inspect detail summaries.
                    </p>
                  </Card>
                )}
              </AnimatePresence>
            </div>

          </div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
