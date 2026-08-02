import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | string;
  size?: "sm" | "md" | "lg" | string;
  loading?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, isLoading, leftIcon, rightIcon, variant = "primary", size = "md", fullWidth = false, className = "", ...props }, ref) => {
    const isBtnLoading = loading || isLoading;

    // Build the variant-specific classes
    let variantClasses = "";
    switch (variant) {
      case "primary":
        variantClasses = "bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/20 border border-transparent";
        break;
      case "secondary":
        variantClasses = "bg-white text-text-dark border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm";
        break;
      case "outline":
        variantClasses = "bg-transparent text-text-dark border border-slate-300 hover:bg-slate-50";
        break;
      case "ghost":
        variantClasses = "bg-transparent text-text-gray hover:bg-slate-100 hover:text-text-dark border border-transparent";
        break;
      default:
        variantClasses = "bg-primary text-white hover:bg-primary-hover";
    }

    // Size-specific padding and text sizes
    let sizeClasses = "";
    switch (size) {
      case "sm":
        sizeClasses = "px-4 py-2 text-[10px]";
        break;
      case "lg":
        sizeClasses = "px-8 py-3.5 text-xs";
        break;
      case "md":
      default:
        sizeClasses = "px-6 py-2.5 text-[11px]";
    }

    return (
      <button
        ref={ref}
        disabled={isBtnLoading || props.disabled}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-display font-bold uppercase tracking-wider active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variantClasses} ${sizeClasses} ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {isBtnLoading && (
          <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!isBtnLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isBtnLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
