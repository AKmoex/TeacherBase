const Router = require('express-promise-router')
const { isUndefined, remove } = require('lodash')
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
const util = require('util')

const router = new Router()

module.exports = router

const multer = require('multer')
const upload = multer({ dest: __dirname + '/../../static' })
router.post('/photo', upload.single('file'), async (req, res) => {
  const file = req.file
  file.url = '/static/' + file.filename
  console.log(file)
  res.send(file)
})
