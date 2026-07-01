/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FBF7E8',
          100: '#F6EFCB',
          200: '#EEDF96',
          300: '#E5CE61',
          400: '#DCBE3E',
          500: '#D4AF37',
          600: '#AE8C24',
          700: '#83691B',
          800: '#574611',
          900: '#2C2308',
        },
        ink: {
          DEFAULT: '#0B0B0B',
          soft: '#111111',
          card: '#161616',
          line: '#1f1f1f',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 10px 40px -10px rgba(212, 175, 55, 0.45)',
        'gold-lg': '0 25px 60px -15px rgba(212, 175, 55, 0.55)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F6EFCB 0%, #D4AF37 45%, #AE8C24 100%)',
        'ink-radial': 'radial-gradient(circle at 30% 20%, rgba(212,175,55,0.18), transparent 45%), radial-gradient(circle at 80% 80%, rgba(212,175,55,0.10), transparent 40%)',
        'hero-veil': 'linear-gradient(180deg, rgba(11,11,11,0) 0%, rgba(11,11,11,0.6) 70%, rgba(11,11,11,1) 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '80%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'fade-up': 'fade-up 0.8s ease forwards',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionTimingFunction: {
        lux: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
