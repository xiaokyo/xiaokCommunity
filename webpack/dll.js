const path = require('path')
const webpack = require('webpack')

// const src = path.resolve(process.cwd(), 'src')
// const devMode = process.env.NODE_ENV == 'development' ? true : false

module.exports = {
  mode: 'production',
  entry: {
    vendor: ['react', 'react-dom']
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist/assets'),
    filename: '[name].dll.js',
    library: '[name]_[hash]',
    libraryTarget: 'this'
  },
  plugins: [
    new webpack.DllPlugin({
      context: process.cwd(),
      path: path.resolve(__dirname, '..', 'dist/[name]-manifest.json'),
      name: '[name]_[hash]'
    })
  ]
}