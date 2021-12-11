

require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT
const router = require('./router/routes');
const Caver = require("caver-js");
const caver = new Caver("https://api.baobab.klaytn.net:8651/");



app.use(express.json());
app.use(express.urlencoded({ extended: false }));




app.get('/version',async (req, res) => {
    const version = await caver.rpc.klay.getClientVersion();
    res.send(version);
})


//계정만들기 
app.get('/createAccount', async(req,res)=>{
    //계정을 만든다. 
    const account = await caver.klay.accounts.create();
    console.log(account);

    //만든계정을 함수의 인자로 넣어줘서 테스트넷에 올린다.
    const create = await caver.klay.accounts.wallet.add(account);
    res.json(create);
})


//계정의 정보를 가져오는 함수 
app.get('/getAccount', async (req,res)=>{
 let getAccount =  await caver.klay.getAccount('0x5f77953Ef9785A14C8faA70d88A77D3D7315Deb4');
 console.log(getAccount);
 res.send(getAccount)
})

app.get('/existAccount',async(req,res)=>{
    let exist = await caver.klay.accountCreated('0x5f77953Ef9785A14C8faA70d88A77D3D7315Deb4')
    console.log(exist);
    res.send(exist);
})


//가장최신의 블럭번호를 알아보자
app.get('/block', async (req, res)=>{
    let block = await caver.klay.getBlockNumber();
    if(block){
        res.send('성공 block'+block);
    }
 })


 app.get('/balance',async (req,res)=>{
    balance = await caver.klay.getBalance('0x06A09448Ce035F05134EFCD61F66a84a2f68066b');
    balance = caver.utils.fromPeb(balance, "KLAY")
    res.send(balance+'klay');
 })


// 클레이를 전송하는 함수 
 app.post('/sendKlay',async (req,res)=>{

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

        console.log(valueTransfer);
    
       const signed = await valueTransfer.sign(keyring)

       console.log(signed);
    
        const receipt = await caver.rpc.klay.sendRawTransaction(signed);
        console.log(receipt);
        res.send(receipt);
        
       }else{
           res.status(400).send('금액이 초과했거나 계정이 없을 수 있어요 확인해주세요!');
       }
})


//caver.js를 이용해서 트랜잭션을 확인하는 메서드 
app.get('/getTransaction',(req,res)=>{
    console.log('getTransaction 확인중입니다!');
    caver.klay.getTransaction('0x8d9dea743f20ef89051a918b0a6c292aac6bd1503d29088bedfe4fdb17ce7787').then(console.log);
})

//
app.get('/getBlock',(req,res)=>{
    caver.klay.getBlock(77628578).then(console.log);
})



let abi = [
	{
		"constant": true,
		"inputs": [],
		"name": "SayHello",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "Bye",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	}
];




  app.get("/contract", async (req, res) => { 
      // 이것 하나로  ()
    const myContract = await new caver.contract(abi,'0x167156016b0c8fa627583eda7ed209b1eb8482cb');
    console.log(1);
    //const val = await myContract.methods['Bye'].call();
    const val = await myContract.methods.Bye().call();
    
    res.send(val)
   // console.log(contract.SayHello().call().then(console.log));	//	[2]
   
  });
  


app.listen(port,()=>{
    console.log('서버 구동중입니다!');
})

app.get("/", (req, res) => {
    res.send("start!!");
  });


