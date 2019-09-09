const account = require('../account.js')
const tx = require('../tx.js')
const utils = require('../utils.js')

const seedStr = utils.ToBuffer('0xd31ac624f48d9f93dd09728956041659b5e0e574fc83c1ac35c78b20894f2b4b', 32).ToBase58()
const outStr = "[{\"Root\":\"0x763f7f5e16506128824178bf2ee855e35a4b93689e8e54ed1e3d03177da09917\",\"State\":{\"Num\":345,\"OS\":{\"Index\":384,\"OutCM\":null,\"Out_O\":null,\"Out_Z\":{\"AssetCM\":\"0x5545b6d57ef6a35b124963daa0dee992da5243e31eb0d99d8f66d0f1a13e9012\",\"EInfo\":\"0x04fc0547da3590767317c3719f7b89516f7afb01037ca09cefc0bd75b4dccb95cfff665a0028069289960dcf07b69928e8d3da06ad0249ba7fd2c31505f5eef96db8741382f68be2e34210be409a84ae67be5c4687ddef64c13bba278d5fbea9d69f1a335585c8544a3b3eac8e7812041a01d95326f8da65e588784cc70c1b5a4b5dd7d0f5921007aef4043ac515cadc864ac206b2902a04022603566a437deb3100fdc04b88eb249746631447cf25964fb8f32fb4314455efbc1ea7520865f52aa762629ab8eed99e0a7918918dfe186188ddf61d7fb3d855a64d71ff5c9688\",\"OutCM\":\"0x5d3ba6999629152264618694968cd18a7a4c7790e2c213498e99209c564039ab\",\"PKr\":\"0xfaf5e31e63cf54a81cb494e57719abf9e2af71fb52720a4ad476ce78006ac0af202f0329828102356f29597815773200b75775b6837bf8592e20eb4df75e73a9c01a79af111451f7f38f4c2f79f03772a9e09b31d5c7bf2ab37808835362c4a0\",\"Proof\":\"0x02902bbd460a55b0dbaf4a96848d0b24ef5f2faab6409b3d68dc77f8f32a96a41d0a450a6076693fd6bef7e4466e6f0533e18905c8fc656741e7d1faf2ae298dba7edb87ab8b1293900e3fac4bd8e47a09b1ee02cf7770965bf990f60c53f57a3c08032dcc4023c7aa706f8fd35c68119caa73d15e8ca1ff35cc9e69fcdd8e46d5120c\",\"RPK\":\"0xb74e284e16cc77659690cee346076701a1040539ce84e6af71292f0acd5a906d\"},\"RootCM\":\"0xe495fe6b43813719352a6256e826dfae9d61d32b28ce1814e0b6a60b9cb05009\"},\"TxHash\":\"0x91a5cc04f6af1803bd8a523fcf23bc845c42552bb7d6d0a49e347ef5070ba274\"}}]"

const seed = utils.ToBuffer(seedStr, 32)
const keys = account.NewKeys(seed)

const sk = keys.sk.toString('hex')
console.log(sk)

const tk = keys.tk.toString('hex')
console.log(tk)

const pk = keys.pk.toString('hex')
console.log(pk)
console.log(keys.pk.ToBase58())

tx.DecOut(
  outStr,
  keys.tk.ToBase58(),
  (err, content) => {
    if (err) {
      console.error(err)
    } else {
      console.log(content)
    }
  }
)
