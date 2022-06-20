const Router = require('express-promise-router')
const { isUndefined, remove } = require('lodash')
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
const util = require('util')
const multer = require('multer')
const router = new Router()

module.exports = router
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/../../static')
  },
  filename: (req, file, cb) => {
    console.log(file.originalname)
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage
})
router.post('/photo', upload.single('file'), async (req, res) => {
  const file = req.file
  file.url = '/static/' + file.filename
  console.log(file)
  res.send(file)
})
