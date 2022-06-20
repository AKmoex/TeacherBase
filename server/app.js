const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const path = require('path')

const app = express()
app.use(express.json())
app.use('/static/', express.static(path.join('../static')))

const mountRoutes = require('./routes')
mountRoutes(app)

app.listen('5000', () => {
  console.log('express服务器启动完成了')
})
