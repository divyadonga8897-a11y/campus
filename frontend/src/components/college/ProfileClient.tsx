"use client";

import { useState } from "react";
import { User, Phone, Mail, MapPin, Sparkles, Send, ShieldAlert, Check } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function ProfileClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Divya Donga",
    rollNo: "22871A0501",
    department: "Computer Science Engineering",
    email: "divya.donga@ssiet.ac.in",
    phone: "9876543210",
    address: "West Godavari, Andhra Pradesh, India",
    batch: "2022 - 2026",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        <PageHero
          eyebrow="My Account"
          title="Academic Profile"
          highlight="Dashboard"
          description="View and verify your registered enrollment files, contact details, and department registries."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Profile" }]}
        />

        <div className="container py-12 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Left Col: Avatar Details Card */}
            <div>
              <Card variant="default" className="p-6 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-2xl mx-auto shadow-sm">
                  DD
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{profileData.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{profileData.rollNo}</p>
                </div>
                <Badge variant="light" color="blue" className="mx-auto">
                  Student Member
                </Badge>
                <div className="pt-4 border-t border-slate-100 text-left text-xs space-y-2 text-slate-500">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Department:</span>
                    <span className="font-bold text-slate-800 text-right">{profileData.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Current Batch:</span>
                    <span className="font-bold text-slate-800">{profileData.batch}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Col: Forms Info */}
            <div className="md:col-span-2">
              <Card variant="default" className="p-6 sm:p-8">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">
                  Manage Contact Details
                </h3>

                <form onSubmit={handleUpdate} className="space-y-4">
                  {success && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-1.5 font-bold animate-fadeIn">
                      <Check className="w-4 h-4" /> Profile credentials updated successfully.
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name (Read-Only)"
                      value={profileData.name}
                      readOnly
                      disabled
                      leftIcon={<User className="w-4 h-4 text-slate-400" />}
                    />
                    <Input
                      label="Enrollment ID (Read-Only)"
                      value={profileData.rollNo}
                      readOnly
                      disabled
                      leftIcon={<ShieldAlert className="w-4 h-4 text-slate-400" />}
                    />
                  </div>

                  <Input
                    label="Official Email Address"
                    value={profileData.email}
                    readOnly
                    disabled
                    leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  />

                  <Input
                    label="Active Phone Number"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                  />

                  <Textarea
                    label="Permanent Residential Address"
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={submitting}
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Save Changes
                  </Button>
                </form>
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
