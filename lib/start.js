const setConfig = require('./configStore').setConfig;
const express = require('express');
const http = require('http');


function start(localConfig) {
    return getConfiguration(localConfig)
        .then((config) => {

            let app = express();
            let server = http.createServer(app);

            require('./express').configureServer(app);
            require('./router').setRoutes(app);
            require('./healthCheck')(app);

            server.listen(config.port, config.ip, () => {
                console.log('Microservice listening on port %d', config.port);
            });

            return server;
        });
}

function getConfiguration(localConfig) {
    let useConsul = localConfig.useConsul;

    if(useConsul) {
        return getCofigurationFromConsul(localConfig);
    } else {
        return getConfigurationFromLocalFile(localConfig);
    }
}

function getCofigurationFromConsul(localConfig) {
    let consulConfig = localConfig.consulConfig;
    consulConfig.promisify = true;

    const consul = require('consul')(consulConfig);

    return consul.kv.get({
        key: localConfig.consulNamespace,
        recurse: true
    })
    .then((data) => {
        let consulConfig = {};
        data.forEach(element => {
            let key = element.Key.split('/')[1];
            if(key) {
                consulConfig[key] = element.Value;
            }
        });
        let _config = Object.assign({}, localConfig, consulConfig);
        setConfig(_config);
        return _config;
    });
}

function getConfigurationFromLocalFile(localConfig) {
    let _config = Object.assign({}, localConfig);
    setConfig(_config);
    return Promise.resolve(_config);
}

module.exports = start;
