import { TH_INFO } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-th-border bg-th-beige-dark/30">
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-th-green/80 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          © {new Date().getFullYear()} {TH_INFO.legalName} — {TH_INFO.tagline}
        </div>
        <div className="flex gap-4">
          <a href={`mailto:${TH_INFO.email}`} className="hover:opacity-70">
            {TH_INFO.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
