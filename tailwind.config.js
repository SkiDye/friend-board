/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 노션 스타일 컬러
        notion: {
          gray: {
            50: '#F7F6F3',
            100: '#EBEAE6',
            200: '#D3D1CB',
            300: '#B8B7B0',
            400: '#9B9A97',
            500: '#7C7B78',
            600: '#5E5D5A',
            700: '#3F3E3B',
            800: '#211F1C',
            900: '#191919',
          },
          text: '#37352F',
        }
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Helvetica',
          '"Apple Color Emoji"',
          'Arial',
          'sans-serif',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ],
      },
      spacing: {
        // 8px 그리드 시스템
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
