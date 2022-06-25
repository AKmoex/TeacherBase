const Router = require('express-promise-router')
const { isUndefined } = require('lodash')
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
const util = require('util')

const router = new Router()

module.exports = router

router.get('/', authMiddleware(), async (req, res) => {
  console.log('getDepartment', req.query.keyword)
  if (req.role === 'admin') {
    try {
      const { rows } = await db.query('SELECT * FROM department WHERE name LIKE $1', [
        `%${req.query.keyword}%`
      ])
      const data = []
      rows.forEach((elem, index) => {
        data.push({
          dep_id: elem.id,
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

  if (req.role === 'admin') {
    if (
      !isUndefined(dep_name) &&
      !isUndefined(dep_date) &&
      !isUndefined(dep_address) &&
      !isUndefined(dep_phone)
    ) {
      try {
        let { rows } = await db.query(
          'INSERT INTO department(name, establish_date,phone,address) VALUES($1, $2, $3, $4) returning *',
          [dep_name, dep_date, dep_phone, dep_address]
        )

        res.send({
          data: {
            success: true,
            message: '创建部门成功 !'
          },
          success: true
        })
      } catch (err) {
        res.send({
          data: {
            success: false,
            message: '创建部门失败,部门名称已存在 !'
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

router.post('/delete', authMiddleware(), async (req, res) => {
  const id = req.id
  const { dep_id } = req.body

  if (req.role === 'admin') {
    if (!isUndefined(dep_id)) {
      try {
        const client = await db.pool.connect()

        await client.query('BEGIN')
        const updateText = ' UPDATE teacher SET department_id=NULL WHERE department_id=$1'

        await client.query(updateText, [dep_id])
        const deleteText = 'DELETE FROM department WHERE id=$1'
        await client.query(deleteText, [dep_id])

        await client.query('COMMIT')
        console.log(client)

        res.send({
          data: {
            success: true,
            message: '删除该部门成功!'
          },
          success: true
        })
      } catch (err) {
        console.log(err)
        res.send({
          data: {
            success: false,
            message: '部门删除失败!'
          },
          success: true
        })
      }
    } else {
      res.send({
        data: {
          success: false,
          message: '部门删除失败'
        },
        success: true
      })
    }
  } else {
    res.send({
      data: {
        success: false,
        message: '删除部门失败'
      },
      success: true
    })
  }
})

router.post('/delete/multiple', authMiddleware(), async (req, res) => {
  const id = req.id
  const { dep_ids } = req.body

  if (req.role === 'admin') {
    if (!isUndefined(dep_ids)) {
      try {
        const client = await db.pool.connect()

        await client.query('BEGIN')
        for (let i = 0; i < dep_ids.length; i++) {
          const updateText = ' UPDATE teacher SET department_id=NULL WHERE department_id=$1'
          await client.query(updateText, [dep_ids[i]])
          const deleteText = 'DELETE FROM department WHERE id=$1'
          await client.query(deleteText, [dep_ids[i]])
        }
        await client.query('COMMIT')

        res.send({
          data: {
            success: true,
            message: util.format('成功删除 %d 个部门 !', dep_ids.length)
          },
          success: true
        })
      } catch (err) {
        console.log(err)
        res.send({
          data: {
            success: false,
            message: '部门删除失败!'
          },
          success: true
        })
      }
    } else {
      res.send({
        data: {
          success: false,
          message: '部门删除失败'
        },
        success: true
      })
    }
  } else {
    res.send({
      data: {
        success: false,
        message: '删除部门失败'
      },
      success: true
    })
  }
})
