import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6 text-center">
        <div className="w-16 h-16 bg-slate-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto border border-slate-100 font-mono font-bold text-lg">
          404
        </div>
        
        <div className="space-y-2">
          <h2 className="font-extrabold text-xl text-slate-900">Page Not Found</h2>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            The page you are looking for does not exist or has been relocated to another directory.
          </p>
        </div>

        <Link
          href="/"
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center justify-center shadow-md"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
