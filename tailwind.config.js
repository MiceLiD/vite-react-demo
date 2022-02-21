const defaultConfig = require('tailwindcss/stubs/defaultConfig.stub')

module.exports = {
  darkMode: 'class',
  content: [
    "./client/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: defaultConfig.theme,
  plugins: [],
  extend: {
    display: ["group-hover"],
  }
}
