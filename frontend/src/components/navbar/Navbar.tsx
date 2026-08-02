"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  onAIClick?: () => void;
}

export default function Navbar({ onAIClick }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll position to update container shadow or background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Academics", href: "/courses" },
    { label: "Admissions", href: "/admissions" },
    { label: "Campus Life", href: "/student-life" },
    { label: "Placements", href: "/placements" },
    { label: "Research", href: "/research" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 md:px-8 py-4 transition-all duration-300">
      <div 
        className={`w-full max-w-7xl glass-navbar rounded-full px-6 md:px-8 py-3.5 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "shadow-lg shadow-slate-900/5 border-slate-200/50" : ""
        }`}
      >
        {/* Left Logo Section */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 transition-all duration-300 group-hover:scale-105">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm tracking-wide text-text-dark">
              CAMPUSCONNECT AI
            </span>
            <span className="font-sans font-medium text-[8px] tracking-wider text-text-gray/80 uppercase">
              Sri Satya Institute of Engineering & Technology
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-primary ${
                  isActive ? "text-primary font-bold" : "text-text-gray"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {onAIClick && (
            <button
              onClick={onAIClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-text-dark hover:bg-slate-50 border border-slate-200 cursor-pointer active:scale-95 transition-all duration-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              Ask AI
            </button>
          )}
          <Link href="/admissions">
            <button className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-primary to-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer active:scale-95 transition-all duration-300">
              Apply Now
            </button>
          </Link>
        </div>

        {/* Mobile Navigation Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-text-gray hover:text-text-dark focus:outline-none transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[88px] z-40 bg-white/95 backdrop-blur-md lg:hidden animate-fadeIn flex flex-col justify-between p-8 border-t border-slate-100">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-display font-semibold transition-colors ${
                    isActive ? "text-primary" : "text-text-gray"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
            {onAIClick && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAIClick();
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider text-text-dark border border-slate-200"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Ask AI Assistant
              </button>
            )}
            <Link href="/admissions" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full py-3 rounded-full text-sm font-bold uppercase tracking-wider text-white bg-primary text-center">
                Apply Now
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
