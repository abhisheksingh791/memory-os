/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#09090B",
        foreground: "#FAFAFA",
        card: {
          DEFAULT: "#18181B",
          foreground: "#FAFAFA",
          hover: "#27272A"
        },
        accent: {
          DEFAULT: "#6366F1",
          foreground: "#FFFFFF",
          hover: "#4F46E5",
          muted: "rgba(99, 102, 241, 0.15)"
        },
        success: {
          DEFAULT: "#22C55E",
          foreground: "#FFFFFF"
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#FFFFFF"
        },
        danger: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF"
        },
        muted: {
          DEFAULT: "#27272A",
          foreground: "#A1A1AA"
        }
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"]
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        'glow-lg': '0 0 50px -10px rgba(99, 102, 241, 0.5)',
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.2)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'gradient-x': 'gradientX 8s ease infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' }
        },
        gradientX: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' }
        }
      }
    },
  },
  plugins: [],
}
