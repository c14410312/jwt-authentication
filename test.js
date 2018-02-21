const Sequelize = require('sequelize');
const seq = new Sequelize('postgres://dbutler:password@localhost:5432/auth_db');

seq.authenticate()
.then(() => {
	console.log("successfull");
}).catch(err => {
	console.log(err);
});

