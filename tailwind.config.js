/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "icon-color": "#19b697",
      },
    },
  },
  plugins: [require("daisyui")],
};
