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
        brand: {
          50: '#eef4ff',
          100: '#e0ecff',
          200: '#c7dafe',
          300: '#a3c2fd',
          400: '#779FF2',
          500: '#246BFD',
          600: '#1a54e5',
          700: '#1540ba',
          800: '#163696',
          900: '#182f77',
        },
        navy: {
          800: '#18213C',
          900: '#142453',
          950: '#0c1635',
        },
        dark: {
          bg: '#181A20',
          surface: '#1F222E',
          card: '#252834',
          cardHover: '#2A2E3D',
          border: '#2E3344',
          input: '#1A1D27',
          muted: '#8E94A7',
        },
        coral: {
          DEFAULT: '#F67A7A',
          hover: '#e26060',
        },
        amber: {
          DEFAULT: '#FFB524',
          hover: '#e89f13',
        },
        success: {
          DEFAULT: '#22C55E',
          hover: '#16a34a',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(36, 107, 253, 0.4)',
        'glow-sm': '0 0 15px -3px rgba(36, 107, 253, 0.3)',
        'glow-coral': '0 0 20px -4px rgba(246, 122, 122, 0.35)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.35)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
}
