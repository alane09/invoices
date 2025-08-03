/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // COFICAB Brand Colors
        primary: {
          50: '#f0f9f7',
          100: '#dcf2ed',
          200: '#bce5db',
          300: '#8dd1c2',
          400: '#5bb5a4',
          500: '#1B6254', // Primary Green
          600: '#175549',
          700: '#14453c',
          800: '#123831',
          900: '#102f29',
        },
        secondary: {
          50: '#f4f1f8',
          100: '#ebe5f1',
          200: '#d9cee5',
          300: '#bfa8d2',
          400: '#a07bb9',
          500: '#7030A0', // Secondary Purple
          600: '#6b2a8f',
          700: '#5a2375',
          800: '#4c1e61',
          900: '#401b51',
        },
        tertiary: {
          50: '#f1f4f9',
          100: '#e4eaf3',
          200: '#cedae9',
          300: '#adc2d9',
          400: '#86a3c5',
          500: '#3656A2', // Tertiary Blue
          600: '#2f4a8f',
          700: '#283e74',
          800: '#243461',
          900: '#222e52',
        },
        accent: {
          50: '#fefbf0',
          100: '#fef7e0',
          200: '#fdecc0',
          300: '#fbdc95',
          400: '#f8c668',
          500: '#D4AF37', // Accent Gold
          600: '#c19b2e',
          700: '#a17f28',
          800: '#846626',
          900: '#6e5423',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
        neutral: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
