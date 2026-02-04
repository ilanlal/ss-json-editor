require('..');
const { Addon } = require('../../src/Addon');

describe('Addon.Modules.App', () => {
    beforeEach(() => {
        PropertiesService.getScriptProperties().deleteAllProperties();
        PropertiesService.getUserProperties().deleteAllProperties();
        PropertiesService.getDocumentProperties().deleteAllProperties();
    });

    it('should get and set script properties correctly', () => {
        const scriptProperties = PropertiesService.getScriptProperties();
        scriptProperties.setProperty('test_key', 'test_value');

        const retrievedValue = scriptProperties.getProperty('test_key');
        expect(retrievedValue).toBe('test_value');
    });

    it('should get and set user properties correctly', () => {
        const userProperties = PropertiesService.getUserProperties();
        userProperties.setProperty('user_key', 'user_value');

        const retrievedValue = userProperties.getProperty('user_key');
        expect(retrievedValue).toBe('user_value');
    });

    it('should get and set document properties correctly', () => {
        const documentProperties = PropertiesService.getDocumentProperties();
        documentProperties.setProperty('doc_key', 'doc_value');
        const retrievedValue = documentProperties.getProperty('doc_key');
        expect(retrievedValue).toBe('doc_value');
    });

    // getData test
    it('should retrieve correct data from App module', () => {
        const userProperties = PropertiesService.getUserProperties();
        const membershipInfo = {
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            balance: 10
        };
        userProperties.setProperty(Addon.Modules.App.MEMBERSHIP_PROPERTY_KEY, JSON.stringify(membershipInfo));
        const data = Addon.Modules.App.getData();
        expect(data).toBeDefined();
        expect(data.isPremium).toBe(true);
        expect(data.balance).toBe(10);
        expect(data.expiresAt).toBeInstanceOf(Date);
    });
});