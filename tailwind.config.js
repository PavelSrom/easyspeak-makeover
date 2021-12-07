module.exports = {
  purge: [
    './components/**/*.{js,ts,jsx,tsx}',
    './contexts/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './ui/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily:{
      'sans': ['Roboto', 'ui-sans-serif'],
      'body': ['Nunito', 'ui-sans-serif'],
    },
    extend: {
      colors: {
        primary: '#004662',
        secondary: '#F0802B',
        tertiary: '#009FB2',
        lightBlue: '#F0FAFB',
        darkGrey: '#515151',
        inactiveGrey: '#757575',
        lightGrey: '#E5E5E5',
        error: '#EF5350',
        sucsess: '#4CAF50',
        'page-bg': '#F0F0F0',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
