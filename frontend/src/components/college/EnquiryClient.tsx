"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, User, BookOpen, Send,
  CheckCircle2, AlertTriangle, Bot, MessageSquare
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AIModal from "@/components/ui/AIModal";
import PageHero from "@/components/ui/PageHero";
import { enquiryService } from "@/services/enquiryService";
import { COLLEGE_INFO } from "@/constants/collegeData";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const courses = [
  { value: "b-tech-cse",  label: "B.Tech Computer Science Engineering (CSE)"         },
  { value: "b-tech-aids", label: "B.Tech Artificial Intelligence & Data Science"      },
  { value: "b-tech-ece",  label: "B.Tech Electronics & Communication (ECE)"          },
  { value: "b-tech-mech", label: "B.Tech Mechanical Engineering"                     },
  { value: "b-tech-civil",label: "B.Tech Civil Engineering"                          },
];

export default function EnquiryClient() {
  const [aiOpen, setAiOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    course_interest: "b-tech-cse", message: "",
  });
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.length < 2)
      e.name = "Full name must be at least 2 characters.";
    const emailRe = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!formData.email.trim() || !emailRe.test(formData.email))
      e.email = "Please provide a valid email address.";
    const phoneRe = /^\+?[0-9]{10,15}$/;
    if (!formData.phone.trim() || !phoneRe.test(formData.phone))
      e.phone = "Provide a valid phone number (10–15 digits).";
    if (!formData.message.trim() || formData.message.length < 10)
      e.message = "Message must be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setGeneralError("");
    if (!validate()) return;
    setSubmitting(true);
    const res = await enquiryService.submitEnquiry({ ...formData });
    setSubmitting(true);
    if (res.success) {
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", course_interest: "b-tech-cse", message: "" });
    } else {
      setGeneralError(res.error || "Submission failed. Please try again.");
    }
    setSubmitting(false);
  };

  const handleTextChange = (name: string, value: string) => {
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">

        <PageHero
          eyebrow="Student Enquiry"
          title="Get in Touch"
          highlight="with Admissions"
          description="Questions about eligibility, fees, seats, or courses? Submit your enquiry and we'll get back within 24 hours."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Enquiry" }]}
        />

        <div className="container py-12">
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

            {/* ── Form ── */}
            <div className="lg:col-span-2">
              <Card variant="glass" className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-10 space-y-4"
                    >
                      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">Enquiry Submitted!</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                        Thank you! Our admissions counsellor will contact you within 24 working hours.
                      </p>
                      <Button
                        variant="secondary"
                        onClick={() => setSuccess(false)}
                        className="mx-auto"
                      >
                        Submit Another Enquiry
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* Error Banner */}
                      {generalError && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-red-600 text-xs">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          {generalError}
                        </div>
                      )}

                      {/* Name */}
                      <Input
                        label="Full Name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => handleTextChange("name", e.target.value)}
                        leftIcon={<User className="w-4 h-4 text-slate-400" />}
                        error={errors.name}
                      />

                      {/* Email + Phone row */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                          label="Email Address"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => handleTextChange("email", e.target.value)}
                          leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                          error={errors.email}
                        />
                        <Input
                          label="Phone Number"
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={formData.phone}
                          onChange={(e) => handleTextChange("phone", e.target.value)}
                          leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                          error={errors.phone}
                        />
                      </div>

                      {/* Course */}
                      <Select
                        label="Program of Interest"
                        options={courses}
                        value={formData.course_interest}
                        onChange={(e) => handleTextChange("course_interest", e.target.value)}
                        leftIcon={<BookOpen className="w-4 h-4 text-slate-400" />}
                      />

                      {/* Message */}
                      <Textarea
                        label="Your Query"
                        placeholder="How can we help you? Please specify admission type or marks scores..."
                        value={formData.message}
                        onChange={(e) => handleTextChange("message", e.target.value)}
                        error={errors.message}
                        rows={5}
                      />

                      {/* Submit */}
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={submitting}
                        fullWidth
                        rightIcon={<Send className="w-4 h-4" />}
                      >
                        Submit Enquiry
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </Card>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-6">
              {/* Guidance Desk */}
              <Card variant="glass" className="p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <MessageSquare className="w-4.5 h-4.5 text-blue-600" /> Guidance Desk
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Our admissions office is located in the Central Administration wing. You can reach us directly:
                </p>
                <div className="space-y-3.5 pt-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="font-semibold">{COLLEGE_INFO.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="font-semibold">{COLLEGE_INFO.email}</span>
                  </div>
                </div>
              </Card>

              {/* Campus AI widget */}
              <Card variant="glass" className="p-5 bg-gradient-to-br from-blue-650 to-indigo-750 border-blue-500/35 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-blue-400/10 blur-xl pointer-events-none" />
                <div className="flex items-start gap-3 relative z-10">
                  <Bot className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-xs mb-1 uppercase tracking-wider">Admissions AI Assistant</h4>
                    <p className="text-blue-100 text-xs leading-relaxed mb-4 font-semibold">
                      Get immediate answers regarding seat intake, exam procedures, fee schedules, and student residency rules.
                    </p>
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => setAiOpen(true)}
                      className="bg-white/10 hover:bg-white/20 text-white border-white/25 hover:border-white/30 backdrop-blur-sm"
                    >
                      Start AI Chat
                    </Button>
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
