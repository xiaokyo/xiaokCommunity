const isDev = process.env.NODE_ENV === 'production' ? false : true
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
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
  const compiler = webpack(webpackConfig)
  app.use(require('webpack-dev-middleware')(compiler, {
    // webpack-dev-middleware options
    publicPath: webpackConfig.output.publicPath,
    noInfo: true,
    // quiet: true  //向控制台显示任何内容
  }))
  app.use(require("webpack-hot-middleware")(compiler))//hmr

  app.use(express.static(path.join(__dirname, "dist")))
} else {
  const { getRenderPage } = require('./dist/server/server.js')
  console.log(require('./dist/server/server.js'))
  app.use(helmet()); //阻挡一些web的安全隐患
  app.use(bodyParser.json({ limit: '20mb' }))
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))
  app.use(cookieParser())

  //production static path
  app.use('/', express.static(path.join(__dirname, "dist")))
  app.use('/', express.static(path.join(__dirname, "public")))

  //渲染对应路由页面
  app.use('*', async (req, res) => {
    await getRenderPage(req, res)
  })
}

app.use("/graphql", proxyMiddleWare({ ...proxyOption }))
app.use("/socket.io", proxyMiddleWare({ ...proxyOption, ws: true }))

app.listen(PORT, () => console.log(`app listening on port http://localhost:${PORT}`))