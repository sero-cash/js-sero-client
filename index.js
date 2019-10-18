const utils = require('./utils.js')
const core = require('./core.js')
const account = require('./account.js')
const szkAccount = require('./account_szk.js')
const tx = require('./tx.js')

function NewKeysBySk (sk) {
  if (utils.isSzk(sk)) {
    return szkAccount.NewKeys(undefined, sk)
  } else {
    return account.NewKeys(undefined, sk)
  }
}

function NewKeysByTk (tk) {
  if (utils.isSzk(tk)) {
    return szkAccount.NewKeys(undefined, undefined, tk)
  } else {
    return account.NewKeys(undefined, undefined, tk)
  }
}

function NewKeysByPK (pk) {
  if (utils.isSzk(pk)) {
    return szkAccount.NewKeys(undefined, undefined, undefined, pk)
  } else {
    return account.NewKeys(undefined, undefined, undefined, pk)
  }
}

module.exports = {
  Utils: utils,
  Czero: core.GetCZero(),
  Account: account,
  SzkAccount: szkAccount,
  NewKeysBySk,
  NewKeysByTk,
  NewKeysByPK,
  Tx: tx
}
