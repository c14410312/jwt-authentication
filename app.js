const express = require('express');
const logger = require('morgan')
const bodyParser = require('body-parser');

const app = express();

//logs all requests to the console
app.use(logger('dev'));

//parse incoming request data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

require('./server/routes')(app);

app.get('*', (req, res) => res.status(200).send({
	message: "Welcome to the authentication api",
}));

//export the app
module.exports = app;
