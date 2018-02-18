describe('Config Store', () => {
    it('sets configuration and then gets it', () => {
        const configStore = require('../index.js').config;
        const config = {
            a: 1
        };

        configStore.setConfig(config);
        let _config = configStore.getConfig();
        expect(_config).toEqual(config);
    })
});