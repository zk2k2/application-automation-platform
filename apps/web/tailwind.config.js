// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeInCenter: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        fadeInLeft: {
          "0%": { opacity: 0, transform: "translateX(-20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        fadeInCenter: "fadeInCenter 0.6s ease forwards",
        fadeInLeft: "fadeInLeft 0.8s ease forwards",
      },
    },
  },
  // other config...
};
