const express = require('express');
const bodyParser = require('body-parser');
const config = require('./configStore').getConfig();

function configureServer(app) {
    app.set('trust proxy', true);
    app.use(require('morgan')('combined'));
    app.use(bodyParser.json());
}

module.exports = {
    configureServer: configureServer
};