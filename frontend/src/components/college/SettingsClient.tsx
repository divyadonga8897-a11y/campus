"use client";

import { useState } from "react";
import { Settings, Lock, Eye, Bell, Shield, Sparkles, Send, Check } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Input, Checkbox } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SettingsClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [notifications, setNotifications] = useState({
    academic: true, placements: true, hostel: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setPasswords({ current: "", next: "", confirm: "" });
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        <PageHero
          eyebrow="Preferences"
          title="Account Settings &"
          highlight="Preferences"
          description="Manage security passcodes, update layout triggers and customize notification dispatch sheets."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }]}
        />

        <div className="container py-12 max-w-3xl">
          <div className="space-y-6">
            
            {/* Notification Feed preferences */}
            <Card variant="default" className="p-6">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                <Bell className="w-4.5 h-4.5 text-blue-600" /> Notifications Feed Preferences
              </h3>
              <div className="space-y-4">
                <Checkbox
                  label="Academic Notices & Exam Timetables"
                  checked={notifications.academic}
                  onChange={(e) => setNotifications(prev => ({ ...prev, academic: e.target.checked }))}
                />
                <Checkbox
                  label="Placement Drives & Corporate Recruiters updates"
                  checked={notifications.placements}
                  onChange={(e) => setNotifications(prev => ({ ...prev, placements: e.target.checked }))}
                />
                <Checkbox
                  label="Hostel residency bulletins and mess announcements"
                  checked={notifications.hostel}
                  onChange={(e) => setNotifications(prev => ({ ...prev, hostel: e.target.checked }))}
                />
              </div>
            </Card>

            {/* Password security settings */}
            <Card variant="default" className="p-6 sm:p-8">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                <Shield className="w-4.5 h-4.5 text-blue-600" /> Change Security Passcode
              </h3>
              
              <form onSubmit={handleSave} className="space-y-4">
                {success && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-1.5 font-bold animate-fadeIn">
                    <Check className="w-4 h-4" /> Preferences and credentials saved.
                  </div>
                )}

                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwords.current}
                  onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                />

                <Input
                  label="New Password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={passwords.next}
                  onChange={(e) => setPasswords(prev => ({ ...prev, next: e.target.value }))}
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm new password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={submitting}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Save Settings
                </Button>
              </form>
            </Card>

          </div>
        </div>
      </main>
      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
