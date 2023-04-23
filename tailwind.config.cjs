/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#166CF7",
        "secondary": "#17305C",
        "custom-gray": "#A2A2A2",
        "custom-red": "#D0454A",
      },
      fontFamily: {
        "inter": ["Inter", "sans-serif"]
      },
      boxShadow: {
        "card": "0px 0px 70px 0px hsla(0, 0%, 45%, 0.25)",
        "navbar": "0px 0px 40px 5px hsla(0, 0%, 0%, 0.4)",
        "actionbar": "0px -33px 55px 15px #FFFFFF"
      }
    },
  },
  plugins: [],
}