'use strict'

const utils = require('./utils.js')
const cp = require('child_process')

function SignTx (tx, sk, callback) {
  sk = utils.ToHex(sk, 64)
  let env = {}
  let content = ''
  let isReturned = false
  let isWrited = false
  let p = utils.GetBinPath()
  env[p.ld_path] = p.lib_dir
  let sub = cp.execFile(
    utils.GetBinPath().tx_sign_dir,
    ['--method', 'sign'],
    { env: env }
  )
  function Return (err, data) {
    if (isReturned) {
      return
    } else {
      isReturned = true
    }
    callback(err, data)
  }
  sub.stdout.on('data', (data) => {
    if (!isWrited) {
      isWrited = true
      sub.stdin.write(sk + '\n' + tx + '\n', (err) => {
        if (err) {
          Return(err, undefined)
        }
      })
    }
    content += data
  })
  sub.stderr.on('data', (data) => {
  })
  sub.on('error', (err) => {
    Return(err, undefined)
  })
  sub.on('exit', (code) => {
    if (code !== 0) {
      Return(new Error('Exit Code: ' + code), undefined)
    } else {
      utils.ParseResult(content, Return)
    }
  })
}

function DecOut (out, tk, callback) {
  tk = utils.ToHex(tk, 64)
  let env = {}
  let content = ''
  let isReturned = false
  let isWrited = false
  let p = utils.GetBinPath()
  env[p.ld_path] = p.lib_dir
  let sub = cp.execFile(
    utils.GetBinPath().tx_sign_dir,
    ['--method', 'dec'],
    { env: env }
  )
  function Return (err, data) {
    if (isReturned) {
      return
    } else {
      isReturned = true
    }
    callback(err, data)
  }
  sub.stdout.on('data', (data) => {
    if (!isWrited) {
      isWrited = true
      sub.stdin.write(tk + '\n' + out + '\n', (err) => {
        if (err) {
          Return(err, undefined)
        }
      })
    }
    content += data
  })
  sub.stderr.on('data', (data) => {
  })
  sub.on('error', (err) => {
    Return(err, undefined)
  })
  sub.on('exit', (code) => {
    if (code !== 0) {
      Return(new Error('Exit Code: ' + code), undefined)
    } else {
      utils.ParseResult(content, Return)
    }
  })
}

module.exports = {
  SignTx,
  DecOut
}
