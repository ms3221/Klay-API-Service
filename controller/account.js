require('dotenv').config();
const Caver = require("caver-js");
const caver = new Caver("https://api.baobab.klaytn.net:8651/");


module.exports ={
    createAccount: async(req,res)=>{
        const account = await caver.klay.accounts.create();
        console.log(account);
        const create = await caver.klay.accounts.wallet.add(account);
        res.json(create);
    },
    accountCheck: (req,res)=>{
        caver.klay.getAccount('0x5f77953Ef9785A14C8faA70d88A77D3D7315Deb4').then(console.log);
    },
    accountBalance : (req,res)=>{
        caver.klay.getBalance(process.env.ADDRESS).then((balance) => {
            console.log(balance+'peb');
            console.log(caver.utils.fromPeb(balance, "KLAY"));
            res.send(caver.utils.fromPeb(balance, "KLAY") + "KLAY");
          });
    }
    
}

// test.js



// test.js
// const Caver = require('caver-js')
// const caver = new Caver('https://your.en.url:8651/')

// async function testFunction() {
//     // Create a keyring from a private key
//     const keyringFromPrivateKey = caver.wallet.keyring.createFromPrivateKey('0x{private key}')
//     console.log(keyringFromPrivateKey)
// }   

// testFunction()