import axios from 'axios'

window.addEventListener("load",async ()=>{
	document.querySelector(".LOGIN").addEventListener("click", async (evt) => {
		evt.preventDefault()
		try 		
		{
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		let account = accounts[0]

		let res = await axios.post("/api/token/get", { "address": window.ethereum.selectedAddress })
		let token = res.data
	
		let signature = await window.ethereum.request({ method: "personal_sign", params: [token,window.ethereum.selectedAddress]})
	
		res = await axios.post("/api/token/sign", { "address": window.ethereum.selectedAddress, "signature": signature })
	
		if (res.data.SKEY == null)
			throw "Error in login"
	
		document.cookie = `SKEY=${res.data.SKEY}`;
		window.location.reload()
		}catch(e){
			console.log(e)
		}
	})
})
