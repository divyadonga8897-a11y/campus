"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye, Target, CheckCircle2, Trophy, Medal, Microscope, Award,
  Calendar, MapPin, GraduationCap, Globe, BookmarkCheck, ArrowRight, Sparkles, Phone
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import {
  collegeService,
  type CollegeProfile, type VisionMission,
  type CollegeAchievement, type CollegeAccreditation
} from "@/services/collegeService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const achievementIconMap: Record<string, React.ElementType> = {
  Academic:    Trophy,
  Research:    Microscope,
  Awards:      Award,
  Recognition: Medal,
};

export default function AboutPageClient() {
  const router = useRouter();
  const [aiOpen, setAiOpen]               = useState(false);
  const [loading, setLoading]             = useState(true);
  const [profile, setProfile]             = useState<CollegeProfile | null>(null);
  const [vision, setVision]               = useState<VisionMission | null>(null);
  const [achievements, setAchievements]   = useState<CollegeAchievement[]>([]);
  const [accreditations, setAccreditations] = useState<CollegeAccreditation[]>([]);
  const [collegeInfo, setCollegeInfo]     = useState<any>(null);

  useEffect(() => {
    Promise.all([
      collegeService.getProfile(),
      collegeService.getVision(),
      collegeService.getAchievements(),
      collegeService.getAccreditation(),
      collegeService.getCollege(),
    ]).then(([profRes, visRes, achRes, accRes, colRes]) => {
      setProfile(profRes.data);
      setVision(visRes.data);
      setAchievements(achRes.data || []);
      setAccreditations(accRes.data || []);
      setCollegeInfo(colRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="About Our Institution"
          title="A Legacy of Engineering"
          highlight="Excellence"
          description={
            <div className="space-y-2">
              <p>
                Founded in 2000, Sri Satya Institute of Engineering and Technology combines 25 years of scholastic prestige with modern digital discovery tools. Our curriculum blends engineering principles with human leadership ethics.
              </p>
              <p>
                From specialized labs to international research partnerships, we provide an ecosystem where engineers of tomorrow learn to design, build, and solve global challenges.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
          actions={
            <>
              <Button variant="primary" onClick={() => router.push("/admissions")} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Apply Now
              </Button>
              <Button variant="secondary" onClick={() => setAiOpen(true)} leftIcon={<Sparkles className="w-4 h-4 text-emerald-500" />}>
                Ask AI
              </Button>
            </>
          }
        />

        {/* College Info Cards */}
        <section className="container py-10">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="skeleton h-28 rounded-xl animate-pulse" />)}
            </div>
          ) : collegeInfo && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Established",        value: collegeInfo.established,      icon: Calendar,        color: "blue"   },
                { label: "Location",           value: collegeInfo.location,          icon: MapPin,         color: "green"  },
                { label: "Affiliation",        value: collegeInfo.affiliation,       icon: GraduationCap,  color: "amber"  },
                { label: "Website",            value: collegeInfo.website,           icon: Globe,          color: "indigo" },
              ].map(({ label, value, icon: Icon, color }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col"
                >
                  <Card variant="default" className="p-5 flex-grow">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{label}</div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">{value}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* College Profile */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                  <Image
                    src="/images/campus/academic-block.webp"
                    alt="SSIET Academic Block"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute -bottom-5 -right-5 bg-white border border-slate-200 rounded-xl shadow-lg p-4 z-10 text-center min-w-[90px]">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Est.</div>
                  <div className="text-xl font-black text-slate-900 leading-none">1999</div>
                </div>
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Badge variant="light" color="blue" className="mb-3">
                  Our Story
                </Badge>
                <h2 className="text-slate-900 font-black text-xl sm:text-2xl mb-4 leading-none uppercase tracking-tight">Who We Are</h2>
                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="skeleton h-4 rounded animate-pulse" />)}
                  </div>
                ) : (
                  <div className="space-y-4 text-slate-650 text-xs sm:text-sm leading-relaxed mb-6">
                    <p>
                      Sri Satya Institute of Engineering and Technology (SSIET) stands as a premier beacon of technical learning in Andhra Pradesh, established with the vision of producing high-caliber engineering professionals who are ready to build the future. Guided by a spirit of innovation, scientific curiosity, and academic integrity, our institution has grown to accommodate over 5,000 students across multiple specializations, cultivating a thriving campus culture that celebrates technical craftsmanship and social responsibility.
                    </p>
                    <p>
                      At SSIET, we believe that education should be holistic and highly responsive to global industry requirements. Our advanced curriculum integrates hands-on design laboratories, machine learning workspaces, and creative problem-solving modules. Through strategic alliances with over 100 industrial partners and dedicated technology cells, we actively support student internships, joint research programs, and entrepreneurial ventures.
                    </p>
                    <p>
                      Our distinguished faculty members combine years of academic research with practical corporate consulting expertise, mentoring students to bridge the gap between classroom theory and real-world execution. Whether in our modern computational arrays, robotic testing beds, or student-led space cells, we empower the engineers of tomorrow with the technical agility and leadership skills needed to make a global impact.
                    </p>
                  </div>
                )}

                {/* Core Values */}
                {vision?.core_values && vision.core_values.length > 0 && (
                  <div className="mb-6">
                    <div className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-2">Core Values</div>
                    <div className="flex flex-wrap gap-1.5">
                      {vision.core_values.map((v: string) => (
                        <Badge key={v} variant="light" color="blue">{v}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accreditations */}
                {!loading && accreditations.length > 0 && (
                  <div className="border-t border-slate-100 pt-5 mt-4">
                    <div className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-2">Accreditations</div>
                    <div className="flex flex-wrap gap-2">
                      {accreditations.map((acc) => (
                        <div key={acc.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white">
                          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-xs font-semibold text-slate-700">{acc.certificate_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 bg-slate-50">
          <div className="container">
            <h2 className="text-center text-slate-900 font-black text-xl sm:text-2xl mb-8 leading-none uppercase tracking-tight">Vision & Mission</h2>
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="skeleton h-48 rounded-xl animate-pulse" />
                <div className="skeleton h-48 rounded-xl animate-pulse" />
              </div>
            ) : vision && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Vision */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col h-full"
                >
                  <Card variant="default" className="p-6 flex-grow">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 border border-blue-100">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2.5 leading-snug">Our Vision</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{vision.vision}</p>
                  </Card>
                </motion.div>

                {/* Mission */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col h-full"
                >
                  <Card variant="default" className="p-6 flex-grow">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
                      <Target className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2.5 leading-snug">Our Mission</h3>
                    {Array.isArray(vision.mission) && vision.mission.length > 0 ? (
                      <ul className="space-y-2">
                        {(vision.mission as string[]).map((m, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500 leading-relaxed">{vision.mission}</p>
                    )}
                  </Card>
                </motion.div>
              </div>
            )}
          </div>
        </section>

        {/* Key Achievements */}
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-center text-slate-900 font-black text-xl sm:text-2xl mb-8 leading-none uppercase tracking-tight">Key Milestones</h2>
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="skeleton h-36 rounded-xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.slice(0, 6).map((ach, i) => {
                  const Icon = achievementIconMap[ach.category] ?? Trophy;
                  return (
                    <motion.div
                      key={ach.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="flex flex-col h-full"
                    >
                      <Card variant="default" className="flex flex-col h-full p-5 group hover:border-blue-400">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                            <Icon className="w-4 h-4 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Badge variant="light" color="amber" className="mb-1 leading-none">
                              {ach.category}
                            </Badge>
                            <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                              {ach.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-grow line-clamp-2">{ach.description}</p>
                        
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-auto pt-3 border-t border-slate-100 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>Filed Year: {ach.year}</span>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
            <div className="text-center mt-8">
              <Button variant="secondary" onClick={() => router.push("/achievements")} rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Achievements
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Strip */}
        <section className="py-16 bg-slate-900 text-white text-center">
          <div className="container max-w-xl">
            <h2 className="text-xl sm:text-2xl font-black mb-3 leading-none uppercase tracking-tight">Have Questions? We're Here</h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-8 leading-relaxed">
              Reach out to the admissions office or chat with our AI for instant answers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="primary" onClick={() => router.push("/contact")} leftIcon={<Phone className="w-4 h-4" />}>
                Contact Us
              </Button>
              <Button
                variant="outline"
                onClick={() => setAiOpen(true)}
                className="bg-white/10 text-white border-white/10 hover:bg-white/20"
                leftIcon={<Sparkles className="w-4 h-4 text-emerald-400" />}
              >
                Ask Campus AI
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
