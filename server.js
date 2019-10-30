const isDev = process.env.NODE_ENV === 'production' ? false : true

if (isDev) {
  const path = require("path")
  const webpack = require('webpack')
  const express = require('express')
  const app = express()
  const PORT = 8080// port
  const proxyMiddleWare = require('http-proxy-middleware')
  const proxyPath = "http://127.0.0.1:4000"// 目标后端服务地址
  const proxyOption = {// proxy options
    target: proxyPath,
    changeOrigoin: true
  }
  const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')// 友好输出webpack插件
  const webpackConfig = require('./webpack/client.js')

  // 修改入口文件，增加热更新文件
  webpackConfig.entry.app = ["webpack-hot-middleware/client?noInfo=true&reload=true", webpackConfig.entry.app]
  // webpackConfig.output.filename = "static/js/[name].[hash].js"
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  webpackConfig.plugins.push(new FriendlyErrorsWebpackPlugin({
    compilationSuccessInfo: {
      messages: [`You application is running here http://localhost:${PORT}`],
      notes: ['development environment']
    }
  }))

  const compiler = webpack(webpackConfig)
  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    // webpack-dev-middleware options
    publicPath: webpackConfig.output.publicPath,
    index: 'index.html',
    logLevel: 'silent',// 静默日志
  })

  app.use(devMiddleware)

  // 设置auth cookie
  app.post('/setAuth', async (req, res) => {
    const access_token = req.headers.accesstoken;
    // console.log(req.headers, access_token);
    res.cookie('access_token', access_token, { path: '/', httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
    res.send({ success: true });
  })

  // 清除auth cookie
  app.post('/clearAuth', async (req, res) => {
    res.clearCookie('access_token')
    res.send({ success: true })
  })

  app.use("/graphql", proxyMiddleWare({ ...proxyOption }))
  app.use("/socket.io", proxyMiddleWare({ ...proxyOption, ws: true }))

  app.use(require("webpack-hot-middleware")(compiler))// hmr
  app.use(express.static(path.join(__dirname, "dist")))
  app.listen(PORT)
} else {
  require('./src/server/server.js')
}
