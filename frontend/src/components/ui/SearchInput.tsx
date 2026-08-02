"use client";

import React, { useRef, useEffect } from "react";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  showShortcut?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  showShortcut = true,
  placeholder = "Search...",
  className = "",
  ...props
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (document.activeElement !== inputRef.current) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      <div>
        {hasValue && onClear && (
          <button
            onClick={() => {
              onClear();
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
        {showShortcut && !hasValue && <kbd>/</kbd>}
      </div>
    </div>
  );
}
export default SearchInput;
