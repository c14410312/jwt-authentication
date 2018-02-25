const authorize = "http://localhost:8080/api/auth/"
const index = "http://localhost:8080/api/"
const users = "http://localhost:8080/api/users/"

const crypto = require('crypto');
const cryptoJSON = require('crypto-json');

const Sequelize = require('sequelize');
const User = require('./server/models').users;
const seq = new Sequelize('postgres://dbutler:password@localhost:5432/auth_db');

const access_key = "02fbef21c869db5dfb9d7308209576f28e094d7d833e85175cb55c6a8eb331c292";

const secret_key = "a4774aea9025aa013b4917261e3dc1c9f518061095dcb399c77261933d8073a5"

const rp = require('request-promise');

const CryptoJS = require('crypto-js');

const args = {
	method: 'POST',
	uri: authorize,
	body: {username: "dbutler@test.com",
	       password: "password"},
	json: true,
};

//authorize the user
rp(args).then(function(data){
	
	//if the user has been granted a token
	if(data.token){
	
		console.log("Token Granted: " + data.token);

		let hash = CryptoJS.AES.encrypt('this is a test', secret_key)
		let getArgs = {
			uri: users,
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Basic ZGJ1dGxlcjpwYXNzd29yZA==",
				"signature":hash, 
				"x-access-token": data.token,
				"access_key": access_key,
			},
			body: {
				message: "this is a test",
			},
			json: true
		}
		
		//returns a set of users using token
		rp(getArgs)
		.then( (res) => {
			console.log(res);
		}).catch(err => {console.log(err.message)});

	
	}else{
		console.log("User not authenticated, no token granted");
	}
}).catch(function (err){
       	console.log(err.message);
});
