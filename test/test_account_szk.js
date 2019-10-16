'use strict'

const core = require('../core.js')
const utils = require('../utils.js')
const account = require('../account_szk.js')

var seedTemp = '0xec8bad429641ff7cc980a1bd4f69a57302f53b35941edf3cc459640b1ab03d1f'

var seed = utils.ToBuffer(seedTemp, 32)
var rnd = core.GetCZero().RandomU32()

var keys = account.NewKeys(seed)

if (!utils.isSzk(keys.pk)) {
  core.ReportError('pk error')
}

var pkr = keys.GenPKr(rnd)

if (!utils.isSzk(pkr)) {
  core.ReportError('pkr error')
}

console.log('SEED-HEX: ' + keys.seed.toString('hex'))
console.log('SK-HEX: ' + keys.sk.toString('hex'))

console.log('TK-HEX: ' + keys.tk.toString('hex'))
console.log('TK-BASE58: ' + keys.tk.ToBase58())

console.log('PK-HEX: ' + keys.pk.toString('hex'))
console.log('PK-BASE58: ' + keys.pk.ToBase58())

console.log('rnd-HEX: ' + rnd.toString('hex'))

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
