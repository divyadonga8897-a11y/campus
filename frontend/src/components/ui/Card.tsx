import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "glass" | "gradient" | string;
  hoverEffect?: boolean;
  border?: boolean;
  clickable?: boolean;
}

export function Card({ children, className = "", onClick, variant = "default", hoverEffect = true, border = true, clickable = false }: CardProps) {
  const isClickable = clickable || !!onClick;

  const baseClasses = "premium-card rounded-2xl overflow-hidden bg-white";
  const borderClasses = border ? "border border-slate-100/80" : "border-none";
  const shadowClasses = "shadow-sm shadow-slate-900/5";
  const hoverClasses = hoverEffect ? "hover:-translate-y-1.5 hover:shadow-lg hover:shadow-slate-900/5 transition-all duration-300" : "";
  const cursorClasses = isClickable ? "cursor-pointer active:scale-[0.99]" : "";

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${borderClasses} ${shadowClasses} ${hoverClasses} ${cursorClasses} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 pt-6 pb-2 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 pt-2 pb-6 ${className}`}>{children}</div>;
}

export default Card;
