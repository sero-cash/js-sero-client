'use strict'

const core = require('../core.js')
const account = require('../account.js')

var seed = core.GetCZero().RandomU32()
var rnd = core.GetCZero().RandomU32()

var keys = account.NewKeys(seed)
var pkr = keys.GenPKr(rnd)

console.log('PKR-HEX: ' + pkr.toString('hex'))

console.log('PKR-BASE58: ' + pkr.ToBase58())

if (!keys.IsValidPKr(pkr)) {
  core.ReportError('invalid pkr')
}

if (!keys.IsMyPKr(pkr)) {
  core.ReportError('Is not my pkr')
}

if (core.NewBytesBufferFromBase58(pkr.ToBase58()).toString('hex') !== pkr.toString('hex')) {
  core.ReportError('Base58 decode error')
}
