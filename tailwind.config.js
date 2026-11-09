/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f0d15',
        wine: '#2a1215',
        cinnabar: '#7c1d1d',
        gold: '#f59e0b',
        cream: '#fde68a',
        paper: '#f5efe6',
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Songti SC', 'STSong', 'serif'],
        sans: ['"Noto Sans SC"', 'Inter', 'PingFang SC', 'sans-serif'],
      },
      maxWidth: {
        phone: '430px',
      },
    },
  },
  plugins: [],
}
