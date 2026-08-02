"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Sparkles, Navigation } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { COLLEGE_INFO } from "@/constants/collegeData";
import { enquiryService, type ContactDetail } from "@/services/enquiryService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function ContactClient() {
  const [aiOpen, setAiOpen]     = useState(false);
  const [contacts, setContacts] = useState<ContactDetail[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    enquiryService.getContactInfo()
      .then((res) => { setContacts(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Contact Us"
          title="Connect With"
          highlight="SSIET"
          description="Find contact details for our admissions office, departments, and campus location."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
          actions={
            <Button variant="primary" onClick={() => setAiOpen(true)} leftIcon={<Sparkles className="w-4 h-4 text-emerald-300" />}>
              Ask AI Assistant
            </Button>
          }
        />

        <div className="container py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* Contact Cards */}
            <div className="space-y-5">
              {loading ? (
                [1, 2].map(i => <div key={i} className="skeleton h-40 rounded-xl" />)
              ) : (
                contacts.map((contact, i) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    className="flex flex-col"
                  >
                    <Card variant="glass" className="p-6">
                      <Badge variant="light" color="blue" className="mb-3">
                        Support Desk
                      </Badge>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 mb-4">{contact.department}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs text-slate-600">
                          <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                          <a href={`tel:${contact.phone}`} className="font-semibold hover:text-blue-600 transition-colors">
                            {contact.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-600">
                          <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                          <a href={`mailto:${contact.email}`} className="font-semibold hover:text-blue-600 transition-colors">
                            {contact.email}
                          </a>
                        </div>
                        <div className="flex items-start gap-3 text-xs text-slate-600">
                          <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <span>{contact.address}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100 mt-2">
                          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>{contact.office_hours}</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}

              {/* Helpline Card */}
              <Card variant="glass" className="p-5 bg-gradient-to-br from-blue-650 to-indigo-750 border-blue-500/35 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-blue-400/10 blur-xl pointer-events-none" />
                <div className="flex items-start gap-3 relative z-10">
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-xs mb-1 uppercase tracking-wider">Admissions Helpline</h4>
                    <p className="text-blue-100 text-xs leading-relaxed font-semibold">
                      For immediate help with documents, scholarships, and admission queries — contact our counselors directly.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Map / Location Card */}
            <div>
              <Card variant="glass" className="overflow-hidden border border-white/60 bg-white/45">
                <div className="bg-white/30 px-4 py-3 flex items-center gap-2 border-b border-slate-200/50">
                  <Navigation className="w-4 h-4 text-blue-500 animate-bounce" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Campus Location</span>
                </div>
                <div className="p-6 flex flex-col items-center justify-center text-center gap-4" style={{ minHeight: 300 }}>
                  <MapPin className="w-12 h-12 text-blue-500" />
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">SSIET Campus</h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-semibold">
                      {COLLEGE_INFO.address}
                    </p>
                    <Badge variant="light" color="slate" className="mt-3">
                      16.6358° N | 81.7248° E
                    </Badge>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => window.open("https://maps.google.com/?q=Sri+Satya+Institute+Engineering+West+Godavari+Andhra+Pradesh", "_blank")}
                  >
                    Open in Google Maps
                  </Button>
                </div>

                {/* Quick Info Row */}
                <div className="border-t border-slate-200/50 grid grid-cols-2 divide-x divide-slate-200/50 text-center">
                  <div className="p-4">
                    <div className="text-xs font-bold text-slate-900 leading-none mb-1">Mon – Sat</div>
                    <div className="text-[10px] text-slate-400 font-medium">Office Hours</div>
                  </div>
                  <div className="p-4">
                    <div className="text-xs font-bold text-slate-900 leading-none mb-1">9AM – 5PM</div>
                    <div className="text-[10px] text-slate-400 font-medium">Working Hours</div>
                  </div>
                </div>
              </Card>
            </div>

          </div>
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
