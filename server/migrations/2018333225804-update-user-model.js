'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
	queryInterface.addColumn(
	    	'users',
	    	'access_key',
	    	Sequelize.STRING);
	queryInterface.addColumn(
	    	'users',
	    	'secret_key',
	    	Sequelize.STRING);
  },

  down: (queryInterface/*, Sequelize*/) => {
	queryInterface.removeColumn(
		'users',
		'access_key');
	
	queryInterface.removeColumn(
		'users',
		'access_key');

  },
};
