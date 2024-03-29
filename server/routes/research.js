const Router = require('express-promise-router')
const { isUndefined } = require('lodash')
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
const util = require('util')

const router = new Router()

module.exports = router

router.get('/', authMiddleware(), async (req, res) => {
  try {
    console.log(req.query)
    const selectParams = [`%${'%'}%`]
    let text = 'SELECT * FROM ResearchDepView WHERE title LIKE $1'
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

    if (req.query.dep_name) {
      if (req.query.dep_name != '全部') {
        selectParams.push(`%${req.query.dep_name}%`)
        text = `${text} AND department_name LIKE $${selectParams.length}`
      }
    }
    if (req.query.startTime && req.query.endTime) {
      selectParams.push(`${req.query.startTime}`)
      selectParams.push(`${req.query.endTime}`)
      text = `${text} AND obtain_date BETWEEN $${selectParams.length - 1} AND $${
        selectParams.length
      }`
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
        research: rows
      }
    })
  } catch (err) {
    console.log('err:', err)
    res.send({
      success: false,
      data: {
        research: []
      }
    })
  }
})

router.post('/add', authMiddleware(), async (req, res) => {
  const id = req.id
  const { teacher_id, title, obtain_date, detail } = req.body

  if (req.role === 'admin') {
    if (!isUndefined(teacher_id) && !isUndefined(title) && !isUndefined(obtain_date)) {
      try {
        let { rows } = await db.query(
          'INSERT INTO research(teacher_id, title,obtain_date,detail) VALUES($1, $2, $3, $4) returning *',
          [teacher_id, title, obtain_date, detail]
        )
        res.send({
          message: '添加科研项目成功 !',
          success: true
        })
      } catch (err) {
        console.log('err:', err)
        res.send({
          message: '添加失败,请确定申报人是否存在 !',
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
  const { id, teacher_id, title, detail, obtain_date } = req.body

  if (req.role === 'admin') {
    if (id && teacher_id && title && obtain_date) {
      try {
        let { rows } = await db.query('CALL update_research($1,$2,$3,$4,$5)', [
          id,
          teacher_id,
          title,
          obtain_date,
          detail
        ])
        res.send({
          message: '科研项目更新成功 !',
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
        await db.query('delete from research where id=$1', [id])
        res.send({
          message: '该科研项目已成功删除!',
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
        message: '项目id不可为空',
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
