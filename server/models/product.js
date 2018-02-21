'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    name:{
	    type: DataTypes.STRING,
	    allowNull: false,
    },
    price:{
	    type: DataTypes.FLOAT,
	    allowNull: false,
    }
  },{
	    createdAt: false,
	    updatedAt: false
  });

  products.associate = (models) => {
    // associations can be defined here
  };

  return products;
};
