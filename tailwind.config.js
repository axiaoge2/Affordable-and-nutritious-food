/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 苹果风格配色
        apple: {
          gray: {
            50: '#f5f5f7',
            100: '#e8e8ed',
            200: '#d2d2d7',
            300: '#b7b7bd',
            400: '#86868b',
            500: '#6e6e73',
            600: '#515154',
            700: '#424245',
            800: '#1d1d1f',
          },
          blue: '#0071e3',
          green: '#30d158',
          orange: '#ff9f0a',
          red: '#ff3b30',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'apple': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
        'apple-lg': '0 10px 25px rgba(0, 0, 0, 0.1), 0 6px 10px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'apple': '18px',
      },
    },
  },
  plugins: [],
}
