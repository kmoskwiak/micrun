module.exports = {
    name: 'get',
    method: function () {
        return Promise.resolve([{
            name: 'John',
            email: 'john@example.com'
        }, {
            name: 'Alice',
            email: 'alice@example.com'
        }]);

    }
};