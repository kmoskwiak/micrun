const request = require('supertest');
const mockery = require('mockery');
const FileSystemMock = require('./_mocks/global/fs.mock');
const path = require('path');

describe('GET endpoints', () => {
    const getUserMethod = {
        name: 'get_user',
        method: function(req, res) {
            return res.json({ ok: true });
        }
    };

    const serverConfiguration = {
        port: 44444,
        ip: '127.0.0.1',
        useConsul: false,
        getInterfacesDir: '/fake/path/on/server'
    };

    const myFileStructure = {
        name: '/fake/path/on/server',
        content: [
            {
                name: 'users',
                isDir: true,
                content: [
                    {
                        name: 'getUserMethod.js',
                        content: getUserMethod
                    }
                ]
            }
        ]
    };

    beforeEach(() => {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false
        });
        
        const FileSystem = new FileSystemMock(myFileStructure);
    
        function fileLoader(interfaceDir, dir, file) {
            return FileSystem._require(path.resolve(serverConfiguration.getInterfacesDir, interfaceDir, dir, file));
        }
    
        mockery.registerMock('fs', FileSystem);
        mockery.registerMock('../utils/load', fileLoader);
	});

	afterEach(() => {
		mockery.deregisterAll();
		mockery.disable();
	});


    it('should register GET endpoint and respond with 200', async (finish) => {
        const Micrun = require('../index');

        let app = await Micrun.createServer(serverConfiguration);

        request(app)
            .get('/users/get_user')
            .expect(200, finish);
    });

    it('should return 404 if method does not exist', async (finish) => {
        const Micrun = require('../index');

        let app = await Micrun.createServer(serverConfiguration);

        request(app)
            .get('/users/does_not_exist')
            .expect(404, finish);
    });

    it('should return 404 if interface does not exist', async (finish) => {
        const Micrun = require('../index');

        let app = await Micrun.createServer(serverConfiguration);

        request(app)
            .get('/none/get_users')
            .expect(404, finish);
    });
});