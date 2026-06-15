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
        navy: '#0D2137',
        'navy-light': '#1A3A5C',
        accent: '#1D9E75',
        'accent-light': '#E1F5EE',
        amber: '#BA7517',
        'amber-light': '#FAEEDA',
        danger: '#A32D2D',
        'danger-light': '#FCEBEB',
        surface: '#F5F7FA',
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
