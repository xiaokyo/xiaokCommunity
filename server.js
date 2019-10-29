const isDev = process.env.NODE_ENV === 'production' ? false : true
const path = require("path")
const webpack = require('webpack')
const express = require('express')
const app = express()
const PORT = 8080//port
const proxyMiddleWare = require('http-proxy-middleware')
var proxyPath = "http://127.0.0.1:4000"//目标后端服务地址
var proxyOption = {//proxy options
  target: proxyPath,
  changeOrigoin: true
}
console.log(require('./dist/server/server.js').default)
//设置auth cookie
app.post('/setAuth', async (req, res) => {
  const access_token = req.headers.accesstoken;
  // console.log(req.headers, access_token);
  res.cookie('access_token', access_token, { path: '/', httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
  res.send({ success: true });
})

//清除auth cookie
app.post('/clearAuth', async (req, res) => {
  res.clearCookie('access_token')
  res.send({ success: true })
})

if (isDev) {
  const webpackConfig = require('./webpack/client.js')

  // 修改入口文件，增加热更新文件
  webpackConfig.entry.app = ["webpack-hot-middleware/client?noInfo=true&reload=true", webpackConfig.entry.app]
  // webpackConfig.output.filename = "static/js/[name].[hash].js"
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())

  const compiler = webpack(webpackConfig)
  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    // webpack-dev-middleware options
    publicPath: webpackConfig.output.publicPath,
    noInfo: true,
    // quiet: true  //向控制台显示任何内容
  })
  app.use(devMiddleware)

  // const template = fs.readFileSync(devMiddleware.fileSystem, "index.html", 'utf-8')
  // console.log(template)
  app.use(require("webpack-hot-middleware")(compiler))//hmr
  app.use(express.static(path.join(__dirname, "dist")))

} else {

}

app.use("/graphql", proxyMiddleWare({ ...proxyOption }))
app.use("/socket.io", proxyMiddleWare({ ...proxyOption, ws: true }))

if (isDev) {
  app.listen(PORT, () => console.log(`app listening on port http://localhost:${PORT}`))
} else {
  console.log(require('./src/server/server.js'))
}
