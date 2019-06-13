const core = require('./core.js')
const account = require('./account.js')
const tx = require('./tx.js')

module.exports = {
  Init: (type) => {
    core.InitCZero(type)
  },
  Account: account,
  Tx: tx
}
