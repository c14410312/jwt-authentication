'use strict';
module.exports = (sequelize, DataTypes) => {
  
	const users = sequelize.define('users', {
    		uname: DataTypes.STRING,
    		password: DataTypes.STRING,
		access_key: DataTypes.STRING,
		secret_key: DataTypes.STRING,
  	},{
		createdAt: false,
		updatedAt: false
	});

  	users.associate = (models) => {
    		// associations can be defined here
  	};
  	
	return users;
};
