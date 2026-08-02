"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Bell, Newspaper, Tag, ArrowRight } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
}

const newsData: NewsItem[] = [
  {
    id: "n-1",
    title: "SSIET Achieves Top Placement Stats for 2024 Engineering Batch",
    category: "Placements",
    date: "July 28, 2026",
    summary: "Over 450 engineering students placed in top multinational IT firms, including TCS, Infosys, and Cognizant.",
    content: "Placement cell is glad to announce that the B.Tech 2024 graduation batch achieved an overall 92% placement rate, matching our institutional standards.",
  },
  {
    id: "n-2",
    title: "Admissions Open for B.Tech CSE, AI & Data Science and ECE Streams",
    category: "Academic",
    date: "July 25, 2026",
    summary: "Scholastic registrations are now open for conventer and management quota seats for 2026 engineering streams.",
    content: "Interested candidates can fill out the enquiry sheet or visit the guidance desk. Direct consultation support is active 9AM to 5PM.",
  },
  {
    id: "n-3",
    title: "Annual National Hackathon 'SatyaHack 2026' Registrations Begin",
    category: "Events",
    date: "July 20, 2026",
    summary: "A 36-hour code marathon hosting 100+ developer teams from across engineering colleges.",
    content: "The CSE and AI & DS student associations are coordinating our flagship software building hackathon. Cash prizes up to ₹1,00,000.",
  },
  {
    id: "n-4",
    title: "Semester Registration Fee and Exam Calendar Guidelines Released",
    category: "Notifications",
    date: "July 15, 2026",
    summary: "Notice regarding exam schedule, hall tickets, fee deadlines, and rules for upcoming semester tests.",
    content: "All engineering students must submit their semester fees by the deadline. Detail circular sheets are posted on department boards.",
  },
];

const categories = ["All", "Academic", "Placements", "Events", "Notifications"];
const catColors: Record<string, "blue" | "green" | "amber" | "slate" | "indigo"> = {
  Academic: "blue",
  Placements: "green",
  Events: "amber",
  Notifications: "slate",
};

export default function NewsClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  const filteredNews = useMemo(() => {
    return newsData.filter((item) => {
      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCat === "All" || item.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCat]);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        <PageHero
          eyebrow="SSIET Bulletins"
          title="Campus News &"
          highlight="Notices Board"
          description={
            <div className="space-y-2">
              <p>
                Get the latest news regarding semester schedules, technical conferences, placement record drives, and student club notifications at SSIET.
              </p>
              <p>
                Browse through our notices board and download official guidelines to stay informed about university processes and academic calendars.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "News" }]}
        />

        <div className="container py-12">
          {/* Filters Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 items-center">
            <div className="w-full md:flex-1">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                placeholder="Search news releases and notices..."
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCat(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                    selectedCat === c
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Listing */}
          {filteredNews.length === 0 ? (
            <div className="card p-10 text-center max-w-sm mx-auto">
              <Newspaper className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-xs font-semibold">No recent announcements found.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredNews.map((item, i) => {
                const bColor = catColors[item.category] ?? "slate";
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.05 }}
                    className="flex flex-col h-full"
                  >
                    <Card variant="default" className="flex flex-col h-full p-6 group hover:border-blue-400">
                      <div className="flex items-start justify-between mb-3 shrink-0">
                        <Badge variant="light" color={bColor}>
                          {item.category}
                        </Badge>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" /> {item.date}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-grow">
                        {item.summary}
                      </p>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100/60 shrink-0 mb-4">
                        {item.content}
                      </p>
                      <Button
                        variant="secondary"
                        size="xs"
                        className="w-fit self-end group-hover:bg-blue-600 group-hover:text-white"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Read Full Release
                      </Button>
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
