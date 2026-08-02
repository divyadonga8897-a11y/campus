"use client";

import React, { useEffect } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div onClick={onClose} />

      {/* Modal Container */}
      <div>
        {/* Header */}
        <div>
          <h3>{title || "Dialog Window"}</h3>
          <button onClick={onClose} aria-label="Close modal">
            Close
          </button>
        </div>

        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
export default Modal;
