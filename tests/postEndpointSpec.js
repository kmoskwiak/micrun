const request = require('supertest');
const mockery = require('mockery');
const FileSystemMock = require('./_mocks/global/fs.mock');
const path = require('path');


describe('POST endpoints', () => {
    const getUserMethod = {
        name: 'get_user',
        method: function() {
            return Promise.resolve({
                ok: true,
                HTTP_CODE: 200
            });
        }
    };

    const failMethod = {
        name: 'fail',
        method: function() {
            return Promise.reject({
                err: true
            });
        }
    };

    const customCodeMethod = {
        name: 'customCode',
        method: function() {
            return Promise.resolve({
                HTTP_CODE: 204
            });
        }
    };

    const serverConfiguration = {
        port: 44444,
        ip: '127.0.0.1',
        useConsul: false,
        postInterfacesDir: '/fake/path/on/server',
        api_key: '123456'
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
                    },
                    {
                        name: 'failMethod.js',
                        content: failMethod
                    },
                    {
                        name: 'customCodeMethod.js',
                        content: customCodeMethod
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
            return FileSystem._require(path.resolve(serverConfiguration.postInterfacesDir, interfaceDir, dir, file));
        }
    
        mockery.registerMock('fs', FileSystem);
        mockery.registerMock('../utils/load', fileLoader);
	});

	afterEach(() => {
		mockery.deregisterAll();
		mockery.disable();
	});


    it('should register POST endpoint and respond with 200', async (finish) => {
        const Micrun = require('../index');
        let app = await Micrun.createServer(serverConfiguration);

        request(app)
        .post('/')
        .send({
            API_KEY: '123456',
            method: 'get_user',
            interface: 'users'
        })
        .set('accept', 'json')
        .expect(200, finish);        
    });

    it('should register POST endpoint and respond with 403 when API_KEY is not correct', async (finish) => {
        const Micrun = require('../index');
        let app = await Micrun.createServer(serverConfiguration);

        request(app)
        .post('/')
        .send({
            API_KEY: 'bad_key',
            method: 'get_user',
            interface: 'users'
        })
        .set('accept', 'json')
        .expect(403, finish);        
    });

    it('should respond with 404 when method does not exist', async (finish) => {
        const Micrun = require('../index');
        let app = await Micrun.createServer(serverConfiguration);

        request(app)
        .post('/')
        .send({
            API_KEY: '123456',
            method: 'none',
            interface: 'users'
        })
        .set('accept', 'json')
        .expect(404, finish);        
    });

    it('should respond with 404 when interface does not exist', async (finish) => {
        const Micrun = require('../index');
        let app = await Micrun.createServer(serverConfiguration);

        request(app)
        .post('/')
        .send({
            API_KEY: '123456',
            method: 'get_usere',
            interface: 'bad_interface'
        })
        .set('accept', 'json')
        .expect(404, finish);        
    });

    it('should respond with custom code 204 if provided by user', async (finish) => {
        const Micrun = require('../index');
        let app = await Micrun.createServer(serverConfiguration);

        request(app)
        .post('/')
        .send({
            API_KEY: '123456',
            method: 'customCode',
            interface: 'users'
        })
        .set('accept', 'json')
        .expect(204, finish);        
    });

    it('should respond with custom code 500 when error occurs', async (finish) => {
        const Micrun = require('../index');
        let app = await Micrun.createServer(serverConfiguration);

        request(app)
        .post('/')
        .send({
            API_KEY: '123456',
            method: 'fail',
            interface: 'users'
        })
        .set('accept', 'json')
        .expect(500, finish);        
    });

});