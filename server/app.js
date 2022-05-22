const express = require("express")
const mountRoutes = require('./routes')


//app.use(express.json());


const app = express()
mountRoutes(app)


app.listen("3000", () => {
  console.log("express服务器启动完成了");
});