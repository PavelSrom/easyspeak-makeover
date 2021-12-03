module.exports = {
  purge: [
    './components/**/*.{js,ts,jsx,tsx}',
    './contexts/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './ui/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#004662',
        secondary: '#F0802B',
        tertiary: '#009FB2',
        error: '#EF5350',
        'page-bg': '#F0F0F0',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
