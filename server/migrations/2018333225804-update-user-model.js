'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
	queryInterface.addColumn(
	    	'users',
	    	'access-key',
	    	Sequelize.STRING);
	queryInterface.addColumn(
	    	'users',
	    	'secret-key',
	    	Sequelize.STRING);
  },

  down: (queryInterface/*, Sequelize*/) => {
	queryInterface.removeColumn(
		'users',
		'access-key');
	
	queryInterface.removeColumn(
		'users',
		'access-key');

  },
};
