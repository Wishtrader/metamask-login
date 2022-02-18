const express = require( 'express' )
const cookieParser = require('cookie-parser')
const axios = require( 'axios' )
const Web3 = require('web3');

const app     = express()
const port    = 5000

app.use(express.json());
app.use(cookieParser())

let users = []

app.get( '/' ,async (req, res) => {
	let logged = false
	try {
		let SKEY = req.cookies["SKEY"]
		let vs = SKEY.split("_")
		let address = vs[0]
		logged = users[address].SKEY == SKEY
	}
	catch {}
			
	if (logged == false) {
		let page = await axios.get("http://127.0.0.1:1234/login.html")
		res.send( page.data)
		return
	}		

	let page = await axios.get("http://127.0.0.1:1234/index.html")
	res.send( page.data)
})

app.post('/api/token/get',async (req, res ) => {
	if (users[req.body.address] == null)
		users[req.body.address] = { "token": "token_"+(new Date().getTime()), "signature": null, "SKEY": null }

	res.json( users[req.body.address].token)
})

app.post('/api/token/sign',async (req, res ) => {
	try {
		let address = req.body.address
		let signature = req.body.signature

		if (users[address] == null) {
			res.status(404);
			return res.json({error: "invalid address"})
		}
		//console.log(Eth)
		let web3 = new Web3(Web3.givenProvider)

		let recoveredAddress = web3.eth.accounts.recover(users[address].token, signature);
		if (recoveredAddress.toUpperCase() != address.toUpperCase()){
			res.status(404);
			return res.json({error: "invalid signature"})
		}

		users[address].SKEY = address+"_"+(new Date().getTime())

		res.json({SKEY: users[address].SKEY})
	}
	catch (e){
		console.log(e)
		res.status(500);
	}
})

app.use(express.static('/home/sysadmin/metamask-login/front/dist'));

app.listen( port ,() => console.log(`Listen on Port ${ port } Ctrl + C to Stop `) )