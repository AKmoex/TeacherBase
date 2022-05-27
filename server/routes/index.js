// ./routes/index.js
const user = require('./user')
const department = require('./department')
module.exports = (app) => {
  app.use('/api/user', user)
  app.use('/api/department', department)
  // etc..
}
