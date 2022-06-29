const Router = require('express-promise-router')
const { isUndefined } = require('lodash')
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
const util = require('util')

const router = new Router()

module.exports = router

router.get('/', authMiddleware(), async (req, res) => {
  try {
    const { rows } = await db.query('call departmentTitle();')
    let d = []
    for (let i = 0; i < rows.length; i++) {
      if (!rows[i].title) {
        rows[i].title = '其他'
      }
    }
    const r = await db.query('call getSys();')
    console.log(r.rows)
    res.send({
      success: true,
      data: rows,
      cnt_data: r.rows[0]
    })
  } catch (err) {
    console.log('err:', err)
    res.send({
      success: false,
      data: []
    })
  }
})
