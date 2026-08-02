"use client";
import React from "react";

// ── TEXT INPUT ──
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, id, type = "text", className = "", ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label htmlFor={inputId} className="font-display font-semibold text-[10px] uppercase tracking-wider text-text-gray">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <span className="absolute left-3.5 flex items-center justify-center text-text-gray/60 shrink-0 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`w-full px-4 py-2.5 rounded-xl border text-[11px] font-sans placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 ${
              error ? "border-red-300 focus:ring-red-100 focus:border-red-500" : "border-slate-200 focus:border-primary"
            } ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""} ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 flex items-center justify-center text-text-gray/60 shrink-0 pointer-events-none">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
        {!error && helperText && <p className="text-[10px] text-text-gray/70">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// ── SELECT ──
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, id, leftIcon, rightIcon, className = "", ...props }, ref) => {
    const selectId = id || React.useId();
    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label htmlFor={selectId} className="font-display font-semibold text-[10px] uppercase tracking-wider text-text-gray">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <span className="absolute left-3.5 flex items-center justify-center text-text-gray/60 shrink-0 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <select
            ref={ref}
            id={selectId}
            className={`w-full px-4 py-2.5 rounded-xl border text-[11px] font-sans bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 appearance-none ${
              error ? "border-red-300 focus:ring-red-100" : "border-slate-200"
            } ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""} ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className="absolute right-3.5 flex items-center justify-center pointer-events-none text-text-gray/60">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
        {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

// ── TEXTAREA ──
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, id, className = "", ...props }, ref) => {
    const textareaId = id || React.useId();
    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label htmlFor={textareaId} className="font-display font-semibold text-[10px] uppercase tracking-wider text-text-gray">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`w-full px-4 py-2.5 rounded-xl border text-[11px] font-sans placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 min-h-[100px] ${
            error ? "border-red-300 focus:ring-red-100 focus:border-red-500" : "border-slate-200 focus:border-primary"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
        {!error && helperText && <p className="text-[10px] text-text-gray/70">{helperText}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

// ── CHECKBOX ──
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const checkboxId = id || React.useId();
    return (
      <div className="flex flex-col gap-1 w-full text-left">
        <label htmlFor={checkboxId} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={`w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-2 transition-all ${className}`}
            {...props}
          />
          <span className="text-[11px] font-sans text-text-gray font-medium">{label}</span>
        </label>
        {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

// ── RADIO ──
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const radioId = id || React.useId();
    return (
      <div className="flex flex-col gap-1 w-full text-left">
        <label htmlFor={radioId} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            className={`w-4 h-4 border-slate-300 text-primary focus:ring-primary focus:ring-offset-2 transition-all ${className}`}
            {...props}
          />
          <span className="text-[11px] font-sans text-text-gray font-medium">{label}</span>
        </label>
        {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);
Radio.displayName = "Radio";
