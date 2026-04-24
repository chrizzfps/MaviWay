/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mavi: {
          blue: '#1e3a8a', // Deep blue from logo
          gold: '#d4af37', // Gold from scales
          gray: '#f3f4f6',
        }
      },
      fontFamily: {
        accentBold: ['AccentGraphicBold', 'sans-serif'],
        accentLight: ['AccentGraphicLight', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'scales': "url('/images/Gemini_Generated_Image_c1t477c1t477c1t4.png')",
        'woman': "url('/images/Gemini_Generated_Image_wcuddgwcuddgwcud.png')",
      }
    },
  },
  plugins: [],
}
