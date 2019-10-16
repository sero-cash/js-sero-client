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
    utils.ReportError('Can only supply one param')
  }
  var keys = {}
  if (seed) {
    keys.seed = utils.ToBuffer(seed, 32)
  }

  if (sk) {
    keys.sk = utils.ToBuffer(sk, 64)
    if (!utils.isSzk(keys.sk)) {
      utils.ReportError('pk is not szk')
    }
  } else if (keys.seed) {
    var s = core.NewBytesBuffer(64)
    core.GetCZero().superzk_seed2sk(keys.seed, s)
    keys.sk = utils.setSzk(s)
  }

  if (tk) {
    keys.tk = utils.ToBuffer(tk, 64)
    if (!utils.isSzk(keys.tk)) {
      utils.ReportError('pk is not szk')
    }
  } else if (keys.sk) {
    var t = core.NewBytesBuffer(64)
    var s = utils.clearSzk(keys.sk)
    core.GetCZero().superzk_sk2tk(s, t)
    keys.tk = utils.setSzk(t)
  }

  if (pk) {
    keys.pk = utils.ToBuffer(pk, 64)
    if (!utils.isSzk(keys.pk)) {
      utils.ReportError('pk is not szk')
    }
  } else if (keys.tk) {
    var p = core.NewBytesBuffer(64)
    var t = utils.clearSzk(keys.tk)
    core.GetCZero().superzk_tk2pk(t, p)
    keys.pk = utils.setSzk(p)
  }

  keys.GenPKr = function (rnd) {
    rnd = utils.ToBuffer(rnd, 32)
    var pkr = core.NewBytesBuffer(96)
    var p = utils.clearSzk(keys.pk)
    core.GetCZero().superzk_pk2pkr(p, rnd, pkr)
    pkr = utils.setSzk(pkr)
    return pkr
  }
  keys.IsValidPKr = function (pkr) {
    pkr = utils.ToBuffer(pkr, 96)
    if (!utils.isSzk(pkr)) {
      return false
    }
    pkr = utils.clearSzk(pkr)
    if (core.GetCZero().superzk_pkr_valid(pkr) === 0) {
      return true
    } else {
      return false
    }
  }
  keys.IsMyPKr = function (pkr) {
    pkr = utils.ToBuffer(pkr, 96)
    if (!utils.isSzk(pkr)) {
      return false
    }
    pkr = utils.clearSzk(pkr)
    var t = utils.clearSzk(keys.tk)
    var ret = core.GetCZero().superzk_my_pkr(t, pkr)
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
