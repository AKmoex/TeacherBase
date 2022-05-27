const Router = require('express-promise-router')
const { isUndefined } = require('lodash')
const db = require('../db')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/auth')

const router = new Router()

module.exports = router

router.post('/login', async (req, res) => {
  const { id, password } = req.body

  if (!isUndefined(id) && !isUndefined(password)) {
    try {
      let { rows } = await db.select('SELECT * FROM teacher where id=$1 and password=$2', [
        id,
        password
      ])

      const token = jwt.sign(
        {
          id: id
        },
        process.env.jwtSecret
      )
      // admin用户
      if (rows[0].id == '00000000') {
        res.send({
          status: 'ok',
          type: 'account',
          currentAuthority: 'admin',
          token: token
        })
      }
      // user 普通用户
      else {
        res.send({
          status: 'ok',
          type: 'account',
          currentAuthority: 'user',
          token: token
        })
      }
    } catch {
      res.send({
        status: 'error',
        type: 'account',
        currentAuthority: 'guest'
      })
    }
  } else {
    res.send({
      status: 'error',
      type: 'account',
      currentAuthority: 'guest'
    })
  }
})

router.get('/currentUser', authMiddleware(), async (req, res) => {
  console.log(req.id)

  try {
    const { rows } = await db.select('SELECT * FROM teacher where id=$1', [req.id])
    res.send({
      success: true,
      data: {
        id: rows[0].id,
        name: rows[0].name,
        gender: rows[0].gender,
        email: rows[0].email,
        position: rows[0].position,
        job: rows[0].job,
        access: rows[0].id == '00000000' ? 'admin' : 'user'
      }
    })
  } catch (err) {
    res.status(401).send({
      data: {
        isLogin: false
      },
      errorCode: '401',
      errorMessage: '请先登录！',
      success: true
    })
  }
})
