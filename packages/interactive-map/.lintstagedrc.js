module.exports = {
  './*.{js,json}': ['prettier --write'],
  './src/**.{ts,css}': ['prettier --write'],
  '*.html': ['prettier --write'],
};
