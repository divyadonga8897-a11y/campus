import React from "react";

export interface TimelineStep {
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  date?: string;
  icon?: React.ReactNode;
  status?: "completed" | "active" | "upcoming";
}

export interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function Timeline({ steps, className = "" }: TimelineProps) {
  return (
    <div className={className}>
      {steps.map((step, i) => (
        <div key={step.id}>
          <div>
            <span>{step.icon || i + 1}</span>
          </div>
          <div>
            <div>
              <h3>{step.title}</h3>
              {step.subtitle && <span>{step.subtitle}</span>}
            </div>
            {step.date && <span>{step.date}</span>}
            {step.description && <p>{step.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
export default Timeline;
