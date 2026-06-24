/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        deep: '#0057ff',
        electric: '#00a3ff',
        navy: '#00102e',
        ink: '#0a1228',
        paper: '#f5f8ff',
      },
      fontFamily: {
        display: ['var(--display)'],
        body: ['var(--body)'],
        mono: ['var(--mono)'],
      },
      borderRadius: {
        'radius': '18px',
        'radius-sm': '12px',
      },
      keyframes: {
        spin: {
          'to': { transform: 'rotate(360deg)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        happy: {
          '0%': { transform: 'scale(1) rotate(0)' },
          '30%': { transform: 'scale(1.18) rotate(-8deg)' },
          '60%': { transform: 'scale(1.1) rotate(8deg)' },
          '100%': { transform: 'scale(1) rotate(0)' },
        },
        blink: {
          '0%, 80%, 100%': { opacity: '0.25' },
          '40%': { opacity: '1' },
        },
      },
      animation: {
        spin: 'spin 26s linear infinite',
        'spin-reverse': 'spin 18s linear infinite reverse',
        'spin-slow': 'spin 34s linear infinite',
        floaty: 'floaty 3.2s ease-in-out infinite',
        happy: 'happy 0.6s ease',
        blink: 'blink 1.2s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}
