"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uncaught app-level error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h2 className="font-extrabold text-xl text-slate-900">Something went wrong!</h2>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            An unexpected application error occurred. The CampusConnect servers might be undergoing maintenance.
          </p>
        </div>

        {error.message && (
          <div className="bg-red-50/50 border border-red-100/50 p-3.5 rounded-xl text-left">
            <span className="text-[10px] font-bold text-red-600 uppercase block tracking-wider">Error Details</span>
            <p className="text-xs font-mono text-red-700 font-bold break-words">{error.message}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition-all inline-flex items-center justify-center"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
