const config = require('../configStore').getConfig();

function setRoutes(app) {
    if(config.postInterfacesDir) {
        registerPostInterfaces(app);
    }

    if(config.getInterfacesDir) {
        registerGetInterfaces(app);
    }
}

function registerPostInterfaces(app) {
    const postEndpoints = require('./postEndpoints');

    app
    .route('/')
    .post((req, res) => {
        if(req.body.API_KEY !== config.api_key){
            return res.status(403).end();
        }

        var interface = req.body.interface;
        var method = req.body.method;

        if(!postEndpoints[interface] || !postEndpoints[interface][method]){
            return res.status(404).end();
        }

        postEndpoints[interface][method](req.body)
        .then((reply) => {

            if(reply.HTTP_CODE) {
                res.status(reply.HTTP_CODE);
            }

            return res.json(reply);
        })
        .catch((err) => {
            return res.status(500).json(err);
        });
    });
}
    
function registerGetInterfaces(app) {
    const getEndpoints = require('./getEndpoints');

    app
    .route('/:interface/:method')
    .get((req, res) => {
        let interface = req.params.interface;
        let method = req.params.method;

        if(!getEndpoints[interface] || !getEndpoints[interface][method]){
            return res.status(404).end();
        }

        getEndpoints[interface][method](req, res);
    });
}
    
module.exports = {
    setRoutes: setRoutes
}