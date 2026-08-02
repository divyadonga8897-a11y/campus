import React from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  highlight,
  description,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={className}>
      {eyebrow && <span>{eyebrow}</span>}
      <h2>
        {title} {highlight && <span>{highlight}</span>}
      </h2>
      {description && <p>{description}</p>}
    </div>
  );
}
