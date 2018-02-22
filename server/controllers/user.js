const User = require('../models').users;

module.exports = {
	
	//authenticate a user and issue a token
	auth(req, res){
		return User
		.findOne({
			name: req.body.username
		})
		.then( (user) =>{

			console.log(user.name)

			if(!user){
				res.json({success: false, 
					  message: "Authentication failed! User not found"})
			} 
			else if(user) {
				
				if (user.password != req.body.password){
					
					res.status(400).send(json({ success: false,
					   	   message: "Authentication failed. Incorrect password"}));	
				}else{
					//the user has been found create a token
					const payload = {
						uname: user.uname
					};

					let token = jwt.sign(payload, 'theSecret', { expiresInMinutes: 1440});

					res.status(201).send(json({
						success: true,
						message: "Enjoy the token",
						token: token
					}));
				}
			}
		}).catch(err => res.status(400).send(err));
	},

	//list all users - test
	list(req, res){
		return User
		.findAll({
			attributes: ['uname', 'password']
		})
		.then(user_list => res.status(201).send(user_list))
		.catch(err => res.status(400).send(err));
	},
};
