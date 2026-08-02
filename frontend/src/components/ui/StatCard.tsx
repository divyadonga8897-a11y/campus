import React from "react";

interface StatCardProps {
  label?: string;
  title?: string;
  value: string | number;
  icon?: any;
  description?: string;
  trend?: { value: string; isPositive: boolean };
  sparklineData?: number[];
}

export function StatCard({ label, title, value, icon, description, trend }: StatCardProps) {
  const displayLabel = label || title;

  const renderIcon = () => {
    if (!icon) return null;
    
    // Check if it's already an instantiated React element (like an SVG)
    if (React.isValidElement(icon)) {
      return (
        <div className="w-12 h-12 rounded-2xl bg-blue-50/50 flex items-center justify-center text-primary border border-blue-100/30 shrink-0">
          {icon}
        </div>
      );
    }

    // Otherwise, render it as a React Component template (e.g. Lucide icon class)
    const IconComponent = icon;
    return (
      <div className="w-12 h-12 rounded-2xl bg-blue-50/50 flex items-center justify-center text-primary border border-blue-100/30 shrink-0">
        <IconComponent className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm shadow-slate-900/5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start justify-between gap-4">
      <div className="space-y-2 text-left">
        <span className="font-display font-bold text-[10px] uppercase tracking-wider text-text-gray/80">
          {displayLabel}
        </span>
        <h3 className="font-display font-extrabold text-2xl tracking-tight text-text-dark leading-none">
          {value}
        </h3>
        
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
            <span className={trend.isPositive ? "text-green-600" : "text-amber-600"}>
              {trend.value}
            </span>
          </div>
        )}

        {description && (
          <p className="text-[10px] text-text-gray/60 font-medium font-sans">
            {description}
          </p>
        )}
      </div>

      {renderIcon()}
    </div>
  );
}

export default StatCard;
