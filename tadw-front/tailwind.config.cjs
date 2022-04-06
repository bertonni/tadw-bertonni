module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
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
      }
    },
  },
  plugins: [],
}
