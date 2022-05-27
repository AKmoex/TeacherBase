const Router = require('express-promise-router')
const { isUndefined } = require('lodash')
const db = require('../db')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/auth')
const { devNull } = require('os')

const router = new Router()

module.exports = router

router.get('/', authMiddleware(), async (req, res) => {
  if (req.id === '00000000') {
    try {
      const { rows } = await db.query('SELECT * FROM department')
      console.log(rows)
      const data = []
      rows.forEach((elem, index) => {
        data.push({
          dep_name: elem.name,
          dep_date: elem.establish_date,
          dep_count: elem.t_count,
          dep_address: elem.address,
          dep_phone: elem.phone
        })
      })
      res.send({
        success: true,
        data: {
          department: data
        }
      })
    } catch (err) {
      res.send({
        success: false,
        data: {
          department: []
        }
      })
    }
  } else {
    res.status(401).send({
      data: {
        isLogin: false
      },
      errorCode: '401',
      errorMessage: '没有权限,请先登录！',
      success: true
    })
  }
})
