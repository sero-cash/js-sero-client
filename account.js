'use strict'

const core = require('./core.js')
const utils = require('./utils.js')

/******************
 * seed : 32 bytes Buffer
 * pk : 64 bytes Buffer
 * seed -> sk(zsk,vsk) -> tk(ZPK,vsk) -> pk(ZPK,VPK) -> pkr(ZPKr,VPKr,BASEr)
******************/
function NewKeys (seed, sk, tk, pk) {
  var count = 0
  if (seed) {
    count++
  }
  if (sk) {
    count++
  }
  if (tk) {
    count++
  }
  if (pk) {
    count++
  }
  if (count !== 1) {
    core.ReportError('Can only supply one param')
  }
  var keys = {}
  if (seed) {
    keys.seed = utils.ToBuffer(seed, 32)
  }

  if (sk) {
    keys.sk = utils.ToBuffer(sk, 64)
  } else if (keys.seed) {
    keys.sk = core.NewBytesBuffer(64)
    core.GetCZero().superzk_seed2sk(keys.seed, keys.sk)
  }

  if (tk) {
    keys.tk = utils.ToBuffer(tk, 64)
  } else if (keys.sk) {
    keys.tk = core.NewBytesBuffer(64)
    core.GetCZero().superzk_sk2tk(keys.sk, keys.tk)
  }

  if (pk) {
    keys.pk = utils.ToBuffer(pk, 64)
    if (utils.isSzk(pk)) {
      core.ReportError('pk is not czero')
    }
  } else if (keys.tk) {
    keys.pk = core.NewBytesBuffer(64)
    core.GetCZero().czero_tk2pk(keys.tk, keys.pk)
  }
  keys.GenPKr = function (rnd) {
    rnd = utils.ToBuffer(rnd, 32)
    var pkr = core.NewBytesBuffer(96)
    core.GetCZero().czero_pk2pkr(keys.pk, rnd, pkr)
    return pkr
  }
  keys.IsValidPKr = function (pkr) {
    pkr = utils.ToBuffer(pkr, 96)
    if (utils.isSzk(pkr)) {
      return false
    }
    if (core.GetCZero().superzk_pkr_valid(pkr) === 0) {
      return true
    } else {
      return false
    }
  }
  keys.IsMyPKr = function (pkr) {
    pkr = utils.ToBuffer(pkr, 96)
    if (utils.isSzk(pkr)) {
      return false
    }
    let ret = core.GetCZero().czero_ismy_pkr(keys.tk,pkr)
    if (ret === 0) {
      return true
    } else {
      return false
    }
  }
  return keys
}

module.exports = {
  NewKeys
}
