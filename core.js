'use strict'

const ffi = require('ffi')
const ref = require('ref')
const utils = require('./utils.js')
const base58 = require('bs58')

const cVoid = ref.types.void
const cUchar = ref.types.uchar
const cChar = ref.types.char
const cInt = ref.types.int32
const cBytes = ref.refType(cUchar)

function NewBytesBuffer (len) {
  var buf = utils.AllocBuffer(len)
  buf.type = cBytes
  return buf
}

function NewBytesBufferFromBase58 (str) {
  var bufDec = base58.decode(str)
  var buf = utils.AllocBuffer(bufDec.length, bufDec)
  buf.type = cBytes
  return buf
}

function InitCZero () {
  if (czero === undefined) {
    var p = utils.GetBinPath()
    czero = ffi.Library(
      p.libczero_dir,
      {
        'superzk_init_params_no_circuit': [cVoid, []],
        'superzk_random_fr': [cVoid, [cBytes]],
        'superzk_seed2sk': [cVoid, [cBytes, cBytes]],
        'superzk_sk2tk': [cInt, [cBytes, cBytes]],
        'czero_tk2pk': [cInt, [cBytes, cBytes]],
        'czero_pk2pkr': [cInt, [cBytes, cBytes, cBytes]],
        'superzk_tk2pk': [cInt, [cBytes, cBytes]],
        'superzk_pk2pkr': [cInt, [cBytes, cBytes, cBytes]],
        'superzk_pk_valid': [cInt, [cBytes]],
        'superzk_pkr_valid': [cInt, [cBytes]],
        'czero_ismy_pkr': [cInt, [cBytes, cBytes]],
        'superzk_my_pkr': [cInt, [cBytes, cBytes]]
      }
    )
    czero.p = p
    czero.superzk_init_params_no_circuit()
    czero.RandomU32 = function () {
      var buf = NewBytesBuffer(32)
      czero.superzk_random_fr(buf)
      return buf
    }
  } else {
    return czero
  }
  return czero
}

var czero = InitCZero()

function GetCZero () {
  return czero
}

module.exports = {
  GetCZero,
  NewBytesBuffer,
  NewBytesBufferFromBase58
}
