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
    // Grid and layout classes
    'grid',
    'grid-cols-1',
    'lg:grid-cols-2',
    'gap-6',
    'space-y-6',
    'space-y-4',
    'space-x-3',
    // Background and border classes
    'bg-white',
    'bg-blue-600',
    'bg-blue-700',
    'bg-gray-600',
    'bg-gray-700',
    'rounded-lg',
    'shadow-sm',
    'border',
    'border-gray-300',
    'border-gray-200',
    'border-b',
    // Text and color classes
    'text-gray-800',
    'text-gray-700',
    'text-gray-600',
    'text-white',
    'text-3xl',
    'text-lg',
    'text-sm',
    'font-bold',
    'font-semibold',
    'font-medium',
    // Layout classes
    'container',
    'mx-auto',
    'px-4',
    'py-6',
    'p-6',
    'px-3',
    'py-2',
    'mb-8',
    'mb-4',
    'mb-2',
    'mb-1',
    'mt-6',
    'max-w-6xl',
    'min-w-fit',
    // Interactive classes
    'hover:bg-blue-700',
    'hover:bg-gray-700',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
    'focus:border-transparent',
    'transition-colors',
    'duration-200',
    // Flex classes
    'flex',
    'flex-1',
    'block',
    'w-full',
    'text-center',
    'text-left',
    'overflow-x-auto',
    'divide-y',
    'divide-gray-100',
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

