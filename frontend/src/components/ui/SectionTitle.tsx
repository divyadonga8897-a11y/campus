import React from "react";
import SectionHeader from "./SectionHeader";

interface SectionTitleProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionTitle({
  badge,
  title,
  highlight,
  description,
  align = "center",
  className = "",
}: SectionTitleProps) {
  return (
    <SectionHeader
      eyebrow={badge}
      title={title}
      highlight={highlight}
      description={description}
      align={align}
      className={className}
    />
  );
}
