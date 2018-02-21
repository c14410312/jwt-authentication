const Product = require('../models').products;

module.exports = {
	
	//list all the products
	list(req, res){
		return Product
 		.findAll({						                        attributes: ['name', 'price']
		})
		.then(prod_list => res.status(201).send(prod_list))
		.catch(err => res.status(400).send(err));
			        },
};

