const Router = require('express-promise-router')
const { isUndefined } = require('lodash')
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
const util = require('util')
var cron = require('node-cron')
const router = new Router()
const config = {
  host: '120.46.155.70',
  port: 22,
  username: 'root',
  password: 'qwerQWER228'
}
module.exports = router
const taskMap = {}
router.post('/', async (req, res) => {
  try {
    const { cron_value } = req.body
    console.log(taskMap)
    console.log(cron_value)
    let timestamp = Date.parse(new Date())
    const jobName = `job-${timestamp}`
    for (var key in taskMap) {
      const job = taskMap[key]
      console.log(job)
      job.stop()
    }
    console.log('任务全部终止....')
    //*/1 * * * *
    const task = cron.schedule(cron_value, async () => {
      console.log(cron_value)
      const SSH2Promise = require('ssh2-promise')

      const type = 'sql'
      const sshconfig = {
        host: '120.46.155.70',
        port: 22,
        username: 'omm',
        password: 'qwerQWER228'
      }
      const ssh2 = new SSH2Promise(config)
      await ssh2.exec('chown -R omm /home/omm/schedule/')

      try {
        const timestamp = Date.parse(new Date())
        const filepath = `/home/omm/schedule/schedule-${timestamp}.sql`
        const ssh = new SSH2Promise(sshconfig)
        console.log('你好')
        let cmd = `gs_dump -U akmoex -W AKmoex@123 -f ${filepath} -p 26000 teacherbase -F p\n`

        ssh.exec(cmd)

        //console.log(data)
      } catch (err) {
        console.log(err)
      }
    })
    taskMap[jobName] = task
    console.log(taskMap)
    res.send({
      message: '定时备份成功! ',
      success: true
    })
  } catch (err) {
    console.log(err)
  }
})
