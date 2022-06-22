// ./routes/index.js
const user = require('./user')
const department = require('./department')
const teacher = require('./teacher')
const file = require('./file')
const title = require('./title')
const research = require('./research')
module.exports = (app) => {
  app.use('/api/user', user)
  app.use('/api/department', department)
  app.use('/api/teacher', teacher)
  app.use('/api/title', title)
  app.use('/api/file', file)
  app.use('/api/research', research)
  // etc..
}
