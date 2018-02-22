const userController = require('../controllers').users;
const productController = require('../controllers').products;

module.exports = (app) => {
	
	app.get('/api', (req, res) => res.status(200).send({
		message: "welcome to the api",
	}));
	
	//list all the users
	app.post('/api/authenticate', userController.auth);
	app.get('/api/users', userController.list);

	//list all products
	app.get('/api/products', productController.list);
};
