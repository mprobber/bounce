const build = require('static-build');
const { resolve } = require('path');

module.exports = build({
  entry: resolve(__dirname, 'index.js'),
  template: resolve(__dirname, 'index.html'),
  name: 'pretty-fly',
});
