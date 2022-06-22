const Router = require('express-promise-router')
const { isUndefined, remove } = require('lodash')
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
const util = require('util')
const format = require('pg-format')
const dayjs = require('dayjs')
const includes = require('../utils')
const { readFileSync } = require('fs')

const { Client } = require('ssh2')
const router = new Router()

module.exports = router
router.get('/', async (req, res) => {
  console.log('/backup....')
  const conn = new Client()
  console.log('你好')
  conn
    .on('ready', () => {
      console.log('Client :: ready')
      conn.shell((err, stream) => {
        if (err) throw err
        stream
          .on('close', () => {
            console.log('Stream :: close')
            conn.end()
          })
          .on('data', (data) => {
            console.log('OUTPUT: ' + data)
          })
        stream.write('su - omm \n')
        stream.write('cd /home/omm/backup \n')
        stream.write('ls \n')
        stream.write(
          'gs_dump -U akmoex -W AKmoex@123 -f /home/omm/backup/backup2.sql -p 26000 teacherbase -F p\n'
        )
        stream.write('ls \n')
      })
    })
    .connect({
      host: '120.46.155.70',
      port: 22,
      username: 'root',
      password: 'qwerQWER228'
    })
})
