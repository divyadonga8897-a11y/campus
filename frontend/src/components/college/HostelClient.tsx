"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Utensils, Home, CheckCircle2, Wifi, Lock } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { campusService, type HostelInfo } from "@/services/campusService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function HostelClient() {
  const [aiOpen, setAiOpen]   = useState(false);
  const [hostels, setHostels] = useState<HostelInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    campusService.getHostels()
      .then((res) => { setHostels(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Residential Life"
          title="Secure & Comfortable"
          highlight="Student Hostels"
          description="Separate, well-furnished hostels for boys and girls with 24/7 security, Wi-Fi, and hygienic dining facilities."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Hostel" }]}
        />

        <div className="container py-12">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map(i => <div key={i} className="skeleton h-72 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <>
              {/* Hostel Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {hostels.map((hostel, i) => (
                  <motion.div
                    key={hostel.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    className="flex flex-col h-full"
                  >
                    <Card variant="default" className="flex flex-col h-full p-6 group hover:border-blue-400">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="filled" color={hostel.hostel_type === "boys" ? "blue" : "indigo"}>
                            {hostel.hostel_type === "boys" ? "Boys Hostel" : "Girls Hostel"}
                          </Badge>
                          <Badge variant="light" color="slate">{hostel.room_type}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 pt-3 border-t border-slate-100">
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Capacity</div>
                            <div className="text-xs font-bold text-slate-800 mt-0.5">{hostel.capacity} students</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sharing Mode</div>
                            <div className="text-xs font-bold text-slate-800 mt-0.5">{hostel.room_type}</div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed mb-6">
                          {hostel.description}
                        </p>
                      </div>

                      {/* Facilities */}
                      {hostel.facilities && hostel.facilities.length > 0 && (
                        <div className="mb-4 pt-4 border-t border-slate-100 mt-auto">
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Amenities</div>
                          <div className="flex flex-wrap gap-1.5">
                            {hostel.facilities.map((f) => (
                              <span key={f} className="badge badge-green text-[9px]">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Security */}
                      {hostel.security_features && hostel.security_features.length > 0 && (
                        <div className="pt-2">
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Security Features</div>
                          <div className="flex flex-wrap gap-1.5">
                            {hostel.security_features.map((s) => (
                              <span key={s} className="badge badge-slate text-[9px]">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Rules / Info */}
              <Card variant="default" className="p-6 sm:p-8">
                <h3 className="text-slate-900 font-bold text-xs sm:text-sm uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                  Hostel Rules & Policies Guidelines
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: Lock,        text: "24/7 security with CCTV monitoring"               },
                    { icon: Utensils,    text: "Hygienic vegetarian mess with daily menu"          },
                    { icon: Wifi,        text: "High-speed Wi-Fi available in all rooms"           },
                    { icon: ShieldCheck, text: "Strict visitor policy to ensure resident safety"   },
                    { icon: Home,        text: "Common rooms, TV rooms, and recreation spaces"     },
                    { icon: ShieldCheck, text: "Regular medical check-ups and first aid facilities"},
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <Icon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
