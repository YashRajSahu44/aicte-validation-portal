/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#123B63', brand: '#1D5B8F', saffron: '#E89B32', page: '#F4F6F9',
        ink: '#202B36', muted: '#667085', ok: '#218653', warn: '#B7791F', err: '#C0392B', line: '#DCE2E8',
      },
      fontFamily: { sans: ['Inter', 'Segoe UI', 'system-ui', 'Arial', 'sans-serif'] },
    },
  },
  plugins: [],
};
