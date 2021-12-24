module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        rubik: 'Rubik, sans-serif',
      },
      backgroundImage: {
        'header-pattern': 'url("/pattern-bg.png")',
      },

      minHeight: {
        250: '250px',
      },
      colors: {
        'primary-gray': {
          DEFAULT: 'hsl(0, 0%, 59%)',
          dark: 'hsl(0, 0%, 17%)',
        },
      },

      fontSize: {
        xs: '0.5rem',
      },
      zIndex: {
        9999: '9999',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
