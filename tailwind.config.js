/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#0B1F1A',
          soft: '#3D5049',
          mute: '#6B7C75',
        },
        brand: {
          50: '#ECFDF3',
          100: '#D1FADF',
          200: '#A6F4C5',
          300: '#6CE9A6',
          400: '#32D583',
          500: '#12B76A',
          600: '#039855',
          700: '#027A48',
          800: '#05603A',
          900: '#054F31',
          950: '#032B1C',
        },
        gold: {
          100: '#FEF0C7',
          400: '#FDB022',
          500: '#F79009',
          700: '#B54708',
        },
        paper: '#F6F8F5',
        line: '#E3E8E4',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,31,26,0.04), 0 4px 16px rgba(11,31,26,0.05)',
        pop: '0 10px 40px rgba(11,31,26,0.12)',
      },
    },
  },
  plugins: [],
};
