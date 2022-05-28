const dotenv = require('dotenv')
dotenv.config()
const express = require('express')

const app = express()
app.use(express.json())

const mountRoutes = require('./routes')
mountRoutes(app)

app.listen('5000', () => {
  console.log('express服务器启动完成了')
})
