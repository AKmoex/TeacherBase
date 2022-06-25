module.exports = () => {
  const jwt = require('jsonwebtoken')
  const db = require('../db')
  return async (req, res, next) => {
    try {
      // 取出token
      const token = String(req.headers.authorization).split(' ').pop()
      // 解析
      const { id } = jwt.verify(token, process.env.jwtSecret)
      // 用token查询数据
      const { rows } = await db.query('SELECT * FROM TUser where teacher_id=$1', [id])
      req.id = rows[0].teacher_id
      req.role = rows[0].role
      await next()
    } catch (err) {
      console.log(err)
      res.status(401).send({
        data: {
          isLogin: false
        },
        errorCode: '401',
        errorMessage: '请先登录！',
        success: true
      })
    }
  }
}
