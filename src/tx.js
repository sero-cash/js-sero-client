'use strict'

const cmd = require('node-cmd')
const utils = require('./utils.js')

const OUTPUT_BEGIN = '[OUTPUT-BEGIN]'
const OUTPUT_END = '[OUTPUT-END]'

function CmdStr (tx, sk) {
  return `export ${utils.GetBinPath().ld_path}="${utils.GetBinPath().libczero_dir}:$${utils.GetBinPath().ld_path}"
${utils.GetBinPath().tx_sign_dir} -tx '${tx}' -sk '${sk}'
`
}

function SignTx (tx, sk, callback) {
  cmd.get(
    CmdStr(tx, sk),
    (err, data) => {
      if (err) {
        if (err.code === 127) {
          callback(new Error("cann't find the tx file"))
        } else {
          console.error(new Error('error code is: ' + err.code))
        }
      } else {
        var start = data.indexOf(OUTPUT_BEGIN)
        if (start <= 0) {
          callback(new Error('Can not find [OUTPUT-BEGIN]'), undefined)
        } else {
          start += OUTPUT_BEGIN.length + 1
          var end = data.indexOf(OUTPUT_END, start)
          if (end <= 0) {
            callback(new Error('Can not find [OUTPUT-END]'), undefined)
          } else {
            end = end - 1
            var content = data.substr(start, end - start)
            callback(undefined, content)
          }
        }
      }
    }
  )
}

module.exports = {
  SignTx
}
