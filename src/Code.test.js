require('../tests');
const { doGet, onOpen, onInstall } = require('./Code');

describe('doGet', () => {
    // doGet
    it('should run doGet message handler', () => {
        const event = {}; // Mock event object
        const response = doGet(event);
        expect(response).toBeDefined();
    });

    // onOpen
    it('should run onOpen message handler', () => {
        const event = {}; // Mock event object
        onOpen(event);
    });

    // onInstall
    it('should run onInstall message handler', () => {
        const event = {}; // Mock event object
        onInstall(event);
    });
});
