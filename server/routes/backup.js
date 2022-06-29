const Router = require('express-promise-router')
const { isUndefined, remove, set } = require('lodash')
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
const format = require('pg-format')
const dayjs = require('dayjs')
const includes = require('../utils')
const { readFileSync } = require('fs')
const path = require('path')
const { Client } = require('ssh2')
const router = new Router()
const remoteDir = '/home/omm/backup'
const curPath = path.join('../static/backup')
const SSH2Promise = require('ssh2-promise')
const stream = require('stream')
const util = require('util')
const multer = require('multer')

module.exports = router
const sshconfig = {
  host: '120.46.155.70',
  port: 22,
  username: 'root',
  password: 'qwerQWER228'
}
// router.get('/', async (req, res) => {
//   console.log('/backup....')
//   const conn = new Client()
//   conn
//     .on('ready', () => {
//       conn.shell((err, stream) => {
//         if (err) throw err
//         stream
//           .on('close', () => {
//             console.log('Stream :: close')
//             conn.end()
//           })
//           .on('data', (data) => {
//             console.log('OUTPUT: ' + data)
//           })
//         stream.write('su - omm \n')
//         stream.write('cd /home/omm/backup \n')
//         stream.write('ls \n')
//         stream.write(
//           'gs_dump -U akmoex -W AKmoex@123 -f /home/omm/backup/backup4.sql -p 26000 teacherbase -F p\n'
//         )
//         stream.write('ls \n')
//       })

//       conn.sftp((err, sftp) => {
//         if (err) throw err
//         sftp.readdir(remoteDir, (err, list) => {
//           if (err) throw err
//           let count = list.length
//           list.forEach((item) => {
//             let remoteFile = remoteDir + '/' + item.filename
//             let localFile = curPath + '/' + item.filename
//             console.log('Downloading ' + remoteFile)
//             sftp.fastGet(remoteFile, localFile, (err) => {
//               if (err) throw err
//               console.log('Downloaded to ' + localFile)
//               count--
//               if (count <= 0) {
//                 conn.end()
//               }
//             })
//           })
//         })
//       })
//     })
//     .connect({
//       host: '120.46.155.70',
//       port: 22,
//       username: 'root',
//       password: 'qwerQWER228'
//     })
// })

router.get('/', async (req, res) => {
  const type = req.query.type
  console.log('/backup....')
  const sshconfig = {
    host: '120.46.155.70',
    port: 22,
    username: 'omm',
    password: 'qwerQWER228'
  }
  const ssh = new SSH2Promise(sshconfig)
  const sftp = ssh.sftp()
  //res.download(path.join('../static/backup/', 'backup2.sql'))

  try {
    const timestamp = Date.parse(new Date())
    const filepath = `/home/omm/backup/backup-${timestamp}.sql`
    const localFile = path.join('../static/backup/', `backup-${timestamp}.${type}`)

    let cmd
    if (type == 'sql') {
      cmd = `gs_dump -U akmoex -W AKmoex@123 -f ${filepath} -p 26000 teacherbase -F p\n`
    } else if (type == 'tar') {
      cmd = `gs_dump -U akmoex -W AKmoex@123 -f ${filepath} -p 26000 teacherbase -F t\n`
    }
    const data = await ssh.exec(cmd)

    console.log(data) //ubuntu

    await sftp.fastGet(filepath, localFile)
    await res.set({
      'Content-type': 'application/octet-stream',

      'Content-Disposition': 'attachment;filename=' + encodeURI(`backup-${timestamp}.${type}`)
      //'Content-Length': stats.size
    })

    res.download(localFile)
  } catch (err) {
    console.log(err)
  }
})
router.get('/v', async (req, res) => {
  const sshconfig = {
    host: '120.46.155.70',
    port: 22,
    username: 'omm',
    password: 'qwerQWER228'
  }
  const ssh = new SSH2Promise(sshconfig)
  const sftp = ssh.sftp()
  //res.download(path.join('../static/backup/', 'backup2.sql'))

  try {
    var data = await ssh.exec(
      'gsql -d teacherbase -U akmoex -p 26000 -W AKmoex@123 -f /home/omm/scripts/getDBInfo.sql\n'
    )

    console.log(data) //ubuntu
    // var stream = await sftp.createReadStream('/home/omm/backup/backup2.sql')
    // console.log(stream)
    // res.set({
    //   'Content-type': 'application/octet-stream',
    //   'Content-Disposition': 'attachment;filename=' + encodeURI(fileName),
    //   'Content-Length': stats.size
    // })
    // stream.pipe(res)
  } catch (err) {
    console.log(err)
  }

  //console.log(typeof stream)
})

router.get('/system', async (req, res) => {
  const ssh = new SSH2Promise(sshconfig)

  try {
    const data = await ssh.exec('lscpu\n')
    const d = data.split('\n')
    const sys = []
    sys.push({
      label: '架构',
      value: d[0].split(' ').pop()
    })
    sys.push({
      label: 'CPU数',
      value: d[4].split(' ').pop()
    })
    sys.push({
      label: '频率',
      value: d[15].split(' ').pop()
    })
    let data2 = await ssh.exec('free -h\n')
    data2 = data2.replace(/ +/g, ' ')
    const d2 = data2.split(' ')

    sys.push({
      label: '总内存',
      value: d2[7]
    })
    sys.push({
      label: '内存已使用',
      value: d2[8]
    })
    sys.push({
      label: '空闲内存',
      value: d2[9]
    })

    let data3 = await ssh.exec('lsblk\n')
    data3 = data3.replace(/ +/g, ' ')
    const d3 = data3.split(' ')
    sys.push({
      label: '硬盘大小',
      value: d3[9]
    })

    let data4 = await ssh.exec('df -hT\n')
    let da4 = data4.split('\n')
    let s4 = da4[5].replace(/ +/g, ' ')
    let d4 = s4.split(' ')
    let flag1 = 0
    let flag2 = 0
    for (let i = 0; i < d4.length; i++) {
      if (d4[i] === '/dev/vda1') {
        flag1 = i + 3
        flag2 = i + 4
        break
      }
    }
    sys.push({
      label: '硬盘已使用',
      value: d4[flag1]
    })
    sys.push({
      label: '空闲硬盘',
      value: d4[flag2]
    })

    res.send({
      sys: sys,
      success: true
    })
  } catch (err) {
    console.log(err)
  }

  //console.log(typeof stream)
})

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/../../static')
  },

  filename: function (req, file, cb) {
    var fileFormat = file.originalname.split('.')
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1])
  }
})
const upload = multer({
  storage: storage
})
router.post('/restore', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    file.url = '/static/' + file.filename
    if (file.filename.split('.').pop() == 'sql') {
      const ssh = new SSH2Promise(sshconfig)
      const sftp = ssh.sftp()
      await sftp.fastPut(file.path, `/home/omm/restore/${file.filename}`)
      const config = {
        host: '120.46.155.70',
        port: 22,
        username: 'omm',
        password: 'qwerQWER228'
      }

      await ssh.exec('chown -R omm /home/omm/\n')
      const ssh2 = new SSH2Promise(config)

      const dropCmd = 'gsql -d postgres -p 26000  -f /home/omm/scripts/drop.sql'
      const createCmd = 'gsql -d postgres -p 26000  -f /home/omm/scripts/create.sql'
      const restoreCmd = `gsql -p 26000 -f /home/omm/restore/${file.filename} teacherbase`
      //console.log(restoreCmd)
      var data = await ssh2.exec(`${dropCmd}\n${createCmd}\n${restoreCmd}\n`)
      // var data = await ssh2.exec(`${restoreCmd}\n`)

      console.log(data) //

      res.send(file)
    } else if (file.filename.split('.').pop() == 'tar') {
      const ssh = new SSH2Promise(sshconfig)
      const sftp = ssh.sftp()
      await sftp.fastPut(file.path, `/home/omm/restore/${file.filename}`)
      const config = {
        host: '120.46.155.70',
        port: 22,
        username: 'omm',
        password: 'qwerQWER228'
      }
      await ssh.exec('chown -R omm /home/omm/\n')

      const ssh2 = new SSH2Promise(config)

      const dropCmd = 'gsql -d postgres -p 26000  -f /home/omm/scripts/drop.sql'
      const createCmd = 'gsql -d postgres -p 26000  -f /home/omm/scripts/create.sql'
      console.log(file.filename)
      const restoreCmd = `gs_restore -p 26000  /home/omm/restore/${file.filename} -d teacherbase -U akmoex -W AKmoex@123`
      //console.log(restoreCmd)
      var data = await ssh2.exec(`${dropCmd}\n${createCmd}\n${restoreCmd}\n`)
      // var data = await ssh2.exec(`${restoreCmd}\n`)

      console.log(data) //
      res.send(file)
    }
  } catch (err) {}
  // f(file)
  //res.send(file)
})
