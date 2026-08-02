import React from "react";

export interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onActionClick,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={className}>
      {Icon && <span>Icon</span>}
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && onActionClick && (
        <button onClick={onActionClick}>{actionLabel}</button>
      )}
    </div>
  );
}
export default EmptyState;
