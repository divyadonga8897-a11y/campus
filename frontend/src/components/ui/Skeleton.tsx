import React from "react";

export type SkeletonVariant = "text" | "circular" | "rectangular";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  width,
  height,
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const customStyle: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
    ...style,
  };

  return (
    <div
      className={className}
      style={customStyle}
      {...props}
    >
      Loading...
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div>
      <div>Loading card...</div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div>
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <div>Loading list item...</div>
        </div>
      ))}
    </div>
  );
}
export default Skeleton;
