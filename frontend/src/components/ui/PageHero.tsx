import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  badge?: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  description?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  variant?: "default" | "image" | string;
  bgImage?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export default function PageHero({
  badge,
  eyebrow,
  title,
  highlight,
  subtitle,
  description,
  breadcrumbs,
  actions,
  children
}: PageHeroProps) {
  const displayBadge = badge || eyebrow;

  return (
    <section className="relative overflow-hidden bg-slate-50 border-b border-slate-100 pt-32 pb-16 px-4 sm:px-6 md:px-8">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-[300px] h-[300px] rounded-full bg-indigo-100/40 blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-6">
        {/* Breadcrumbs row */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-text-gray/70">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  {crumb.href && !isLast ? (
                    <Link href={crumb.href} className="hover:text-primary transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-text-gray">{crumb.label}</span>
                  )}
                  {!isLast && <ChevronRight className="w-3 h-3 text-text-gray/40 shrink-0" />}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {/* Hero Content block */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-4 text-left">
            {displayBadge && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100/50">
                {displayBadge}
              </span>
            )}
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-text-dark leading-tight">
              {title} {highlight && <span className="text-primary">{highlight}</span>}
            </h1>
            {subtitle && (
              <p className="font-sans text-sm font-semibold text-primary uppercase tracking-wide">
                {subtitle}
              </p>
            )}
            {description && (
              <div className="font-sans text-sm sm:text-base leading-relaxed text-text-gray font-normal max-w-2xl">
                {description}
              </div>
            )}
          </div>

          {/* Optional Action Buttons */}
          {actions && (
            <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
              {actions}
            </div>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
