/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      /* ============ CUSTOM COLORS - MIDNIGHT TEAL FINTECH THEME ============ */
      colors: {
        // Background & Surfaces
        bg: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f1117",
          950: "#0B0F14", // Main background
        },
        // Sidebar
        sidebar: {
          50: "#f8fafc",
          900: "#111827",
          950: "#0d1419",
        },
        // Cards
        card: {
          50: "#f8fafc",
          100: "#f1f5f9",
          900: "#151A21",
          950: "#0f1319",
        },
        // Primary Teal Accent
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14B8A6", // Primary
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        // Secondary Green Accent
        lime: {
          50: "#f7fee7",
          100: "#ecfdf5",
          200: "#dcfce7",
          300: "#bbf7d0",
          400: "#86efac",
          500: "#22C55E", // Secondary
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#145231",
        },
        // Danger/Alert Red
        red: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#EF4444", // Alert
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        // Text Colors
        text: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#E5E7EB", // Primary (light)
          300: "#d1d5db",
          400: "#9CA3AF", // Secondary (medium)
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },

      /* ============ CUSTOM SHADOWS - FINTECH CLEAN ============ */
      boxShadow: {
        // Subtle professional shadows
        "xs": "0 1px 2px rgba(0, 0, 0, 0.05)",
        "sm": "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "soft": "0 4px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.08)",
        "md": "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
        "lg": "0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
        
        // Fintech accent glows (subtle)
        "teal-glow": "0 0 20px rgba(20, 184, 166, 0.3), 0 0 40px rgba(20, 184, 166, 0.1)",
        "teal-glow-hover": "0 0 30px rgba(20, 184, 166, 0.4), 0 0 60px rgba(20, 184, 166, 0.2)",
        "green-glow": "0 0 15px rgba(34, 197, 94, 0.25)",
        
        // Card shadows
        "card": "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
        "card-hover": "0 10px 20px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.15)",
        
        // Glass/blur effect
        "glass": "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.02)",
      },

      /* ============ CUSTOM ANIMATIONS - SMOOTH FINTECH ============ */
      animation: {
        // Framer Motion compatible
        "slide-in-up": "slideInUp 0.6s ease-out",
        "slide-in-down": "slideInDown 0.6s ease-out",
        "slide-in-left": "slideInLeft 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        "fade-in": "fadeIn 0.6s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
        "scale-pop": "scalePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "gradient-shift": "gradientShift 6s ease infinite",
        // Fintech smooth animations
        "subtle-glow": "subtleGlow 3s ease-in-out infinite",
        "hover-lift": "hoverLift 0.3s ease-out",
        "border-shimmer": "borderShimmer 3s ease infinite",
      },

      /* ============ KEYFRAMES - SMOOTH FINTECH ============ */
      keyframes: {
        slideInUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInDown: {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(20, 184, 166, 0.7)" },
          "50%": { boxShadow: "0 0 0 10px rgba(20, 184, 166, 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        scalePop: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { filter: "drop-shadow(0 0 0px rgba(20, 184, 166, 0.5))" },
          "50%": { filter: "drop-shadow(0 0 10px rgba(20, 184, 166, 0.8))" },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        // Fintech smooth animations
        subtleGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.95" },
        },
        hoverLift: {
          "0%": { transform: "translateY(0) scale(1)" },
          "100%": { transform: "translateY(-4px) scale(1.01)" },
        },
        borderShimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },

      /* ============ BACKDROP BLUR ============ */
      backdropBlur: {
        xs: "2px",
      },

      /* ============ FONT FAMILY ============ */
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      /* ============ SPACING ============ */
      spacing: {
        128: "32rem",
        144: "36rem",
      },

      /* ============ BORDER RADIUS ============ */
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      /* ============ OPACITY ============ */
      opacity: {
        2.5: "0.025",
        7.5: "0.075",
        15: "0.15",
      },
    },
  },
  plugins: [
    /* ============ CUSTOM COMPONENTS - PREMIUM AI AESTHETIC ============ */
    function ({ addComponents, theme }) {
      addComponents({
        /* ===== CARDS - DARK/LIGHT MODE SUPPORT ===== */
        /* Fintech Card - Teal Glass */
        ".card-ai": {
          "@apply bg-white/80 dark:bg-card-900/60 backdrop-blur-xl border border-teal-200 dark:border-teal-500/30 rounded-2xl px-5 py-6 sm:px-6 sm:py-7 lg:px-8 transition-all duration-300 shadow-sm dark:shadow-card hover:shadow-md dark:hover:shadow-card-hover hover:border-teal-300 dark:hover:border-teal-400/70":
            {},
        },

        /* Fintech Card - Lime Variant */
        ".card-ai-gold": {
          "@apply bg-white/80 dark:bg-card-900/60 backdrop-blur-xl border border-lime-200 dark:border-lime-500/30 rounded-2xl px-5 py-6 sm:px-6 sm:py-7 lg:px-8 transition-all duration-300 shadow-sm dark:shadow-card hover:shadow-md dark:hover:shadow-card-hover hover:border-lime-300 dark:hover:border-lime-400/70":
            {},
        },

        /* Fintech Card - Green Variant */
        ".card-ai-fuchsia": {
          "@apply bg-white/80 dark:bg-card-900/60 backdrop-blur-xl border border-lime-200 dark:border-lime-500/30 rounded-2xl px-5 py-6 sm:px-6 sm:py-7 lg:px-8 transition-all duration-300 shadow-sm dark:shadow-card hover:shadow-md dark:hover:shadow-card-hover hover:border-lime-300 dark:hover:border-lime-400/70 animate-subtleGlow":
            {},
        },

        /* ===== BUTTONS - DARK/LIGHT MODE SUPPORT ===== */
        /* Fintech Button - Teal Lime Gradient */
        ".btn-ai": {
          "@apply px-5 sm:px-6 py-2.5 sm:py-3 font-bold rounded-lg bg-gradient-to-r from-teal-600 to-lime-500 dark:from-teal-500 dark:to-lime-400 text-white dark:text-bg-950 shadow-teal-glow hover:shadow-teal-glow-hover transition-all duration-300 hover:-translate-y-1 active:scale-95 animate-subtleGlow":
            {},
        },

        /* Fintech Button - Lime */
        ".btn-ai-pink": {
          "@apply px-5 sm:px-6 py-2.5 sm:py-3 font-bold rounded-lg bg-gradient-to-r from-lime-600 to-lime-500 dark:from-lime-500 dark:to-lime-400 text-white dark:text-bg-950 shadow-lg shadow-lime-500/30 hover:shadow-lg hover:shadow-lime-500/50 transition-all duration-300 hover:-translate-y-1 active:scale-95":
            {},
        },

        /* ===== HERO & SECTIONS - DARK/LIGHT MODE ===== */
        /* Hero Section - Fintech Gradient */
        ".hero-ai": {
          "@apply min-h-96 bg-gradient-to-br from-teal-50 via-lime-50 to-teal-50 dark:from-teal-500/10 dark:via-lime-500/5 dark:to-teal-500/10 rounded-3xl overflow-hidden relative border border-teal-200 dark:border-teal-500/20 shadow-sm dark:shadow-card animate-subtleGlow px-6 py-8 md:px-8 md:py-10 lg:px-10":
            {},
        },

        /* Glass Background - Fintech */
        ".glass-ai": {
          "@apply bg-white/60 dark:bg-bg-950/30 backdrop-blur-xl border border-teal-200 dark:border-teal-500/20 rounded-2xl shadow-sm dark:shadow-card hover:shadow-md dark:hover:shadow-card-hover animate-subtleGlow px-6 py-6 md:px-8 md:py-8":
            {},
        },

        /* ===== BADGES & LABELS - DARK/LIGHT MODE ===== */
        /* Fintech Badge - Teal Glow */
        ".badge-ai": {
          "@apply inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-teal-100 dark:bg-teal-500/20 border border-teal-300 dark:border-teal-500/40 text-teal-700 dark:text-teal-300 text-xs sm:text-sm font-bold shadow-sm dark:shadow-teal-glow animate-subtleGlow":
            {},
        },

        /* ===== STATS & METRICS - DARK/LIGHT MODE ===== */
        /* Stat Display - Fintech */
        ".stat-ai": {
          "@apply flex flex-col items-start p-4 sm:p-5 md:p-6 rounded-lg bg-lime-50/50 dark:bg-lime-500/10 border-l-4 border-lime-400 dark:border-lime-400 shadow-sm dark:shadow-card hover:shadow-md dark:hover:shadow-card-hover transition-all animate-hoverLift":
            {},
        },

        /* ===== RESPONSIVE GRID ===== */
        /* Responsive Grid */
        ".grid-ai": {
          "@apply grid gap-4 sm:gap-5 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4":
            {},
        },

        /* ===== LAYOUT COMPONENTS - DARK/LIGHT MODE ===== */
        /* Sidebar - Fintech Glass */
        ".sidebar-ai": {
          "@apply bg-gradient-to-b from-white/50 to-gray-50/50 dark:from-bg-950/40 dark:to-sidebar-900/60 backdrop-blur-md border-r border-gray-200 dark:border-teal-500/15 shadow-sm dark:shadow-sm px-4 sm:px-5 md:px-6 py-6 md:py-8":
            {},
        },

        /* Top Bar - Fintech Glass */
        ".topbar-ai": {
          "@apply bg-gradient-to-r from-white/40 via-teal-50/20 to-white/40 dark:from-bg-950/30 dark:via-teal-500/5 dark:to-bg-950/30 backdrop-blur-md border-b border-gray-200 dark:border-teal-500/15 shadow-sm dark:shadow-sm px-6 py-3 sm:px-8 sm:py-4 md:py-5":
            {},
        },

        /* ===== TEXT & EFFECTS - DARK/LIGHT MODE ===== */
        /* Text Gradient - Fintech */
        ".text-gradient-ai": {
          "@apply bg-gradient-to-r from-teal-600 via-lime-600 to-teal-600 dark:from-teal-400 dark:via-lime-400 dark:to-teal-400 bg-clip-text text-transparent animate-subtleGlow":
            {},
        },

        /* Smooth Transition */
        ".transition-ai": {
          "@apply transition-all duration-300 ease-out":
            {},
        },

        /* Holographic Layer - Fintech */
        ".holographic": {
          "@apply relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-teal-100/20 before:via-lime-100/20 before:to-teal-100/20 dark:before:from-teal-500/10 dark:before:via-lime-500/5 dark:before:to-teal-500/10 before:mix-blend-overlay before:animate-subtleGlow before:rounded-inherited":
            {},
        },
      });
    },
  ],
};


