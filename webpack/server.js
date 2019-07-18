const path = require ('path');
const {CleanWebpackPlugin} = require ('clean-webpack-plugin');
const devMode = process.env.NODE_ENV == 'development' ? true : false;
const MiniCssExtractPlugin = require ('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require ('optimize-css-assets-webpack-plugin');

const nodeExternals = require ('webpack-node-externals');

module.exports = {
  mode: process.env.NODE_ENV,
  target: 'node',
  entry: [path.join (__dirname, '../src/server/index.js')],
  output: {
    path: path.join (__dirname, '../dist/server'),
    filename: 'server.js',
    chunkFilename: '[id].server.js',
    publicPath: '/',
    libraryTarget: 'commonjs2',
  },
  externals: [nodeExternals ()],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(less|css)$/,
        exclude: /(node_modules|bower_components)/, //排除文件件
        use: [
          {
            loader: `css-loader`,
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
              },
              onlyLocals: true,
            },
          },
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {limit: 8192, name: '../assets/files/[name].[hash].[ext]'},
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: false, //devMode ? false : true
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new CleanWebpackPlugin (),
    // new webpack.DefinePlugin ({
    //   __SERVER__: 'true',
    //   __CLIENT__: 'false',
    // }),
  ],
};
