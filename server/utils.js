// module.exports = (arr1, arr2) => {
//   return arr2.every((val) => arr1.includes(val))
// }
// //export { includes }
const crypto = require('crypto')
const includes = (arr1, arr2) => {
  return arr2.every((val) => arr1.includes(val))
}
const md5Crypto = (password) => {
  const hash = crypto.createHash('md5')
  hash.update(password)

  const md5Password = hash.digest('hex')
  return md5Password
}
module.exports = {
  md5Crypto,
  includes
}
