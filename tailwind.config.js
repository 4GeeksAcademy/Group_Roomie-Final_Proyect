/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
      'none': '0',
      'lg': '50px',
    }
  },
    
  },
  plugins: [],
}

