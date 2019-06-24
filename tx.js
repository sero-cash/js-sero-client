'use strict'

const utils = require('./utils.js')
const cp = require('child_process')

const OUTPUT_BEGIN = '[OUTPUT-BEGIN]'

function SignTx (tx, sk, callback) {
  let env = {}
  let content = ''
  let isReturned = false
  let isWrited = false
  let p = utils.GetBinPath()
  env[p.ld_path] = p.lib_dir
  let sub = cp.execFile(
    utils.GetBinPath().tx_sign_dir,
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
      var start = content.indexOf(OUTPUT_BEGIN)
      if (start <= 0) {
        Return(new Error('Can not find [OUTPUT-BEGIN]'), undefined)
      } else {
        start += OUTPUT_BEGIN.length + 1
        var end = content.indexOf('\n', start)
        if (end <= 0) {
          Return(new Error('Can not find [OUTPUT-END]'), undefined)
        } else {
          var data = content.substr(start, end - start)
          Return(undefined, data)
        }
      }
    }
  })
}

module.exports = {
  SignTx
}
