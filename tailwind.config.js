// tailwind.config.js
module.exports = {
  content: ["/home/y_z_spam/yuexin.z.github.io/src/**/*.{html,js}"],
  theme: {
    extend: {}
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: ["bumblebee", "dark", "cyberpunk"]
  }
};