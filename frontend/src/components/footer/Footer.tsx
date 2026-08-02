import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    academics: [
      { label: "Engineering Programs", href: "/courses" },
      { label: "Department Directories", href: "/departments" },
      { label: "Achievements Portfolio", href: "/achievements" },
      { label: "Research Publications", href: "/research" },
    ],
    admissions: [
      { label: "Enrollment Info", href: "/admissions" },
      { label: "Fee Configurations", href: "/fees" },
      { label: "Scholarship Schemes", href: "/scholarships" },
      { label: "Contact Inbox", href: "/enquiry" },
    ],
    campus: [
      { label: "Hostels & Dining", href: "/hostel" },
      { label: "Campus Architecture Tour", href: "/campus" },
      { label: "Student Development", href: "/student-life" },
      { label: "Library Resources", href: "/library" },
    ],
    governance: [
      { label: "College Overview", href: "/about" },
      { label: "Institute Leadership", href: "/leadership" },
      { label: "Career & Placements", href: "/placements" },
      { label: "Central Administration", href: "/admin/login" },
    ],
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Top Grid: Logo + 4 link columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12 border-b border-slate-800">
          
          {/* Logo Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm tracking-wide text-white">
                  CAMPUSCONNECT AI
                </span>
                <span className="font-sans font-medium text-[8px] tracking-wider text-slate-500 uppercase">
                  Sri Satya Institute of Engineering & Technology
                </span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 max-w-sm">
              Empowering engineers of tomorrow through AI-guided admissions, robust academic curriculums, and premier campus infrastructure since 1998.
            </p>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>SSIET Campus, Punjab, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>+91 172 2500 120</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>admissions@ssiet.ac.in</span>
              </div>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Academics</h4>
            <ul className="space-y-2.5 text-xs">
              {links.academics.map((lnk) => (
                <li key={lnk.label}>
                  <Link href={lnk.href} className="hover:text-blue-500 transition-colors">
                    {lnk.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Admissions</h4>
            <ul className="space-y-2.5 text-xs">
              {links.admissions.map((lnk) => (
                <li key={lnk.label}>
                  <Link href={lnk.href} className="hover:text-blue-500 transition-colors">
                    {lnk.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Campus Life</h4>
            <ul className="space-y-2.5 text-xs">
              {links.campus.map((lnk) => (
                <li key={lnk.label}>
                  <Link href={lnk.href} className="hover:text-blue-500 transition-colors">
                    {lnk.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Governance</h4>
            <ul className="space-y-2.5 text-xs">
              {links.governance.map((lnk) => (
                <li key={lnk.label}>
                  <Link href={lnk.href} className="hover:text-blue-500 transition-colors">
                    {lnk.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyrights & Info */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-600">
          <p>© {currentYear} Sri Satya Institute of Engineering & Technology. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-slate-500 transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-500 transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-slate-500 transition-colors">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
