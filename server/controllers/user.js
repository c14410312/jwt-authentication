const User = require('../models').users;

module.exports = {
	
	list(req, res){
		return User
		.findAll({
			attributes: ['uname', 'password']
		})
		.then(user_list => res.status(201).send(user_list))
		.catch(err => res.status(400).send(err));
	},
};
