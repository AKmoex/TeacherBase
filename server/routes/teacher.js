const Router = require('express-promise-router')
const { isUndefined, remove } = require('lodash')
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
const util = require('util')
const format = require('pg-format')
const dayjs = require('dayjs')
const includes = require('../utils')

const router = new Router()

module.exports = router
router.get('/id', authMiddleware(), async (req, res) => {
  const tea_id = req.query.tea_id

  if (req.id === '00000000') {
    try {
      // 查询基本信息
      const res_a = await db.query(format('SELECT * FROM TeacherInfoView WHERE id=%L', tea_id))
      let data = {
        ...res_a.rows[0]
      }
      // 查询教育经历
      const res_b = await db.query(format('SELECT * FROM Education WHERE teacher_id=%L', tea_id))
      data.edu = res_b.rows

      // 查询家庭关系
      const res_c = await db.query(format('SELECT * FROM Family WHERE teacher_id=%L', tea_id))
      data.fam = res_c.rows

      // 查询工作经历
      const res_d = await db.query(format('SELECT * FROM Work WHERE teacher_id=%L', tea_id))
      data.work = res_d.rows

      // 查询奖惩记录
      const res_e = await db.query(format('SELECT * FROM Archive WHERE teacher_id=%L', tea_id))
      data.arc = res_e.rows

      // 查询科研项目
      const res_f = await db.query(format('SELECT * FROM Research WHERE teacher_id=%L', tea_id))
      data.res = res_f.rows

      res.send({
        success: true,
        data
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
 * 获取所有教师
 */
router.get('/', authMiddleware(), async (req, res) => {
  // [tea_name,tea_id,tea_gender,tea_phone,tea_department_name,tea_political]

  if (req.id === '00000000') {
    try {
      const selectParams = [`%${'%'}%`, `%${'%'}%`]
      let text = 'SELECT * FROM TeacherInfoView WHERE name LIKE $1 AND id LIKE $2'
      if (!isUndefined(req.query.tea_name)) {
        selectParams[0] = `%${req.query.tea_name}%`
      }
      if (!isUndefined(req.query.tea_id)) {
        selectParams[1] = `%${req.query.tea_id}%`
      }

      if (req.query.tea_gender) {
        if (req.query.tea_gender == '男') {
          selectParams.push(`%${'1'}%`)
          text = `${text} AND gender LIKE $${selectParams.length}`
        } else if (req.query.tea_gender == '女') {
          selectParams.push(`%${'2'}%`)
          text = `${text} AND gender LIKE $${selectParams.length}`
        }
      }
      if (req.query.tea_phone) {
        selectParams.push(`%${req.query.tea_phone}%`)
        text = `${text} AND phone LIKE $${selectParams.length}`
      }
      if (req.query.tea_department_name) {
        if (req.query.tea_department_name != '全部') {
          selectParams.push(`%${req.query.tea_department_name}%`)
          text = `${text} AND department_name LIKE $${selectParams.length}`
        }
      }
      if (req.query.tea_political) {
        if (req.query.tea_political != '全部') {
          selectParams.push(`%${req.query.tea_political}%`)
          text = `${text} AND political LIKE $${selectParams.length}`
        }
      }
      if (req.query.tea_status) {
        if (req.query.tea_status == '已离职') {
          text = `${text} AND term_date IS NOT NULL`
        }
      }
      if (req.query.dateRange) {
        selectParams.push(`${req.query.dateRange[0]}`)
        selectParams.push(`${req.query.dateRange[1]}`)
        text = `${text} AND entry_date BETWEEN $${selectParams.length - 1} AND $${
          selectParams.length
        }`
      }

      const { rows } = await db.query(text, selectParams)

      if (req.query.tea_title && req.query.tea_title.length > 0) {
        //req.query.tea_title = req.query.tea_title.split(',')
        const x = req.query.tea_title.split(',')

        remove(rows, function (n) {
          if (n.title == null || n.title.length <= 0) {
            return true
          }
          let ts = n.title.split(',')
          return !includes(ts, x)
        })
      }

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
      console.log('err:', err)
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
    for (let i = 0; i < data.length; i++) {
      edu_temp.push([
        tea_id,
        data[i].date[0] + '-01',
        data[i].date[1] + '-01',
        data[i].school,
        data[i].degree,
        data[i].major
      ])
    }
    const { rows_edu } = await db.query(
      format(
        'INSERT INTO education(teacher_id,start_date,end_date,school,degree,major) VALUES %L returning *',
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
      arc_temp.push([tea_id, data[i].title, data[i].obtain_date, data[i].detail, data[i].type])
    }
    const { rows_arc } = await db.query(
      format(
        'INSERT INTO archive(teacher_id,title,obtain_date,detail,type) VALUES %L returning *',
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

const updateTea = async (req, resdata) => {
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
      'CALL update_teacher($1, $2, $3, $4,$5,$6, $7, $8, $9,$10,$11, $12, $13, $14,$15);',
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

const updateFam = async (data, tea_id, resdata) => {
  try {
    let fam_temp = []
    for (let i = 0; i < data.length; i++) {
      fam_temp.push([data[i].id, tea_id, data[i].fam_name, data[i].fam_relation, data[i].fam_phone])
    }

    // 删除数据
    const { rows } = await db.query('select * from family where teacher_id=$1', [tea_id])
    for (const e of rows) {
      // 新数据中没有
      flag = false
      for (const e2 of fam_temp) {
        if (e2[0] == e.id) {
          // 有
          flag = true
          break
        }
      }
      if (!flag) {
        await db.query('delete from family where id=$1', [e.id])
      }
    }

    // 更新或插入
    for (let i = 0; i < fam_temp.length; i++) {
      await db.query('CALL update_family($1,$2,$3,$4,$5)', fam_temp[i])
    }
  } catch (err) {
    console.log('err:', err)
    resdata.fam_msg = '教师家庭关系更新失败!'
  }
}

const updateArc = async (data, tea_id, resdata) => {
  try {
    let arc_temp = []

    for (let i = 0; i < data.length; i++) {
      arc_temp.push([
        data[i].id,
        tea_id,
        data[i].title,
        data[i].obtain_date,
        data[i].detail,
        data[i].type
      ])
    }

    // 删除数据
    const { rows } = await db.query('select * from Archive where teacher_id=$1', [tea_id])
    for (const e of rows) {
      // 新数据中没有
      flag = false
      for (const e2 of arc_temp) {
        if (e2[0] == e.id) {
          // 有
          flag = true
          break
        }
      }
      if (!flag) {
        await db.query('delete from Archive where id=$1', [e.id])
      }
    }

    // 更新或插入
    for (let i = 0; i < arc_temp.length; i++) {
      await db.query('CALL update_archive($1,$2,$3,$4,$5,$6)', arc_temp[i])
    }
  } catch (err) {
    console.log('err', err)
    resdata.arc_msg = '教师奖惩记录更新失败!'
  }
}

const updateRes = async (data, tea_id, resdata) => {
  try {
    let res_temp = []

    for (let i = 0; i < data.length; i++) {
      res_temp.push([data[i].id, tea_id, data[i].title, data[i].obtain_date, data[i].detail])
    }

    // 删除数据
    const { rows } = await db.query('select * from Research where teacher_id=$1', [tea_id])
    for (const e of rows) {
      // 新数据中没有
      flag = false
      for (const e2 of res_temp) {
        if (e2[0] == e.id) {
          // 有
          flag = true
          break
        }
      }
      if (!flag) {
        await db.query('delete from Research where id=$1', [e.id])
      }
    }

    // 更新或插入
    for (let i = 0; i < res_temp.length; i++) {
      await db.query('CALL update_research($1,$2,$3,$4,$5)', res_temp[i])
    }
  } catch (err) {
    console.log('err', err)
    resdata.res_msg = '教师科研项目更新失败!'
  }
}

const updateEdu = async (data, tea_id, resdata) => {
  try {
    let edu_temp = []
    for (let i = 0; i < data.length; i++) {
      edu_temp.push([
        data[i].id,
        tea_id,
        data[i].date[0] + '-01',
        data[i].date[1] + '-01',
        data[i].school,
        data[i].degree,
        data[i].major
      ])
    }

    // 删除数据
    const { rows } = await db.query('select * from Education where teacher_id=$1', [tea_id])
    for (const e of rows) {
      // 新数据中没有
      flag = false
      for (const e2 of edu_temp) {
        if (e2[0] == e.id) {
          // 有
          flag = true
          break
        }
      }
      if (!flag) {
        await db.query('delete from Education where id=$1', [e.id])
      }
    }
    // 更新或插入
    for (let i = 0; i < edu_temp.length; i++) {
      await db.query('CALL update_education($1,$2,$3,$4,$5,$6,$7)', edu_temp[i])
    }
  } catch (err) {
    console.log('err:', err)
    resdata.edu_msg = '教师教育经历更新失败!'
  }
}

const updateWork = async (data, tea_id, resdata) => {
  try {
    let work_temp = []
    for (let i = 0; i < data.length; i++) {
      work_temp.push([
        data[i].id,
        tea_id,
        dayjs(data[i].date[0]).format('YYYY-MMM-DD'),
        dayjs(data[i].date[1]).format('YYYY-MMM-DD'),
        // data[i].date[0] + '-01',
        // data[i].date[1] + '-01',
        data[i].location,
        data[i].content
      ])
    }

    // 删除数据
    const { rows } = await db.query('select * from Work where teacher_id=$1', [tea_id])
    for (const e of rows) {
      // 新数据中没有
      flag = false
      for (const e2 of work_temp) {
        if (e2[0] == e.id) {
          // 有
          flag = true
          break
        }
      }
      if (!flag) {
        await db.query('delete from Work where id=$1', [e.id])
      }
    }

    // 更新或插入
    for (let i = 0; i < work_temp.length; i++) {
      await db.query('CALL update_work($1,$2,$3,$4,$5,$6)', work_temp[i])
    }
  } catch (err) {
    console.log('err:', err)
    resdata.work_msg = '教师工作经历更新失败!'
  }
}

/**
 * 添加教师-详细
 */
router.post('/add/details', authMiddleware(), async (req, res) => {
  const id = req.id

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
        if (!isUndefined(tea_edu)) {
          tea_edu = tea_edu.tea_edu
          if (!isUndefined(tea_edu.length) && tea_edu.length != 0) {
            await insertEdu(tea_edu, tea_id)
          }
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
/**
 * 添加教师
 */
router.post('/add', authMiddleware(), async (req, res) => {
  const id = req.id
  const { tea_id, tea_name, tea_password } = req.body
  let resdata = { success: true }
  if (id === '00000000') {
    if (!isUndefined(tea_id) && !isUndefined(tea_name) && !isUndefined(tea_password)) {
      try {
        // 基本信息
        await insertTea(req, resdata)
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

// 更新教师
router.post('/edit', authMiddleware(), async (req, res) => {
  const id = req.id
  const { tea_id, tea_name, tea_password } = req.body
  let resdata = { success: true }

  if (id === '00000000') {
    if (!isUndefined(tea_id) && !isUndefined(tea_name) && !isUndefined(tea_password)) {
      try {
        // 基本信息
        await updateTea(req, resdata)

        // 家庭关系
        let { tea_familys } = req.body
        if (
          !isUndefined(tea_familys) &&
          !isUndefined(tea_familys.length) &&
          tea_familys.length != 0
        ) {
          await updateFam(tea_familys, tea_id)
        }

        // 奖惩记录
        let { tea_archive } = req.body

        if (
          !isUndefined(tea_archive) &&
          !isUndefined(tea_archive.length) &&
          tea_archive.length != 0
        ) {
          await updateArc(tea_archive, tea_id, resdata)
        }

        // 科研项目
        let { tea_research } = req.body
        if (
          !isUndefined(tea_research) &&
          !isUndefined(tea_research.length) &&
          tea_research.length != 0
        ) {
          await updateRes(tea_research, tea_id)
        }

        // 教育经历
        let { tea_edu } = req.body
        if (!isUndefined(tea_edu)) {
          tea_edu = tea_edu.tea_edu
          if (!isUndefined(tea_edu.length) && tea_edu.length != 0) {
            await updateEdu(tea_edu, tea_id)
          }
        }

        // 工作经历
        let { tea_work } = req.body
        if (!isUndefined(tea_work)) {
          tea_work = tea_work.tea_work
          await updateWork(tea_work, tea_id)
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
        message: '更新失败, 工号、姓名、密码不能为空'
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
