// ./routes/index.js
const user = require('./user')
const department = require('./department')
const teacher = require('./teacher')
const file = require('./file')
const research = require('./research')
const archive = require('./archive')
const backup = require('./backup')
const welcome = require('./welcome')
const schedule = require('./schedule')

module.exports = (app) => {
  app.use('/api/user', user)
  app.use('/api/department', department)
  app.use('/api/teacher', teacher)
  app.use('/api/file', file)
  app.use('/api/research', research)
  app.use('/api/archive', archive)
  app.use('/api/backup', backup)
  app.use('/api/welcome', welcome)
  app.use('/api/schedule', schedule)
  // etc..
}
