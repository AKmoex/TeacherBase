const Router = require('express-promise-router')
const { isUndefined, remove } = require('lodash')
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
const util = require('util')

const router = new Router()

module.exports = router

router.get('/', authMiddleware(), async (req, res) => {
  if (req.id === '00000000') {
    try {
      const { rows } = await db.query('SELECT * FROM teacher')

      var array = [1, 2, 3, 4]
      remove(rows, function (n) {
        return n.id === '00000000'
      })

      const data = []

      rows.forEach((elem, index) => {
        data.push({
          tea_id: elem.id,
          tea_name: elem.name,
          tea_gender: elem.gendder,
          tea_entry_date: elem.entry_date,
          tea_term_date: elem.term_date,
          tea_phone: elem.phone,
          tea_department: elem.department,
          tea_position: elem.position,
          tea_job: elem.job,
          tea_email: elem.email,
          tea_ethnicity: elem.ethnicity,
          tea_political: elem.political,
          tea_identity: elem.identity,
          tea_address: elem.address
        })
      })
      res.send({
        success: true,
        data: {
          teacher: data
        }
      })
    } catch (err) {
      res.send({
        success: false,
        data: {
          teacher: []
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

  if (id === '00000000') {
    if (!isUndefined(dep_id)) {
      try {
        const client = await db.pool.connect()

        await client.query('BEGIN')
        const updateText = ' UPDATE teacher SET department=NULL WHERE department=$1'

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

  if (id === '00000000') {
    if (!isUndefined(dep_ids)) {
      try {
        const client = await db.pool.connect()

        await client.query('BEGIN')
        for (let i = 0; i < dep_ids.length; i++) {
          const updateText = ' UPDATE teacher SET department=NULL WHERE department=$1'
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
