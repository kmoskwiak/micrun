const configStore = require('../../../index').config;
const config = configStore.getConfig();

module.exports = {
    name: 'getLatest',
    method: function(req, res) {
        connectToDatabseAndReturnPost({
            password: config.DATA_BASE_PASSWORD
        })
        .then((post) => {
            return res.json(post);
        })
        .catch(() => {
            return res.json({
                error: 'Wrong password'
            });
        });
    }
};

function connectToDatabseAndReturnPost(options) {
    if(options.password !== '123456') {
        return Promise.reject();
    }

    return Promise.resolve({
        title: 'Dogs and cats',
        description: 'Woof!'
    });
}