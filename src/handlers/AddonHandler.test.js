require('../../tests');

const { AddonHandler } = require('./AddonHandler');

describe('AddonHandler', () => {
    beforeEach(() => {
        UrlFetchAppStubConfiguration.reset();
    });

    it('should create an instance of AddonHandler', () => {
        const handler = new AddonHandler();
        expect(handler).toBeInstanceOf(AddonHandler);
    });
});