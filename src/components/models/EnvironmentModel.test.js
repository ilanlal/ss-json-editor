require('../../../tests');
const { EnvironmentModel } = require('./EnvironmentModel');

describe('EnvironmentModel Tests', () => {
    test("EnvironmentModel should be defined", () => {
        expect(EnvironmentModel).toBeDefined();
    });

    describe('state', () => {
        /** @type {EnvironmentModel} */
        let model;

        beforeEach(() => {
            model = EnvironmentModel.create(PropertiesService.getDocumentProperties());
        });

        // setNewBotToken
        test('should set a new bot token', () => {
            const newToken = '[DUMMY_BOT_TOKEN]';
            model.setNewBotToken(newToken);
            expect(model.state.botToken).toBe(newToken ? `${newToken.substring(0, 4)}****${newToken.substring(newToken.length - 4)}` : null);
        });

        // setNewDefaultLanguage
        test('should set a new default language', () => {
            const newLanguageCode = 'es';
            model.setNewDefaultLanguage(newLanguageCode);
            expect(model.state.defaultLanguage).toBe(newLanguageCode);
        });

        // setNewChatId
        test('should set a new chat id', () => {
            const newChatId = 123456789;
            model.setMyNewChatId(newChatId);
            expect(model.state.chatId).toBe(newChatId + "");
        });

        // setNewDeploymentId
        test('should set a new deployment id', () => {
            const newDeploymentId = 'new_deployment_id';
            model.setNewDeploymentId(newDeploymentId);
            expect(model.state.deploymentId).toBe(newDeploymentId ? `${newDeploymentId.substring(0, 4)}****${newDeploymentId.substring(newDeploymentId.length - 4)}` : null);
        });

        // setDebugMode
        test('should set debug mode', () => {
            model.setDebugMode('errors');
            expect(model.state.debugMode).toBe('errors');
            expect(model.state.debugModeSet).toBe(true);
            model.setDebugMode('all');
            expect(model.state.debugMode).toBe('all');
        });

        // setNewActiveSpreadsheetId
        test('should set a new active spreadsheet id', () => {
            const newSpreadsheetId = 'new_spreadsheet_id';
            model.setNewActiveSpreadsheetId(newSpreadsheetId);
            expect(model.state.activeSpreadsheetId).toBe(newSpreadsheetId);
        });

        // setNewTestDeploymentId
        test('should set a new test deployment id', () => {
            const newTestDeploymentId = 'test_deployment_id_123';
            model.setNewTestDeploymentId(newTestDeploymentId);
            expect(model.state.testDeploymentId).toBe(newTestDeploymentId ? `${newTestDeploymentId.substring(0, 4)}****${newTestDeploymentId.substring(newTestDeploymentId.length - 4)}` : null);
        });

        // setLogArchiveSize
        test('should set log archive size', () => {
            const newSize = 5000;
            model.setLogArchiveSize(newSize);
            expect(model._documentProperties.getProperty(EnvironmentModel.InputMeta.LOG_ARCHIVE_SIZE)).toBe(newSize);
        });
    });
});