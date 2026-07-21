import BriefWizard from '@/components/BriefWizard/BriefWizard';

export const metadata = {
  title: 'Nouveau brief · TeamHouse',
};

export default function BriefPage() {
  return (
    <div className="bg-th-beige min-h-[calc(100vh-160px)] py-6">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-4 text-center">
          <p className="text-xs uppercase tracking-wider text-th-coral">
            Étape par étape · 5 minutes
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-th-green">
            Racontez-nous votre projet
          </h1>
        </div>
      </div>
      <BriefWizard />
    </div>
  );
}
