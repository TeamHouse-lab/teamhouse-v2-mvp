'use client';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm">
        <p>&copy; {year} TeamHouse. All rights reserved.</p>
      </div>
    </footer>
  );
}
