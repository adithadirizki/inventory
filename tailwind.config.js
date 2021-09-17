module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      sans: ["ui-sans-serif", "system-ui"],
      serif: ["ui-serif", "Georgia"],
      mono: ["ui-monospace", "SFMono-Regular"],
      ubuntu: ["Ubuntu", "system-ui"],
      montserrat: ["Montserrat", "system-ui"],
      poppins: ["Poppins", "system-ui"],
      lato: ["Lato", "system-ui"],
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      display: ["hover", "focus"],
      cursor: ["disabled"],
      backdropFilter: ["hover"],
      backdropBrightness: ["hover"],
    },
  },
  plugins: [],
};
