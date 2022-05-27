const { Pool, Client } = require('../openGauss-connector-nodejs/packages/pg')

/**
 * 测试用户: akmoex (sha256认证)
 *
 */
const config = {
  // 连接数据库
  host: '114.115.166.72', // 数据库主机名
  port: 26000, // 数据库端口
  user: 'akmoex', // 数据库用户名
  database: 'teacherbase', // 数据库名
  password: 'AKmoex@123' // 数据库用户密码
}

const pool = new Pool(config)

module.exports = {
  query: (text, params) => pool.query(text, params),
  select: (text, params) => pool.query(text, params),
  // 根据id查询出用户基本信息
  getProFileByID: (text, params) => pool.query(text, params),
  pool
}
