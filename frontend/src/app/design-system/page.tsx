"use client";

import React, { useState } from "react";
import {
  Trophy, Medal, Microscope, Award, Calendar, Search, Sparkles, Plus,
  Check, Info, FileText, ArrowRight, User, Mail, ShieldAlert, Laptop
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PageHero from "@/components/ui/PageHero";
import AIModal from "@/components/ui/AIModal";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select, Checkbox, Radio } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { Accordion } from "@/components/ui/Accordion";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton, SkeletonCard, SkeletonList } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { Timeline } from "@/components/ui/Timeline";
import { SearchInput } from "@/components/ui/SearchInput";

function DesignSystemShowcase() {
  const { toast } = useToast();
  const [aiOpen, setAiOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Tab State
  const [activeTab, setActiveTab] = useState("tab-1");
  const tabItems = [
    { id: "tab-1", label: "General Info", icon: <Info className="w-3.5 h-3.5" /> },
    { id: "tab-2", label: "Documentation", icon: <FileText className="w-3.5 h-3.5" /> },
    { id: "tab-3", label: "Integrations", icon: <Laptop className="w-3.5 h-3.5" /> },
  ];

  // Accordion State
  const accordionItems = [
    { id: "acc-1", title: "How do I request a scholarship?", content: "You can apply through our central portal or inquire via admissions counsellors. All details are on our scholarships page." },
    { id: "acc-2", title: "What B.Tech programs are offered?", content: "We offer CSE, Artificial Intelligence & Data Science, ECE, Civil, and Mechanical Engineering courses." },
  ];

  // Timeline State
  const timelineSteps = [
    { id: 1, title: "Online Registration", subtitle: "Step 1 of admissions", description: "Fill out application details and submit documents.", date: "Aug 1", status: "completed" as const },
    { id: 2, title: "Document Verification", subtitle: "Under review", description: "Academic board reviews grades and EAMCET ranks.", date: "Aug 10", status: "active" as const },
    { id: 3, title: "Seat Allocation", subtitle: "Final phase", description: "Allotment based on choice-filling selection.", date: "Aug 20", status: "upcoming" as const },
  ];

  // Form States
  const [formText, setFormText] = useState("");
  const [formSelect, setFormSelect] = useState("cse");
  const [formCheck, setFormCheck] = useState(false);
  const [formRadio, setFormRadio] = useState("yes");

  return (
    <>
      <Navbar onAIClick={() => setAiOpen(true)} />
      <main className="bg-slate-50 min-h-screen">
        <PageHero
          eyebrow="Design Guidelines"
          title="Component Design"
          highlight="System"
          description="Interactive, premium, and unified CSS & React components built for CampusConnect AI."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Design System" }]}
        />

        <div className="container py-12 space-y-12">
          {/* ── Typography & Colors ── */}
          <section className="card p-6 md:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Color System</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {[
                { name: "Blue Primary", hex: "#2563EB", bg: "bg-blue-600" },
                { name: "Emerald Accent", hex: "#10B981", bg: "bg-emerald-500" },
                { name: "Amber Gold", hex: "#F59E0B", bg: "bg-amber-500" },
                { name: "Red Warning", hex: "#EF4444", bg: "bg-red-600" },
                { name: "Slate Dark", hex: "#0F172A", bg: "bg-slate-900" },
                { name: "Slate Light", hex: "#F8FAFC", bg: "bg-slate-50 border border-slate-200" },
              ].map((c) => (
                <div key={c.name} className="flex flex-col gap-2 p-3 rounded-xl border border-slate-100 bg-white">
                  <div className={`w-full h-12 rounded-lg ${c.bg}`} />
                  <div className="text-[10px] font-bold text-slate-800 leading-none">{c.name}</div>
                  <div className="text-[9px] text-slate-400 font-mono leading-none">{c.hex}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Buttons ── */}
          <section className="card p-6 md:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Buttons</h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline Border</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="link">Underlined Link</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button variant="primary" size="xs">XS Size</Button>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large Hero</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button variant="primary" isLoading>Loading State</Button>
              <Button variant="secondary" leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-500" />}>Left Icon</Button>
              <Button variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>Right Icon</Button>
              <Button variant="primary" disabled>Disabled State</Button>
            </div>
          </section>

          {/* ── Inputs ── */}
          <section className="card p-6 md:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Input Forms</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              <Input
                label="Full Name"
                placeholder="Enter full name"
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="email@domain.com"
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                error="Please enter a valid academic address"
              />
              <Select
                label="Department"
                options={[
                  { value: "cse", label: "Computer Science" },
                  { value: "aids", label: "AI & Data Science" },
                  { value: "ece", label: "Electronics" },
                ]}
                value={formSelect}
                onChange={(e) => setFormSelect(e.target.value)}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5 pt-2">
              <Textarea label="Message / Notes" placeholder="Tell us more details..." />
              <div className="space-y-4 pt-2">
                <Checkbox
                  label="I agree to admission terms & conditions"
                  checked={formCheck}
                  onChange={(e) => setFormCheck(e.target.checked)}
                />
                <div className="flex gap-4">
                  <Radio
                    label="Yes, subscribe"
                    name="subscribe"
                    checked={formRadio === "yes"}
                    onChange={() => setFormRadio("yes")}
                  />
                  <Radio
                    label="No, thanks"
                    name="subscribe"
                    checked={formRadio === "no"}
                    onChange={() => setFormRadio("no")}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── Search & Displays ── */}
          <section className="grid md:grid-cols-2 gap-6">
            {/* Search */}
            <div className="card p-6 space-y-5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Search Header</h3>
              <SearchInput
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue("")}
                placeholder="Search courses, departments, events..."
              />
              {searchValue && (
                <p className="text-xs text-slate-500 mt-2">
                  Searching for: <span className="font-bold text-slate-800">"{searchValue}"</span>
                </p>
              )}
            </div>

            {/* Badges */}
            <div className="card p-6 space-y-5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Status Badges</h3>
              <div className="flex flex-wrap gap-2.5">
                <Badge variant="light" color="blue">Academic</Badge>
                <Badge variant="light" color="green">Active</Badge>
                <Badge variant="light" color="amber">Warning</Badge>
                <Badge variant="light" color="red">Expired</Badge>
                <Badge variant="light" color="slate">Draft</Badge>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <Badge variant="filled" color="blue">Filled</Badge>
                <Badge variant="filled" color="green">Success</Badge>
                <Badge variant="filled" color="amber">Alert</Badge>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <Badge variant="outline" color="blue">Outline</Badge>
                <Badge variant="outline" color="green">Clean</Badge>
                <Badge variant="outline" color="red">Critical</Badge>
              </div>
            </div>
          </section>

          {/* ── Cards & Elevation ── */}
          <section className="card p-6 md:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Cards & Elevation</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card variant="default" className="p-5">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Default Bordered</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Subtle borders and minimal shadows suitable for list grids.
                </p>
              </Card>

              <Card variant="elevated" className="p-5">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Elevated Shadows</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Smooth raised background with modern premium shadow scaling.
                </p>
              </Card>

              <Card variant="glow" className="p-5">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Accent Glow</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Soft radial shadow colored in brand blue that activates on hover.
                </p>
              </Card>

              <Card
                variant="default"
                clickable
                onClick={() => toast("Card clicked!", "success")}
                className="p-5"
              >
                <h4 className="text-xs font-bold text-slate-900 mb-1">Clickable / Hover Lift</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Lifts up slightly on cursor hover, registers tap click states.
                </p>
              </Card>
            </div>
          </section>

          {/* ── Stats & Sparklines ── */}
          <section className="card p-6 md:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Statistics</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <StatCard
                title="Placements Rate"
                value="98.5%"
                trend={{ value: "1.2% rise", isPositive: true }}
                description="Highest overall in district"
                icon={Trophy}
                sparklineData={[80, 85, 83, 90, 94, 98.5]}
              />
              <StatCard
                title="Active Internships"
                value="240+"
                trend={{ value: "45 new", isPositive: true }}
                description="Compared to last semester"
                icon={Medal}
                sparklineData={[150, 180, 170, 210, 240]}
              />
              <StatCard
                title="Campus Footprint"
                value="25 Acres"
                description="State-of-the-art facilities"
                icon={Microscope}
              />
            </div>
          </section>

          {/* ── Tabs & Accordions ── */}
          <section className="grid lg:grid-cols-2 gap-6">
            <div className="card p-6 space-y-5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Sliding Navigation Tabs</h3>
              <Tabs items={tabItems} activeId={activeTab} onChange={setActiveTab} />
              <div className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl text-xs text-slate-500">
                {activeTab === "tab-1" && <p>Content Panel 1: Overview and basic college information details.</p>}
                {activeTab === "tab-2" && <p>Content Panel 2: PDF forms, templates, syllabus sheets, and documentation resources.</p>}
                {activeTab === "tab-3" && <p>Content Panel 3: Technical API endpoints, configurations, integrations, and server parameters.</p>}
              </div>
            </div>

            <div className="card p-6 space-y-5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Accordions</h3>
              <Accordion items={accordionItems} />
            </div>
          </section>

          {/* ── Table & Dialogs ── */}
          <section className="card p-6 md:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Tables & Overlays</h2>
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Stripe-like Table */}
              <div className="lg:col-span-2 space-y-3">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold text-slate-800">B.Tech Computer Science</TableCell>
                      <TableCell>4 Years</TableCell>
                      <TableCell><Badge color="green">Active</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-slate-800">B.Tech AI & Data Science</TableCell>
                      <TableCell>4 Years</TableCell>
                      <TableCell><Badge color="green">Active</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold text-slate-800">M.Tech Software Engineering</TableCell>
                      <TableCell>2 Years</TableCell>
                      <TableCell><Badge color="slate">Suspended</Badge></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Overlays / Triggers */}
              <div className="space-y-4">
                <div className="card p-5 space-y-3.5">
                  <h4 className="text-xs font-bold text-slate-900">Toast Notifications</h4>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast("Operation completed successfully!", "success")}
                    >
                      Trigger Success Toast
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast("Failed to process transaction.", "error")}
                    >
                      Trigger Error Toast
                    </Button>
                  </div>
                </div>

                <div className="card p-5 space-y-3.5">
                  <h4 className="text-xs font-bold text-slate-900">Modal Window</h4>
                  <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
                    Open Dialog Modal
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* ── Timelines & Empty States ── */}
          <section className="grid lg:grid-cols-2 gap-6">
            <div className="card p-6 space-y-5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Milestone Timeline</h3>
              <Timeline steps={timelineSteps} />
            </div>

            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">Empty State Placeholder</h3>
                <EmptyState
                  icon={ShieldAlert}
                  title="No admission records found"
                  description="We couldn't locate any records associated with this application number. Check credentials and retry."
                  actionLabel="Back to Admissions"
                  onActionClick={() => toast("Routing back to admissions page...", "info")}
                />
              </div>
            </div>
          </section>

          {/* ── Loading Skeletons ── */}
          <section className="card p-6 md:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Shimmering Skeletons</h2>
            <div className="grid md:grid-cols-3 gap-5">
              <div className="card p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-700">Circular Skeleton</h4>
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" width={48} height={48} />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="80%" />
                  </div>
                </div>
              </div>

              <div className="card p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-700">Pre-made Card Skeleton</h4>
                <SkeletonCard />
              </div>

              <div className="card p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-700">Pre-made List Skeleton</h4>
                <SkeletonList />
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Modal View */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Scholarship Application Form"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            Please fill out all relevant forms. Review rules regarding academic requirements before submitting.
          </p>
          <Input label="Name" placeholder="Your full name" />
          <Input label="GPA score" placeholder="e.g. 9.5" />
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => {
              setModalOpen(false);
              toast("Application submitted successfully!", "success");
            }}>
              Submit Application
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
      <AIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}

export default function DesignSystemPage() {
  return (
    <ToastProvider>
      <DesignSystemShowcase />
    </ToastProvider>
  );
}
