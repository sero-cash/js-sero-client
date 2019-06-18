'use strict'
const path = require('path')
const os = require('os')

function OSType () {
  let ot
  let pf = os.platform()
  if (pf === 'darwin') {
    ot = 'darwin'
  } else if (pf === 'win32') {
    ot = 'windows'
  } else {
    ot = 'linux'
    let release = os.release()
    let end = release.indexOf('.')
    if (end > 0) {
      let v = release.substr(0, end)
      ot += v
    } else {
      ot += '3'
    }
  }
  return ot
}

function BinPath (type) {
  let baseDir = './tools'
  let czeroName = 'libczero.so'
  let tail = 'LINUX_AMD64_V4'
  let ldPath = 'LD_LIBRARY_PATH'
  let txName = 'tx'
  let split = ':'
  if (type.toLowerCase() === 'windows') {
    czeroName = 'libczero.dll'
    tail = 'WINDOWS_AMD64'
    ldPath = 'PATH'
    txName = 'tx.exe'
    split = ';'
  } else if (type.toLowerCase() === 'linux3') {
    tail = 'LINUX_AMD64_V3'
  } else if (type.toLowerCase() === 'darwin') {
    czeroName = 'libczero.dylib'
    tail = 'DARWIN_AMD64'
    ldPath = 'DYLD_LIBRARY_PATH'
  }
  var self = {}
  self.lib_dir = path.resolve(__dirname, baseDir + '/lib_' + tail)
  self.libczero_dir = path.resolve(self.lib_dir, czeroName)
  self.tx_sign_dir = path.resolve(__dirname, baseDir + '/lib_' + tail + '/' + txName)
  self.ld_path = ldPath
  self.split = split
  return self
}

var binPath = BinPath(OSType())

module.exports = {
  GetBinPath: () => {
    return binPath
  }
}
