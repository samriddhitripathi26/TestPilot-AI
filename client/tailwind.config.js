/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dusk: {
          bg: 'var(--bg)',
          ink: 'var(--ink)',
          muted: 'var(--muted)',
          line: 'var(--line)',
          'btn-bg': 'var(--btn-bg)',
          'btn-fg': 'var(--btn-fg)',
          card: 'var(--card)',
          'card-subtle': 'var(--card-subtle)',
          accent: 'var(--accent)',
          'accent-glow': 'var(--accent-glow)'
        }
      },
      fontFamily: {
        sans: ['"Schibsted Grotesk"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"Fira Code"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'pill': '999px',
      }
    },
  },
  plugins: [],
}
