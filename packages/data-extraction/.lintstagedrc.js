module.exports = {
  './src/{data-exporter,icon-exporter,utils,config}/**.{js,json}': [
    'prettier --write',
  ],
  './*.{js,json}': ['prettier --write'],
};
