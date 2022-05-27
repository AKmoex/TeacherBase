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
router.post('/create', authMiddleware(), async (req, res) => {
  const id = req.id
  const { dep_name, dep_date, dep_address, dep_phone } = req.body

  if (id === '00000000') {
    if (
      !isUndefined(dep_name) &&
      !isUndefined(dep_date) &&
      !isUndefined(dep_address) &&
      !isUndefined(dep_phone)
    ) {
      try {
        //console.log(dep_name, dep_date, dep_address, dep_phone)
        let { rows } = await db.query(
          'INSERT INTO department(name, establish_date,phone,address) VALUES($1, $2, $3, $4) returning *',
          [dep_name, dep_date, dep_address, dep_phone]
        )
        // console.log(dep_name, dep_date, dep_address, dep_phone)
        // console.log(rows[0])
        res.send({
          data: {
            success: true,
            message: '创建部门成功!'
          },
          success: true
        })
      } catch {
        res.send({
          data: {
            success: false,
            message: '创建部门失败,部门名称唯一!'
          },
          success: true
        })
      }
    } else {
      res.send({
        data: {
          success: false,
          message: '创建部门失败'
        },
        success: true
      })
    }
  } else {
    res.send({
      data: {
        success: false,
        message: '创建部门失败'
      },
      success: true
    })
  }
})
