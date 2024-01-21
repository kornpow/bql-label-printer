/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./templates/**', './static/**'],
  safelist: [
    'text-2xl',
    'text-3xl',
    {
      pattern: /bg-(red|green|blue)-(100|200|300)/,
    },
    {
      pattern: /text-(2|3|4|5|6)xl/,
    },
  ],
  theme: {
    extend: {
      height: {
        '106': '106px',
      }
    },
  },
  plugins: [],
}

