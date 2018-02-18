const request = require('supertest');

describe('Server', () => {
    const configuration = {
        port: 44444,
        ip: '127.0.0.1',
        useConsul: false
    };

    it('should expose _healthchceck endpoint', async (finish) => {
        const Micrun = require('../index');
        let app = await Micrun.createServer(configuration);

        request(app)
            .get('/_healthcheck')
            .expect(200, finish);
    });
});