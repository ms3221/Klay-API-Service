
require('dotenv').config();
const Caver = require("caver-js");
const caver = new Caver("https://api.baobab.klaytn.net:8651/");



module.exports ={
    sendKlay : async (req,res)=>{

        let to = req.body.toAddress;
        let value = req.body.amount;
        let balance;

         balance = await caver.klay.getBalance(process.env.ADDRESS);
         balance = caver.utils.fromPeb(balance, "KLAY")
        
         //계정이 존재하는지 확인하는거죠!! 만약 있으면 true 없으면 false
         let check = await caver.klay.accountCreated(to);
        console.log(check);

        if(check && balance > value){

            const keyring = caver.wallet.keyring.createFromPrivateKey(process.env.PRIVATE_KEY);
            const valueTransfer = caver.transaction.valueTransfer.create({
                from:keyring.address,
                to: '0x06A09448Ce035F05134EFCD61F66a84a2f68066b',
                value: caver.utils.toPeb(`${value}`, 'KLAY'),
                gas: 30000,
            });
            console.log(kerying);
            await Transfer.sign(keyring)
        
            const receipt = await caver.rpc.klay.sendRawTransaction(valueTransfer)
            console.log(receipt);
            res.send(receipt);
            
           }else{
               res.status(400).send('금액이 초과했거나 계정이 없을 수 있어요 확인해주세요!');
           }
    }
}