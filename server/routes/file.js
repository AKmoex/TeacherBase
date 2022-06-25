const Router = require('express-promise-router')
const { isUndefined, remove } = require('lodash')
const db = require('../db')
const authMiddleware = require('../middlewares/auth')
const util = require('util')
const multer = require('multer')
const router = new Router()
var AdmZip = require('adm-zip')

module.exports = router
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/../../static')
  },

  filename: function (req, file, cb) {
    var fileFormat = file.originalname.split('.')
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1])
  }
})

const f = (file) => {
  // reading archives
  var zip = new AdmZip(file.path)
  var zipEntries = zip.getEntries() // an array of ZipEntry records

  zipEntries.forEach(function (zipEntry) {
    console.log(zipEntry.toString()) // outputs zip entries information
    if (zipEntry.entryName == 'my_file.txt') {
      console.log(zipEntry.getData().toString('utf8'))
    }
  })
  // outputs the content of some_folder/my_file.txt
  console.log(zip.readAsText('some_folder/my_file.txt'))
  // extracts the specified file to the specified location
  zip.extractEntryTo(
    /*entry name*/ 'some_folder/my_file.txt',
    /*target path*/ '/home/me/tempfolder',
    /*maintainEntryPath*/ false,
    /*overwrite*/ true
  )
  // extracts everything
  zip.extractAllTo(/*target path*/ '/home/me/zipcontent/', /*overwrite*/ true)
}

const upload = multer({
  storage: storage
})
router.post('/photo', upload.single('file'), async (req, res) => {
  const file = req.file
  file.url = '/static/' + file.filename
  console.log(file)
  res.send(file)
})

router.post('/zip', upload.single('file'), async (req, res) => {
  const file = req.file
  file.url = '/static/' + file.filename
  console.log(file)
  // f(file)
  //res.send(file)
})
