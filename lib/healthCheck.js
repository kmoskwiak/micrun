const config = require('./configStore').getConfig();

let updateVersion = function(){};

if(config.useConsul) {
    const consul = require('consul')({
        promisify: true
    });

    consul.kv.set({
        key: config.consulNamespace + '/version',
        value: config.version
    });
}

function healthCheck(app) {
    app
        .route('/_healthcheck')
        .get((req, res) => {
            res.json({
                version: config.version
            });
        });
}

module.exports = healthCheck;