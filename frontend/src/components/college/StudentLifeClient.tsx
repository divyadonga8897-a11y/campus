"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Bot, ArrowRight } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import { campusService, type ClubItem } from "@/services/campusService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const categories = ["All", "Technical", "Cultural", "Sports", "Innovation"];
const catColors: Record<string, "blue" | "green" | "amber" | "slate" | "indigo"> = {
  Technical:  "blue",
  Cultural:   "amber",
  Sports:     "green",
  Innovation: "indigo",
};

const journeySteps = [
  { year: "Year 1", title: "Campus Induction & Foundation",     color: "bg-blue-600",
    desc: "Comprehensive induction, club registrations, computational thinking, and core engineering fundamentals." },
  { year: "Year 2", title: "Skill Development & Projects",         color: "bg-emerald-600",
    desc: "Mini lab projects, tech clubs, local workshops, and developer certifications in core engineering streams." },
  { year: "Year 3", title: "Industry Preparation & Internships",   color: "bg-amber-600",
    desc: "Industrial internships, hackathons, system architecture study, and placement training bootcamps." },
  { year: "Year 4", title: "Major Project & Career Launch",        color: "bg-indigo-650",
    desc: "Capstone projects, research papers, 100+ company placement interviews, graduation as industry-ready engineers." },
];

const galleryGrid = [
  { title: "Kalam Central Library", cat: "Library", img: "/images/campus/library-interior.png", size: "col-span-2 row-span-2" },
  { title: "Advanced AI Lab Workspace", cat: "Labs", img: "/images/campus/computer-lab.png", size: "col-span-1 row-span-1" },
  { title: "Annual Technical Hackathon", cat: "Events", img: "/images/campus/auditorium-event.png", size: "col-span-1 row-span-2" },
  { title: "Sports Arena Athletics", cat: "Sports", img: "/images/campus/sports-ground.png", size: "col-span-2 row-span-1" },
  { title: "Student Residency Halls", cat: "Hostel", img: "/images/hostel/hostel-room.png", size: "col-span-1 row-span-1" },
  { title: "Innovation Hub Meetup", cat: "Innovation", img: "/images/campus/computer-lab-natural.png", size: "col-span-1 row-span-1" },
];

export default function StudentLifeClient() {
  const [aiOpen, setAiOpen]             = useState(false);
  const [clubs, setClubs]               = useState<ClubItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [selectedCat, setSelectedCat]   = useState("All");

  useEffect(() => {
    campusService.getClubs()
      .then((res) => { setClubs(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredClubs = clubs.filter((c) =>
    selectedCat === "All" || c.category?.toLowerCase() === selectedCat.toLowerCase()
  );

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        <PageHero
          eyebrow="Campus Experience"
          title="Vibrant Student"
          highlight="Life & Clubs"
          description={
            <div className="space-y-2">
              <p>
                Life at Sri Satya Institute of Engineering and Technology is dynamic, inclusive, and designed to foster all-round student development beyond standard classrooms.
              </p>
              <p>
                From student-run coding communities and technical clubs to cultural societies, sports championships, and campus residency activities, we nurture diverse interests.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Student Life" }]}
          actions={
            <Button variant="secondary" onClick={() => setAiOpen(true)} leftIcon={<Bot className="w-4 h-4 text-emerald-500" />}>
              Ask Campus AI
            </Button>
          }
        />

        {/* Pinterest style gallery */}
        <section className="section bg-slate-50">
          <div className="container">
            <SectionHeader
              eyebrow="Campus Highlights"
              title="Experience"
              highlight="Life at SSIET"
              className="mb-10"
            />
            {/* Masonry CSS grid style */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[200px]">
              {galleryGrid.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                  className={`relative overflow-hidden rounded-3xl group border border-white/60 shadow-sm ${item.size} bg-slate-200`}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-slate-950/60 border border-white/10 text-white rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm mb-1 inline-block">
                      {item.cat}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-white tracking-tight leading-snug">
                      {item.title}
                    </h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Student Journey Timeline */}
        <section className="section bg-slate-50 border-t border-slate-200/50">
          <div className="container">
            <SectionHeader eyebrow="Student Journey" title="4 Years of" highlight="Professional Growth" className="mb-10" />
            <div className="relative border-l-2 border-slate-200 ml-4.5 pl-6.5 space-y-8 max-w-2xl mx-auto">
              {journeySteps.map((step, i) => (
                <motion.div
                  key={step.year}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="relative"
                >
                  <span className={`absolute -left-[38px] top-0.5 flex h-7.5 w-7.5 items-center justify-center rounded-full ${step.color} text-[10px] text-white font-black shadow-sm`}>
                    {i + 1}
                  </span>
                  <Card variant="glass" className="p-5">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">{step.year}</span>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">{step.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Clubs Section */}
        <section className="section bg-slate-50 border-t border-slate-200/50">
          <div className="container">
            <SectionHeader eyebrow="Clubs & Associations" title="SSIET Student" highlight="Communities" className="mb-8" />

            <div className="flex flex-wrap gap-2 mb-6">
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

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-36 rounded-3xl animate-pulse bg-slate-200" />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map((club, i) => {
                  const bColor = catColors[club.category] || "slate";
                  return (
                    <motion.div
                      key={club.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="flex flex-col h-full"
                    >
                      <Card variant="glass" className="flex flex-col h-full p-5 group hover:border-blue-500/30">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/25 transition-colors text-blue-600">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">{club.club_name}</h3>
                            <Badge variant="light" color={bColor} className="mt-0.5 font-extrabold uppercase tracking-wide text-[9px]">
                              {club.category}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-grow line-clamp-3 font-semibold">{club.description}</p>
                        {club.activities && club.activities.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-3.5 border-t border-slate-100 mt-auto shrink-0">
                            {club.activities.slice(0, 3).map((a) => (
                              <Badge key={a} variant="light" color="slate" className="text-[8px] uppercase font-bold py-0.5 px-2">
                                {a}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
