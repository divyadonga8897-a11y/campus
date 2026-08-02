"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { collegeService, type GalleryItem } from "@/services/collegeService";

const categories = [
  { value: "all",          label: "All" },
  { value: "campus",       label: "Campus" },
  { value: "labs",         label: "Labs" },
  { value: "events",       label: "Events" },
  { value: "student_life", label: "Student Life" },
  { value: "achievements", label: "Achievements" },
];

export default function GalleryClient() {
  const [aiOpen, setAiOpen]               = useState(false);
  const [gallery, setGallery]             = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const cat = activeCategory === "all" ? undefined : activeCategory;
    collegeService.getGallery(cat).then((res) => setGallery(res.data || []));
  }, [activeCategory]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((p) => (p! === 0 ? gallery.length - 1 : p! - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((p) => (p! === gallery.length - 1 ? 0 : p! + 1));
  };

  const selected = lightboxIndex !== null ? gallery[lightboxIndex] : null;

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Campus Gallery"
          title="SSIET Visual"
          highlight="Showcase"
          description={
            <div className="space-y-2">
              <p>
                Take a visual journey through our academic grounds, high-tech computation labs, and active student facilities that capture daily life at SSIET.
              </p>
              <p>
                From coding bootcamps and structural experiments to athletic championships and cultural festivals, explore the campus moments that define us.
              </p>
            </div>
          }
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
        />

        <div className="container py-12">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setActiveCategory(c.value)}
                className={`px-4 py-2 rounded-full text-xs font-black border cursor-pointer transition-all select-none backdrop-blur-sm ${
                  activeCategory === c.value
                    ? "bg-blue-600 border-blue-650 text-white shadow-sm hover:scale-105 active:scale-95"
                    : "bg-white/45 border-slate-200 text-slate-650 hover:text-slate-900 hover:bg-white/70"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {gallery.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-[4/3] overflow-hidden rounded-3xl cursor-pointer group bg-slate-200 border border-white/60 shadow-sm"
                  onClick={() => setLightboxIndex(idx)}
                >
                  <Image
                    src={item.image_url}
                    alt={item.title || "Gallery"}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-102 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                    <p className="text-white text-xs font-bold leading-none">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {gallery.length === 0 && (
            <Card variant="glass" className="p-12 text-center max-w-sm mx-auto shadow-sm">
              <Images className="w-8 h-8 text-slate-350 mx-auto mb-2" />
              <p className="text-slate-500 text-xs font-bold">No images in this category.</p>
            </Card>
          )}
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-55 flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              onClick={handlePrev}
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              onClick={handleNext}
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div
              className="relative max-w-4xl max-h-[80vh] w-full h-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selected.image_url}
                alt={selected.title ?? "Gallery"}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {selected.title && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm">
                {selected.title}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
