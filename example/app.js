const path = require('path');
const MicroService = require('../index.js');

MicroService.createServer({
    port: 9001,
    ip: '127.0.0.1',
    useConsul: false,
    api_key: 'secret',
    postInterfacesDir: path.resolve(__dirname, './postInterface'),
    getInterfacesDir: path.resolve(__dirname, './getInterface'),

    DATA_BASE_PASSWORD: '123456'
});