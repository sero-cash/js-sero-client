const utils = require('./utils.js')
const core = require('./core.js')
const account = require('./account.js')
const szkAccount = require('./account_szk.js')
const tx = require('./tx.js')

function PK2PKr (pk, rnd) {
  if (utils.isSzk(pk)) {
    return szkAccount.NewKeys(undefined, undefined, undefined, pk).GenPKr(rnd)
  } else {
    return account.NewKeys(undefined, undefined, undefined, pk).GenPKr(rnd)
  }
}

module.exports = {
  Utils: utils,
  Czero: core.GetCZero(),
  Account: account,
  PK2PKr,
  SzkAccount: szkAccount,
  Tx: tx
}
