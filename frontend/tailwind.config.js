/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/components/**/*.{vue,js,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/app.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0a0e1a",
        secondary: "#111827",
        card: {
          DEFAULT: "#1a2235",
          hover: "#1f2a40",
        },
        glass: "rgba(26, 34, 53, 0.65)",
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          muted: "#64748b",
        },
        border: {
          DEFAULT: "rgba(148, 163, 184, 0.08)",
          accent: "rgba(148, 163, 184, 0.15)",
        },
        solar: {
          DEFAULT: "#f59e0b",
          glow: "rgba(245, 158, 11, 0.25)",
        },
        battery: {
          DEFAULT: "#10b981",
          glow: "rgba(16, 185, 129, 0.25)",
        },
        grid: {
          DEFAULT: "#6366f1",
          glow: "rgba(99, 102, 241, 0.25)",
        },
        load: {
          DEFAULT: "#f43f5e",
          glow: "rgba(244, 63, 94, 0.25)",
        },
        info: {
          DEFAULT: "#38bdf8",
          glow: "rgba(56, 189, 248, 0.25)",
        },
        warning: "#fb923c",
        success: "#34d399",
        danger: "#f87171",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25)",
        glow: "0 0 30px rgba(245,158,11,0.08)",
      },
      animation: {
        fadeInUp: "fadeInUp 0.5s ease both",
        shimmer: "shimmer 2.5s linear infinite",
        'spin-slow': "spin 12s linear infinite",
        'pulse-glow': "pulse-glow 2s ease-in-out infinite",
        'pulse-icon': "pulse-icon 2s infinite ease-in-out",
        'flicker-icon': "flicker-icon 1.5s infinite ease-in-out",
        'pulse-card-solar': "pulse-card-solar 3s infinite ease-in-out",
        'pulse-card-battery': "pulse-card-battery 3s infinite ease-in-out",
        'pulse-card-grid': "pulse-card-grid 3s infinite ease-in-out",
        'pulse-card-load': "pulse-card-load 3s infinite ease-in-out",
        'flow': "flow 4s linear infinite",
        'pulse-solar-node': "pulse-solar-node 2.5s infinite ease-in-out",
        'pulse-battery-node': "pulse-battery-node 2.5s infinite ease-in-out",
        'pulse-grid-node': "pulse-grid-node 2.5s infinite ease-in-out",
        'pulse-load-node': "pulse-load-node 2.5s infinite ease-in-out",
        'pulse-ring': "pulse-ring 2s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(52, 211, 153, 0.15)' },
          '50%': { boxShadow: '0 0 30px rgba(52, 211, 153, 0.3)' },
        },
        'pulse-icon': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6', filter: 'drop-shadow(0 0 2px currentColor)' },
          '50%': { transform: 'scale(1.15)', opacity: '1', filter: 'drop-shadow(0 0 10px currentColor)' },
        },
        'flicker-icon': {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 2px currentColor)' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 12px currentColor)' },
          '70%': { opacity: '0.8', filter: 'drop-shadow(0 0 6px currentColor)' },
        },
        'pulse-card-solar': {
          '0%, 100%': { borderColor: 'rgba(148, 163, 184, 0.08)' },
          '50%': { borderColor: 'rgba(245, 158, 11, 0.4)' },
        },
        'pulse-card-battery': {
          '0%, 100%': { borderColor: 'rgba(148, 163, 184, 0.08)' },
          '50%': { borderColor: 'rgba(16, 185, 129, 0.4)' },
        },
        'pulse-card-grid': {
          '0%, 100%': { borderColor: 'rgba(148, 163, 184, 0.08)' },
          '50%': { borderColor: 'rgba(99, 102, 241, 0.4)' },
        },
        'pulse-card-load': {
          '0%, 100%': { borderColor: 'rgba(148, 163, 184, 0.08)' },
          '50%': { borderColor: 'rgba(244, 63, 94, 0.4)' },
        },
        'flow': {
          'from': { strokeDashoffset: '48' },
          'to': { strokeDashoffset: '0' },
        },
        'pulse-solar-node': {
          '0%, 100%': { boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25), 0 0 4px rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.2)' },
          '50%': { boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25), 0 0 15px rgba(245, 158, 11, 0.45)', borderColor: 'rgba(245, 158, 11, 0.6)' },
        },
        'pulse-battery-node': {
          '0%, 100%': { boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25), 0 0 4px rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.2)' },
          '50%': { boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25), 0 0 15px rgba(16, 185, 129, 0.45)', borderColor: 'rgba(16, 185, 129, 0.6)' },
        },
        'pulse-grid-node': {
          '0%, 100%': { boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25), 0 0 4px rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.2)' },
          '50%': { boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25), 0 0 15px rgba(99, 102, 241, 0.45)', borderColor: 'rgba(99, 102, 241, 0.6)' },
        },
        'pulse-load-node': {
          '0%, 100%': { boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25), 0 0 4px rgba(244, 63, 94, 0.15)', borderColor: 'rgba(244, 63, 94, 0.2)' },
          '50%': { boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25), 0 0 15px rgba(244, 63, 94, 0.45)', borderColor: 'rgba(244, 63, 94, 0.6)' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}
