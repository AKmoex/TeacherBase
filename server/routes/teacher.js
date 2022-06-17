const Router = require('express-promise-router')
const { isUndefined, remove } = require('lodash')
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
const util = require('util')
const format = require('pg-format')
const dayjs = require('dayjs')
const { log } = require('console')

const router = new Router()

module.exports = router

/**
 * 获取所有教师
 */
router.get('/', authMiddleware(), async (req, res) => {
  if (req.id === '00000000') {
    try {
      const { rows } = await db.query('SELECT * FROM TeacherInfoView')

      remove(rows, function (n) {
        return n.id === '00000000'
      })

      const data = []

      rows.forEach((elem, index) => {
        data.push({
          tea_id: elem.id,
          tea_name: elem.name,
          tea_gender: elem.gender,
          tea_entry_date: elem.entry_date,
          tea_term_date: elem.term_date,
          tea_phone: elem.phone,
          tea_department_id: elem.department_id,
          tea_department_name: elem.department_name,
          tea_title: elem.title,
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
      console.log(err)
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

/**
 * 插入教师的教育经历
 * @param {*} data
 * @param {*} tea_id
 * @returns
 */
const insertEdu = async (data, tea_id, resdata) => {
  try {
    let edu_temp = []
    console.log(data)
    for (let i = 0; i < data.length; i++) {
      edu_temp.push([
        tea_id,
        data[i].date[0] + '-01',
        data[i].date[1] + '-01',
        data[i].school,
        data[i].type
      ])
    }
    console.log(edu_temp)
    const { rows_edu } = await db.query(
      format(
        'INSERT INTO education(teacher_id,start_date,end_date,school,degree) VALUES %L returning *',
        edu_temp
      ),
      []
    )
  } catch (err) {
    console.log('err:', err)
    resdata.edu_msg = '教师教育经历添加失败!'
  }
}
/**
 * 插入教师的家庭关系
 * @param {*} data
 * @param {*} tea_id
 * @returns
 */
const insertFam = async (data, tea_id, resdata) => {
  try {
    let fam_temp = []
    for (let i = 0; i < data.length; i++) {
      fam_temp.push([tea_id, data[i].fam_name, data[i].fam_relation, data[i].fam_phone])
    }
    const { rows_fam } = await db.query(
      format('INSERT INTO family(teacher_id,name,relation,phone) VALUES %L returning *', fam_temp),
      []
    )
  } catch (err) {
    console.log('err:', err)
    resdata.fam_msg = '教师家庭关系添加失败!'
  }
}

const insertArc = async (data, tea_id, resdata) => {
  try {
    let arc_temp = []

    for (let i = 0; i < data.length; i++) {
      arc_temp.push([tea_id, data[i].title, data[i].type, data[i].obtain_date, data[i].detail])
    }
    const { rows_arc } = await db.query(
      format(
        'INSERT INTO archive(teacher_id,title,type,obtain_date,detail) VALUES %L returning *',
        arc_temp
      ),
      []
    )
  } catch (err) {
    console.log('err', err)
    resdata.arc_msg = '教师奖惩记录添加失败!'
  }
}
const insertRes = async (data, tea_id, resdata) => {
  try {
    let res_temp = []

    for (let i = 0; i < data.length; i++) {
      res_temp.push([tea_id, data[i].title, data[i].obtain_date, data[i].detail])
    }
    const { rows_res } = await db.query(
      format(
        'INSERT INTO research(teacher_id,title,obtain_date,detail) VALUES %L returning *',
        res_temp
      ),
      []
    )
  } catch (err) {
    console.log('err', err)
    resdata.res_msg = '教师科研项目添加失败!'
  }
}

const insertWork = async (data, tea_id, resdata) => {
  try {
    let work_temp = []

    for (let i = 0; i < data.length; i++) {
      work_temp.push([
        tea_id,
        data[i].date[0] + '-01',
        data[i].date[1] + '-01',
        data[i].location,
        data[i].content
      ])
    }

    const { rows_work } = await db.query(
      format(
        'INSERT INTO work(teacher_id,start_date,end_date,location,content) VALUES %L returning *',
        work_temp
      ),
      []
    )
  } catch (err) {
    console.log('err:', err)
    resdata.work_msg = '教师工作经历添加失败!'
  }
}
const insertTea = async (req, resdata) => {
  try {
    let {
      tea_id,
      tea_name,
      tea_password,
      tea_birthday,
      tea_photo,
      tea_gender,
      tea_phone,
      tea_email,
      tea_ethnicity,
      tea_political,
      tea_address,
      tea_job,
      tea_title,
      tea_entry_date,
      tea_department_id
    } = req.body
    if (!isUndefined(tea_title)) {
      tea_title = tea_title.join(',')
    }
    if (!isUndefined(tea_gender)) {
      if (tea_gender == '2') {
        tea_gender = 2
      } else if (tea_gender == '1') {
        tea_gender = 1
      }
    }
    const { rows } = await db.query(
      'INSERT INTO teacher(id, name,password,gender,phone,email,birthday,photo,entry_date,department_id,job,ethnicity,political,address,title) VALUES($1, $2, $3, $4,$5,$6, $7, $8, $9,$10,$11, $12, $13, $14,$15) returning *',
      [
        tea_id,
        tea_name,
        tea_password,
        tea_gender,
        tea_phone,
        tea_email,
        tea_birthday,
        tea_photo,
        tea_entry_date,
        tea_department_id,
        tea_job,
        tea_ethnicity,
        tea_political,
        tea_address,
        tea_title
      ]
    )
  } catch (err) {
    console.log('err:', err)
    resdata.tea_msg = '教师添加失败!'
  }
}
/**
 * 添加教师-详细
 */
router.post('/add/details', authMiddleware(), async (req, res) => {
  const id = req.id
  //console.log(req.body)
  const { tea_id, tea_name, tea_password } = req.body
  let resdata = { success: true }

  if (id === '00000000') {
    if (!isUndefined(tea_id) && !isUndefined(tea_name) && !isUndefined(tea_password)) {
      try {
        // 基本信息
        await insertTea(req, resdata)

        // 奖惩记录
        let { tea_archive } = req.body

        if (
          !isUndefined(tea_archive) &&
          !isUndefined(tea_archive.length) &&
          tea_archive.length != 0
        ) {
          await insertArc(tea_archive, tea_id, resdata)
        }

        // 家庭关系
        let { tea_familys } = req.body
        if (
          !isUndefined(tea_familys) &&
          !isUndefined(tea_familys.length) &&
          tea_familys.length != 0
        ) {
          await insertFam(tea_familys, tea_id)
        }

        // 教育经历
        let { tea_edu } = req.body
        if (!isUndefined(tea_edu) && !isUndefined(tea_edu.length) && tea_edu.length != 0) {
          tea_edu = tea_edu.tea_edu
          await insertEdu(tea_edu, tea_id)
        }

        // 科研项目
        let { tea_research } = req.body
        if (
          !isUndefined(tea_research) &&
          !isUndefined(tea_research.length) &&
          tea_research.length != 0
        ) {
          await insertRes(tea_research, tea_id)
        }

        // 工作经历
        let { tea_work } = req.body
        if (!isUndefined(tea_work) && !isUndefined(tea_work.length) && tea_work.length != 0) {
          tea_work = tea_work.tea_work
          await insertWork(tea_work, tea_id)
        }
        res.send({
          ...resdata
        })
      } catch (err) {
        console.log(err)
        res.send({
          data: {
            success: false,
            message: '添加失败 !'
          },
          success: true
        })
      }
    } else {
      res.send({
        success: false,
        message: '添加失败, 工号、姓名、密码不能为空'
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
