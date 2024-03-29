"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const WeeblyMiddleware = require('./middleware/weebly.js');
const oauthRouter = require('./app/oauth-router.js');
const webhooksRouter = require('./app/webhooks-router.js');

const getDate = require('./outputDate.js');

/**
 * Create the express app
 */
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

/**
 * Set and create a new instance of WeeblyMiddleware.
 * The `client_id` and `secret_key` can be set either here
 * or in your environment variables (e.g. for Heroku)
 *
 * NOTE: If you have WEEBLY_CLIENT_ID and WEEBLY_SECRET_KEY
 * set in your environment, you can create the new WeeblyMiddleware
 * instance with `const wMiddleware = new WeeblyMiddleware()`
 *
 * @type {WeeblyMiddleware|exports|module.exports}
 */
const wMiddleware = new WeeblyMiddleware({
  "client_id": "1409708070",
  "secret_key": "f0afd21a7fba6d0659b1a9ed0e411a54413d1a81b832320768d6a2a7b6141579",
});

/**
 * Requires Weebly Dev secrets to be set to access
 */
app.use('/oauth', wMiddleware, oauthRouter);
app.use('/webhooks', wMiddleware, webhooksRouter);

/**
 * Does not require weebly tokens to access
 */
app.get('/', function(req, res) {
	//console.log(`Date: ${getDate()}`);
	//console.log(`Received request at webroot of app`);
	res.sendFile(path.resolve(`${__dirname}/messages/messages.txt`));
});

/**
 * Listen on environment port or 3000
 */
app.listen(process.env.PORT || 3000);

console.log(`\nListening on http://localhost:${process.env.PORT || 3000}\n`);
