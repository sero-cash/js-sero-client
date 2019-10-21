'use strict'
const path = require('path')
const os = require('os')
const base58 = require('bs58')

function ReportError (msg) {
  throw new Error(msg || 'Assertion failed')
}


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
  let czeroName = 'libsuperzk.so'
  let tail = 'LINUX_AMD64_V4'
  let ldPath = 'LD_LIBRARY_PATH'
  let txName = 'tx'
  let split = ':'
  if (type.toLowerCase() === 'windows') {
    czeroName = 'libsuperzk.dll'
    tail = 'WINDOWS_AMD64'
    ldPath = 'PATH'
    txName = 'tx.exe'
    split = ';'
  } else if (type.toLowerCase() === 'linux3') {
    tail = 'LINUX_AMD64_V3'
  } else if (type.toLowerCase() === 'darwin') {
    czeroName = 'libsuperzk.dylib'
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

function AllocBuffer (len, data, dec) {
  let buf = Buffer.alloc(len, data, dec)
  buf.ToBase58 = function () {
    return base58.encode(buf)
  }
  return buf
}

function FromBuffer (data) {
  let buf = Buffer.from(data)
  buf.ToBase58 = function () {
    return base58.encode(buf)
  }
  return buf
}

function ToBuffer (str, len) {
  if (typeof (str) === 'string') {
    if (str[0] === '0' && str[1] === 'x') {
      if (str.length - 2 === len * 2) {
        return AllocBuffer(len, str.substr(2), 'hex')
      } else {
        ReportError('ToBuffer is not match the length: ' + str)
      }
      return str
    } else {
      if (str.length === len * 2) {
        return AllocBuffer(len, str, 'hex')
      } else {
        let buf = base58.decode(str)
        if (buf.length === len) {
          return AllocBuffer(len, buf)
        } else {
          ReportError('ToBuffer is not match the length: ' + str)
        }
      }
    }
  } else {
    if (str.length === len) {
      return str
    } else {
      ReportError('ToBuffer is not match the length: ' + str)
    }
  }
}

function ToHex (str, len) {
  let buf = ToBuffer(str, len)
  return buf.toString('hex')
}

const OUTPUT_BEGIN = '[OUTPUT-BEGIN]'
const OUTPUT_ERROR = 'ERROR:'

function ParseResult (content, cb) {
  var start = content.indexOf(OUTPUT_BEGIN)
  if (start <= 0) {
    cb(new Error('Can not find [OUTPUT-BEGIN]'), undefined)
  } else {
    start += OUTPUT_BEGIN.length + 1
    if (content.indexOf(OUTPUT_ERROR, start) === start) {
      start += OUTPUT_ERROR.length + 1
      var data = content.substr(start, content.length - start)
      cb(new Error(data), undefined)
    } else {
      var end = content.indexOf('\n', start)
      if (end <= 0) {
        cb(new Error('Can not find [OUTPUT-END]'), undefined)
      } else {
        var d = content.substr(start, end - start)
        cb(undefined, d)
      }
    }
  }
}

function isSzk (buf) {
  var hi = buf[buf.length - 1]
  if ((hi & 0x40) !== 0x0) {
    return true
  } else {
    return false
  }
}

function setSzk (buf) {
  var ret = FromBuffer(buf)
  ret[ret.length - 1] |= 0x40
  return ret
}

function clearSzk (buf) {
  var ret = FromBuffer(buf)
  ret[buf.length - 1] &= 0xbf
  return ret
}

module.exports = {
  GetBinPath: () => {
    return binPath
  },
  AllocBuffer,
  FromBuffer,
  ToBuffer,
  ToHex,
  ParseResult,
  isSzk,
  setSzk,
  clearSzk,
  ReportError
}
