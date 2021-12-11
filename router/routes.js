

require('dotenv').config();
const express = require('express');
const router  = express.Router();

//controller
const {version}  = require('../controller/version');
const {createAccount,accountCheck,accountBalance} = require('../controller/account');
const {sendKlay} = require('../controller/send');


const Caver = require("caver-js");
const caver = new Caver("https://api.baobab.klaytn.net:8651/");

//최신 블럭이 몇번인지 확인하는 메서드입ㄴ다. 
router.get('/block', async (req, res)=>{
   let block = await caver.klay.getBlockNumber();
   
   if(block){
       res.send('성공 block'+block);
   }
})

router.get('/getTransaction',(req,res)=>{
    console.log(1);
    caver.klay.getTransaction('0x2a32210a6d9993a8bad72af1f0debbee3892a58bfb2aa51514a5a2906b8f3232').then(console.log);
})


router.get('/version', version);
router.get('/createAccount', createAccount);
router.get('/accountCheck', accountCheck);
router.get('/balance', accountBalance);
router.post('/sendKlay',sendKlay);


module.exports = router;