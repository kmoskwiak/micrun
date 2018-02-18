const fs = require('fs');
const path = require('path');
const load = require('../utils/load');
const config = require('../configStore').getConfig();

var interfaces = {};
const interfaceDir = config.getInterfacesDir;

fs.readdirSync(interfaceDir)
.map((dir) => {
    interfaces[dir] = {};
    fs.readdirSync(path.resolve(interfaceDir, dir))
    .map((file) => {
        if(file.indexOf('Method') !== -1){
            var _module = load(interfaceDir, dir, file);
            interfaces[dir][_module.name] = _module.method;
            console.log('Registered get endpoint method %s @ %s', _module.name, dir);
        }
    });
});

module.exports = interfaces;
