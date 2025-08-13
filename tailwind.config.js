/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html',
    './static/labels/**/*.html'
  ],
  safelist: [
    {
      pattern: /text-(6|7|8|9)xl/,
    },
    {
      pattern: /h-(106|300|306|696)/,
    },
    {
      pattern: /w-(106|300|306|991)/,
    },
  ],
  theme: {
    extend: {
      height: {
        '106': '106px',
        '300': '300px',
        '306': '306px',
        '696': '696px'
      },
      width: {
        '106': '106px',
        '300': '300px',
        '306': '306px',
        '991': '991px'
      },
      fontSize: {
        '10xl': '15rem',
      }
    },
  },
  plugins: [],
}

