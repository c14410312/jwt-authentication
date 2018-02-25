const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const jwt = require('jsonwebtoken')
const config = require('./server/config/config');

const User = require('./server/models').users;
const Product = require('./server/models').products;

const Sequelize = require('sequelize');
const seq = new Sequelize('postgres://dbutler:password@localhost:5432/auth_db');

const port = process.env.PORT || 8080;

const jsonParser = bodyParser.json()
app.use(morgan('dev'));

// basic route (http://localhost:8080)
app.get('/', function(req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
 });

const CryptoJS = require('crypto-js');
const apiRoutes = express.Router(); 


//route to authenticate a user
apiRoutes.post('/auth', jsonParser, (req, res) => {

	User.findOne({
		where: {uname: req.body.username},
	})
	.then( (user) => {

		console.log(user);
		
		//username has not been found
		if(!user){
			res.status(400).send({success: false,
					     message: "Authentication failed. Incorrect username"});
		} else if (user){
			//password check
			
			//perform a raw query to check password
			seq.query("SELECT password FROM users WHERE password = crypt(:pass, :upass)", {replacements: {pass: req.body.password, upass: user.password}, type: seq.QueryTypes.SELECT})
			.then( (pass) => {
				console.log(pass[0].password);
				if (pass[0].password != user.password){
					res.status(400).send({success: false,
						     message: "Authentication failed. Incorrect password provided"});
				} else {
	
					const payload = {
						uname: user.uname
					};

					let token = jwt.sign(payload, 'theSecret', {
						expiresIn: 60*60*24
					});

					res.status(201).send({success: true,
							     message: "token granted",
					token: token});
				}
			}).catch( () => {
				res.status(400).send({success: false,
						     message: "Authentication failed. Incorrect password provided"});			
			});
		}
	}).catch( (err) => res.status(400).send(err));
});


//ensure that the protected routes lie underneath the auth route

////////////////////////
//VERIFY THE TOKEN ROUTE
////////////////////////

apiRoutes.use(jsonParser,(req, res, next) => {
	
	let token = req.body.token || req.query.token || req.headers['x-access-token'];
	
	if (token){

		jwt.verify(token, 'theSecret', (err, decoded) => {
			if(err){
				return res.json({success: false, message: "failed to authenticate token"});
			} else{
				req.decoded = decoded;
				next();
			}
		});
	} else {
		//no token return error
		return res.status(403).send({
			success: false,
			message: 'No token provided'
		});
	}
});

//routing to the API
apiRoutes.get('/', (req, res) => {
	res.json({message: "Welcome to the API!!!"});	
});

//PRODUCT ROUTES
///////////////////

apiRoutes.get('/products', (req, res) => {
	
	Product.findAll({
		attributes: ['name', 'price']
	}).then((prods) => {
		res.status(201).send(prods)
	}).catch((err) => {
		res.status(400).send(err)
	});
});

///////////////////
//USER ROUTES
///////////////////

//return list of users
//Using HMAC to validate request has came from correct user
apiRoutes.get('/users', (req, res) => {

	User.findOne({
		where: {
			access_key: req.headers.access_key,
		}
	}).then((user) => {
		
		let hash = req.headers.signature;
		let secret = user.secret_key;
		let message = req.body.message;

		//decrypt the message:
		let bytes = CryptoJS.AES.decrypt(hash.toString(), secret);
		let plaintext = bytes.toString(CryptoJS.enc.Utf8);

		if(plaintext == message){
			User.findAll({
				attributes: ['uname', 'password', 'access_key', 'secret_key']
			})
			.then(user_list => {
				res.status(201).send(user_list)
			})
			.catch((err) => {
				res.status(400).send(err)
			});
			
		}else{
			res.status(401).send({message: "decrypted message does not match!"})
		}

	}).catch(err => res.status(400).send(err));
});


//instructs the server to use API routes when given the route-->'/api'
app.use('/api', apiRoutes);

app.listen(port);
console.log('Magic happens at http://localhost:' + port);


