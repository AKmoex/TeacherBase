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
      const { rows } = await db.select('SELECT id FROM teacher where id=$1', [id])
      req.id = rows[0].id
      await next()
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
  }
}
