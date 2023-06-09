/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "xs" : "375px",
        "2xs": "320px",
      },
      colors: {
        "primary"          : "#166CF7",
        "secondary"        : "#0e215c",
        "custom-light-blue": "#ECF3FD",
        "custom-gray"      : "#A2A2A2",
        "custom-light-gray": "#FAFAFA",
        "custom-red"       : "#D0454A",
        "custom-red-alert" : "#DB2121",
        "custom-green"     : "#69AF31"
      },
      fontFamily: {
        "inter": ["Inter", "sans-serif"]
      },
      boxShadow: {
        "card"     : "0px 0px 70px 0px hsla(0, 0%, 45%, 0.25)",
        "navbar"   : "0px 0px 44px 20px rgba(0,0,0,0.1)",
        "modal"    : "0px 20px 140px 67px rgba(0, 0, 0, 0.19)",
        "eventCard": "0px -33px 55px 15px #FFFFFF",
        "button"   : "0px 10px 40px -5px rgba(22, 108, 247, 0.5)"
      }
    },
  },
  plugins: [],
}