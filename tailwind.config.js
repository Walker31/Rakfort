/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // adjust if needed
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        rainbow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        absoluteMadness: {
          '0%': {
            transform: 'translateY(0) rotate(0deg) scale(1) translateX(0)',
            filter: 'hue-rotate(0deg) brightness(1)',
          },
          '25%': {
            transform: 'translateY(-25px) rotate(360deg) scale(1.5) translateX(15px)',
            filter: 'hue-rotate(180deg) brightness(1.5)',
          },
          '50%': {
            transform: 'translateY(0) rotate(720deg) scale(0.5) translateX(-15px)',
            filter: 'hue-rotate(360deg) brightness(2)',
          },
          '75%': {
            transform: 'translateY(25px) rotate(1080deg) scale(1.8) translateX(15px)',
            filter: 'hue-rotate(540deg) brightness(1.5)',
          },
          '100%': {
            transform: 'translateY(0) rotate(1440deg) scale(1) translateX(0)',
            filter: 'hue-rotate(720deg) brightness(1)',
          },
        },
        vibrate: {
          '0%, 100%': { transform: 'translate(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translate(-2px, 2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translate(2px, -2px)' },
        },
      },
      animation: {
        rainbow: 'rainbow 3s ease infinite',
        absoluteMadness: 'absoluteMadness 2s cubic-bezier(0.68,-0.55,0.265,1.55) infinite',
        vibrate: 'vibrate 0.3s linear infinite',
      },
    },
  },
  plugins: [],
};
