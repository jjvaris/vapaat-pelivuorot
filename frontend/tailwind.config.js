const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

const screens = { xs: '520px', ...defaultTheme.screens };

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens,
    extend: {
      colors: {
        cyan: colors.cyan,
        sky: colors.sky,
        violet: colors.violet,
        purple: colors.purple,
        fuchsia: colors.fuchsia,
        pink: colors.pink,
        rose: colors.rose,
        primary: { DEFAULT: colors.indigo['600'], ...colors.indigo },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
