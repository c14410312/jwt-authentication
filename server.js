const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const jwt = require('jsonwebtoken')
const config = require('./server/config/config');
const User = require('./server/models').users;

const Sequelize = require('sequelize');
const seq = new Sequelize('postgres://dbutler:password@localhost:5432/auth_db');

const port = process.env.PORT || 8080;

const jsonParser = bodyParser.json()
app.use(morgan('dev'));

// basic route (http://localhost:8080)
app.get('/', function(req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
 });

const apiRoutes = express.Router(); 

//routing to the API
apiRoutes.get('/', (req, res) => {
	res.json({message: "Welcome to the API!!!"});	
});

//return list of users
apiRoutes.get('/users', (req, res) => {
	User.findAll({
		attributes: ['uname', 'password']
	})
	.then(user_list => res.status(201).send(user_list))
	.catch(err => res.status(400).send(err));
});

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

//instructs the server to use API routes when given the route-->'/api'
app.use('/api', apiRoutes);



app.listen(port);
console.log('Magic happens at http://localhost:' + port);

