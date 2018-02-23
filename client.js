const Client = require('node-rest-client').Client;
const client = new Client();

const authorize = "http://localhost:8080/api/auth/"

const args = {
	data: {username: "dbutler@test.com",
	       password: "password"},
	headers: { "Content-Type": "application/json"}
};

//need to authorize the client first and get a token
client.post(authorize, args, (data, res) => {
	
	console.log(data);
	console.log(res.token);
});
