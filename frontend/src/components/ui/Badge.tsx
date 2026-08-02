import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "light" | "outline" | string;
  className?: string;
  color?: "blue" | "green" | "amber" | "red" | "gray" | string;
}

export function Badge({ children, variant = "light", className = "", color = "gray" }: BadgeProps) {
  let colorClasses = "";
  
  switch (color) {
    case "blue":
      colorClasses = "bg-blue-50 text-blue-700 border-blue-100/50";
      break;
    case "green":
      colorClasses = "bg-green-50 text-green-700 border-green-100/50";
      break;
    case "amber":
      colorClasses = "bg-amber-50 text-amber-700 border-amber-100/50";
      break;
    case "red":
      colorClasses = "bg-red-50 text-red-700 border-red-100/50";
      break;
    case "gray":
    default:
      colorClasses = "bg-slate-100 text-slate-700 border-slate-200/50";
  }

  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border";
  
  return (
    <span className={`${baseClasses} ${colorClasses} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
