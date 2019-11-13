const express = require('express')
const webpack = require('webpack')
const WriteFileWebpackPlugin = require('write-file-webpack-plugin')
const webpackDevMiddle = require('webpack-dev-middleware')
const webpackHotMiddle = require('webpack-hot-middleware')
const nodemon = require('nodemon')

const webpackConfig = require('../webpack/client')
const serverWebpackConfig = require('../webpack/server')

const app = express()

const compilerPromise = (compiler) => {
  return new Promise((resolve, reject) => {
    // console.log(compiler)
    compiler.hooks.done.tap('MyPlugin', (stats) => {
      if (!stats.hasErrors()) {
        return resolve();
      }
      return reject('Compilation failed');
    });
  });
};


const start = async () => {
  const isDev = process.env.NODE_ENV == 'development' ? true : false

  if (isDev) {
    webpackConfig.entry.app.unshift('webpack-hot-middleware/client?path=/__what&timeout=2000&overlay=false&reload=true')
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
    webpackConfig.plugins.push(new WriteFileWebpackPlugin())
  }

  const compiler = webpack([webpackConfig, serverWebpackConfig])
  const clientCompiler = compiler.compilers[0]
  const serverCompiler = compiler.compilers[1]

  app.use(webpackDevMiddle(clientCompiler, {
    publicPath: webpackConfig.output.publicPath,
    logLevel: 'silent',// 静默日志
  }))

  app.use(webpackHotMiddle(clientCompiler, {
    path: "/__what",
    heartbeat: 2000
  }))

  app.listen(8079)

  serverCompiler.watch({ ignored: /node_modules/ }, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      console.log('server build success')
      return
    }

    if (error) {
      console.log(error, 'error')
    }
  })

  await compilerPromise(serverCompiler)
  await compilerPromise(clientCompiler)


  const script = nodemon({
    script: 'dist/server/server.js',
    ignore: ['src', 'scripts', 'config', './*.*', 'dist/assets']
  })

  script.on('restart', () => {
    console.log('Server side app has been restarted.')
  })

  script.on('quit', () => {
    console.log('Process ended')
    process.exit()
  })

  script.on('error', () => {
    console.log('An error occured. Exiting')
    process.exit(1)
  })
}

start()