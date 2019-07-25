const path = require ('path');
const webpack = require ('webpack');
const {CleanWebpackPlugin} = require ('clean-webpack-plugin');
const devMode = process.env.NODE_ENV == 'development' ? true : false;
const MiniCssExtractPlugin = require ('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require ('optimize-css-assets-webpack-plugin');

const nodeExternals = require ('webpack-node-externals');

//babelOptions
const babelOptions = require ('../babel.config');

// common
const common = require ('./common');

//alias
let alias = {};
for (let i in common.alias) {
  alias[i] = path.resolve (__dirname, common.alias[i]);
}

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
  externals: [
    nodeExternals ({
      whitelist: /\.css$/,
    }),
  ],
  resolve: {
    alias,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        include: /(src)/,
        use: {
          loader: 'babel-loader',
          options: {
            ...babelOptions,
            plugins: [
              ...babelOptions.plugins,
              [
                'import',
                {
                  libraryName: 'antd',
                  libraryDirectory: 'lib',
                  style: false, // or 'css'
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(less)$/,
        exclude: /(node_modules|bower_components)/, //排除文件件
        use: [
          {
            loader: `css-loader`,
            options: {
              modules: {
                localIdentName: common.localIdentName,
              },
              onlyLocals: true,
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader: `css-loader`,
            options: {
              onlyLocals: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {limit: 8192, name: '../assets/files/[hash].[ext]'},
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: false, //devMode ? false : true
  },
  plugins: [
    new webpack.DefinePlugin ({
      __DEV__: devMode,
    }),
    new CleanWebpackPlugin (),
  ],
};
