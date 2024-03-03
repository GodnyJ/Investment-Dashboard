module.exports = {
  content: ['./dist/*.html'],
  theme: {
    fontFamily: {
      'roboto': ['Roboto', 'sans-serif'],
    },
    extend: {
      colors: {
        'bg-dark-blue': '#132838',
        'input-bg': '#1F4150',
        'bg-blue': '#408894',
        'main-green': '#0E9D7C',
        'main-green-hover': '#076C55',
        'bg-card-light': '#EDFEFE',
        'bg-card-dark': '#C8E3E9',
        'text-light-grey' : '#4B6371',
        'bg-g-black' : '#0B1828',
        'bg-g-dark-blue': '#143142',
        'btn-blue': '#346E7B',
        'main-red': '#E85B71'
        
      },
      backgroundImage: theme => ({
        'card-gradient-vertical': 'linear-gradient(to top, #B1D2DC, #EDFEFE)',
      })
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}