import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-th-border bg-th-beige/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-th-green flex items-center justify-center text-th-beige font-serif font-bold">
            T
          </span>
          <span className="font-serif text-xl text-th-green tracking-tight">
            TeamHouse
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-th-green">
          <Link href="/" className="hover:opacity-70">Accueil</Link>
          <Link href="/brief" className="btn-coral py-2 px-4 text-sm">
            Démarrer un projet
          </Link>
        </nav>
      </div>
    </header>
  );
}
