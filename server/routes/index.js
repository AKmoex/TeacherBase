// ./routes/index.js
const user = require('./user')
const department = require('./department')
const teacher = require('./teacher')
module.exports = (app) => {
  app.use('/api/user', user)
  app.use('/api/department', department)
  app.use('/api/teacher', teacher)
  // etc..
}
