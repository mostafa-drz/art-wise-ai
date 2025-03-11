/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED', // Indigo 600
          light: '#A78BFA', // Indigo 400
          dark: '#4C1D95', // Indigo 800
        },
        secondary: {
          DEFAULT: '#EC4899', // Pink 500
          light: '#F472B6', // Pink 400
          dark: '#9D174D', // Pink 700
        },
        accent: {
          success: '#10B981', // Green 500
          warning: '#F59E0B', // Amber 500
          error: '#EF4444', // Red 500
        },
        neutral: {
          light: '#F3F4F6', // Gray 100
          DEFAULT: '#374151', // Gray 700
          dark: '#111827', // Gray 900
        },
        background: '#FFFFFF', // White background
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },

      fontSize: {
        h1: ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }], // 36px
        h2: ['1.875rem', { lineHeight: '2.25rem', fontWeight: '600' }], // 30px
        h3: ['1.5rem', { lineHeight: '2rem', fontWeight: '500' }], // 24px
        body: ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }], // 16px
        small: ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }], // 14px
      },

      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
      },

      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },

      boxShadow: {
        default: '0 2px 8px rgba(0, 0, 0, 0.1)',
        hover: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },

      transitionDuration: {
        DEFAULT: '300ms',
      },

      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-up': 'scale-up 0.3s ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Enhances form styling
    require('@tailwindcss/typography'), // Improves text readability
    require('@tailwindcss/aspect-ratio'), // Maintains image/video proportions
  ],
};
