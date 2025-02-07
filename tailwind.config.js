/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      transitionDuration: {
        '200': '200ms',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.700'),
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gray.900'),
            },
            a: {
              color: theme('colors.blue.600'),
              '&:hover': {
                color: theme('colors.blue.700'),
              },
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.300'),
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gray.100'),
            },
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
            strong: {
              color: theme('colors.gray.100'),
            },
            blockquote: {
              color: theme('colors.gray.300'),
              borderLeftColor: theme('colors.gray.700'),
            },
            hr: {
              borderColor: theme('colors.gray.700'),
            },
            ol: {
              li: {
                '&::marker': {
                  color: theme('colors.gray.400'),
                },
              },
            },
            ul: {
              li: {
                '&::marker': {
                  color: theme('colors.gray.400'),
                },
              },
            },
            'figure figcaption': {
              color: theme('colors.gray.400'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
