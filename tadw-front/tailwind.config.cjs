module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  variants: {
    extend: {
      visibility: ['group-hover']
    }
  },
  theme: {
    extend: {
      animation: {
        'fade-in-b': 'fade-b 0.3s linear forwards',
        'border-b': 'border-b 0.3s ease forwards'
      },
      keyframes: {
        'fade-b': {
          from: { opacity: 0, transform: 'translate3d(0, 30%, 0)' },
          to: { opacity: 1, transform: 'none' }
        },
        'border-b': {
          from: { 'transform-origin': '0%' },
          to: { 'transform-origin': '50%' }
        }
      },
      maxHeight: {
        '104': '26rem',
        '112': '28rem',
        '120': '30rem'
      },
      colors: {
        'normal': '#A8A77A',
        'fire': '#EE8130',
        'water': '#6390F0',
        'electric': '#F7D02C',
        'grass': '#7AC74C',
        'ice': '#96D9D6',
        'fighting': '#C22E28',
        'poison': '#A33EA1',
        'ground': '#E2BF65',
        'flying': '#A98FF3',
        'psychic': '#F95587',
        'bug': '#A6B91A',
        'rock': '#B6A136',
        'ghost': '#735797',
        'dragon': '#6F35FC',
        'dark': '#705746',
        'steel': '#B7B7CE',
        'fairy': '#D685AD'
      }
    },
  },
  plugins: [],
}
