const Router = require('express-promise-router')
const { isUndefined } = require('lodash')
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
const util = require('util')

const router = new Router()

module.exports = router

router.get('/', authMiddleware(), async (req, res) => {
  try {
    const selectParams = [`%${'%'}%`]
    let text = 'SELECT * FROM ArchiveInfoView WHERE title LIKE $1'
    if (!isUndefined(req.query.title)) {
      selectParams[0] = `%${req.query.title}%`
    }
    if (req.query.teacher_id) {
      selectParams.push(`%${req.query.teacher_id}%`)
      text = `${text} AND teacher_id LIKE $${selectParams.length}`
    }

    if (req.query.teacher_name) {
      selectParams.push(`%${req.query.teacher_name}%`)
      text = `${text} AND teacher_name LIKE $${selectParams.length}`
    }

    if (req.query.startTime && req.query.endTime) {
      selectParams.push(`${req.query.startTime}`)
      selectParams.push(`${req.query.endTime}`)
      text = `${text} AND obtain_date BETWEEN $${selectParams.length - 1} AND $${
        selectParams.length
      }`
    }
    if (req.query.type) {
      if (req.query.type == '1') {
        text = `${text} AND type=1`
      } else if (req.query.type == '0') {
        text = `${text} AND type=0`
      }
    }
    if (req.query.sort) {
      if (req.query.sort == 'ascend') {
        text = `${text} ORDER BY obtain_date ASC`
      } else if (req.query.sort == 'descend') {
        text = `${text} ORDER BY obtain_date DESC`
      }
    }
    const { rows } = await db.query(text, selectParams)
    res.send({
      success: true,
      data: {
        archive: rows
      }
    })
  } catch (err) {
    console.log('err:', err)
    res.send({
      success: false,
      data: {
        archive: []
      }
    })
  }
})

router.post('/add', authMiddleware(), async (req, res) => {
  const id = req.id
  const { teacher_id, title, obtain_date, detail, type } = req.body
  if (req.role === 'admin') {
    if (!isUndefined(teacher_id) && !isUndefined(title) && !isUndefined(obtain_date)) {
      try {
        let { rows } = await db.query(
          'INSERT INTO archive(teacher_id, title,obtain_date,detail,type) VALUES($1, $2, $3, $4,$5) returning *',
          [teacher_id, title, obtain_date, detail, type]
        )
        res.send({
          message: '添加奖惩记录成功 !',
          success: true
        })
      } catch (err) {
        console.log('err:', err)
        res.send({
          message: '添加失败,请确定教师是否存在 !',
          success: false
        })
      }
    } else {
      res.send({
        message: '添加失败, 部分信息不可为空 !',
        success: false
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

router.post('/edit', authMiddleware(), async (req, res) => {
  const { id, teacher_id, title, detail, obtain_date, type } = req.body

  if (req.role === 'admin') {
    if (id && teacher_id && title && obtain_date) {
      try {
        let { rows } = await db.query('CALL update_archive($1,$2,$3,$4,$5,$6)', [
          id,
          teacher_id,
          title,
          obtain_date,
          detail,
          type
        ])
        res.send({
          message: '奖惩记录更新成功 !',
          success: true
        })
      } catch (err) {
        console.log(err)
        res.send({
          message: '更新失败, 请检查信息是否填写正确 !',
          success: false
        })
      }
    } else {
      res.send({
        success: false,
        message: '更新失败, 部分信息不可为空 !'
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

router.post('/delete', authMiddleware(), async (req, res) => {
  const { id } = req.body
  if (req.role === 'admin') {
    if (id) {
      try {
        await db.query('delete from archive where id=$1', [id])
        res.send({
          message: '该奖惩记录已成功删除!',
          success: true
        })
      } catch (err) {
        console.log(err)
        res.send({
          success: false,
          message: '删除失败!'
        })
      }
    } else {
      res.send({
        message: '奖惩记录id不可为空',
        success: false
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
