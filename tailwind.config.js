/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Charte TeamHouse
        th: {
          beige: '#F0EBE0',        // fond principal
          'beige-light': '#F7F4EC',
          'beige-dark': '#E5DDCC',
          green: '#2B3A3A',        // vert forêt (texte, boutons primaires)
          'green-light': '#3E5252',
          'green-dark': '#1A2626',
          coral: '#E88060',        // corail (CTAs, highlights)
          'coral-light': '#F0A088',
          'coral-dark': '#D46648',
          cream: '#FAF7F1',
          ink: '#1F1F1F',
          muted: '#6B6B6B',
          border: '#E0D9C8',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        'th': '12px',
      },
      boxShadow: {
        'th': '0 2px 8px rgba(43, 58, 58, 0.08)',
        'th-lg': '0 8px 24px rgba(43, 58, 58, 0.12)',
      },
    },
  },
  plugins: [],
};
