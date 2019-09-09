const base58 = require('bs58')

let address = 'C7mxp1WZy6KnEb14JVdTfuDiAQn3foQgJuu3joCKwPS9v67stQxH3VtuPjWagstm4E5ABzfKVVtYc2CQfMqQ1ciMEqrjmbsy3CkNXFauVB3jQEMxTWwDRUgeKVZB6fJaC6i'

let buf = base58.decode(address)

if (buf.length === 96) {
  let hex = buf.toString('hex')
  console.log('0x' + hex)
} else {
  console.log('incorrect address format')
}
