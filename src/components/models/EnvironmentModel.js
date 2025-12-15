class EnvironmentModel {
    constructor(documentProperties) {
        this._documentProperties = documentProperties;
        this._telegramBotClient = null;

    }

    static create(
        documentProperties = PropertiesService.getDocumentProperties()
    ) {
        return new EnvironmentModel(documentProperties);
    }

    setNewDefaultLanguage(code) {
        if (!code || typeof code !== 'string' || code.trim() === '') {
            throw new Error("Invalid language code");
        }
        return this._documentProperties.setProperty(EnvironmentModel.InputMeta.DEFAULT_LANGUAGE, code);
    }

    setNewBotToken(token) {
        if (!token || typeof token !== 'string' || token.trim() === '') {
            throw new Error("Invalid bot token");
        }
        const safeToken = decodeURIComponent(token);
        return this._documentProperties.setProperty(EnvironmentModel.InputMeta.BOT_API_TOKEN, safeToken);
    }

    setNewDeploymentId(id) {
        if (!id || typeof id !== 'string' || id.trim() === '') {
            this._documentProperties.deleteProperty(EnvironmentModel.InputMeta.DEPLOYMENT_ID);
            return;
        }

        const safeId = decodeURIComponent(id);
        return this._documentProperties.setProperty(EnvironmentModel.InputMeta.DEPLOYMENT_ID, safeId);
    }

    setMyNewChatId(id) {
        if (!id || isNaN(id)) {
            throw new Error("Invalid chat ID");
        }
        const safeId = decodeURIComponent(id);
        return this._documentProperties.setProperty(EnvironmentModel.InputMeta.ADMIN_CHAT_ID, safeId);
    }

    setDebugMode(debugValue) {
        return this._documentProperties.setProperty(EnvironmentModel.InputMeta.DEBUG_MODE, debugValue);
    }

    setNewActiveSpreadsheetId(spreadsheetId) {
        if (!spreadsheetId || typeof spreadsheetId !== 'string' || spreadsheetId.trim() === '') {
            spreadsheetId = '[current]';
        }

        const safeId = decodeURIComponent(spreadsheetId);
        return this._documentProperties.setProperty(EnvironmentModel.InputMeta.ACTIVE_SPREADSHEET_ID, safeId);
    }

    setNewEnvironment(env) {
        if (!env || typeof env !== 'string' || env.trim() === '') {
            throw new Error("Invalid environment");
        }
        return this._documentProperties.setProperty(EnvironmentModel.InputMeta.ENVIRONMENT, env);
    }

    setNewWebhookCallbackUrl(url) { 
        if (!url || typeof url !== 'string' || url.trim() === '') {
            throw new Error("Invalid webhook callback URL");
        }
        const safeUrl = decodeURIComponent(url);
        return this._documentProperties.setProperty(EnvironmentModel.InputMeta.WEBHOOK_CALLBACK_URL, safeUrl);
    }

    setNewTestDeploymentId(id) {
        if (!id || id.trim() === '') {
            this._documentProperties.deleteProperty(EnvironmentModel.InputMeta.TEST_DEPLOYMENT_ID);
            return;
        }
        const safeId = decodeURIComponent(id);
        return this._documentProperties.setProperty(EnvironmentModel.InputMeta.TEST_DEPLOYMENT_ID, safeId);
    }

    setLogArchiveSize(size) {
        if (isNaN(size) || size <= 0) {
            throw new Error("Invalid log archive size");
        }
        return this._documentProperties.setProperty(EnvironmentModel.InputMeta.LOG_ARCHIVE_SIZE, size);
    }

    // Getters
    get state() {
        const token = this._documentProperties.getProperty(EnvironmentModel.InputMeta.BOT_API_TOKEN);
        const deploymentId = this._documentProperties.getProperty(EnvironmentModel.InputMeta.DEPLOYMENT_ID);
        const testDeploymentId = this._documentProperties.getProperty(EnvironmentModel.InputMeta.TEST_DEPLOYMENT_ID);
        return {
            // show 4 first and 4 last characters of the token
            botToken: token ? `${token.substring(0, 4)}****${token.substring(token.length - 4)}` : null,
            botTokenSet: !!this._documentProperties.getProperty(EnvironmentModel.InputMeta.BOT_API_TOKEN),
            deploymentId: deploymentId ? `${deploymentId.substring(0, 4)}****${deploymentId.substring(deploymentId.length - 4)}` : null,
            deploymentIdSet: !!this._documentProperties.getProperty(EnvironmentModel.InputMeta.DEPLOYMENT_ID),
            chatId: this._documentProperties.getProperty(EnvironmentModel.InputMeta.ADMIN_CHAT_ID),
            chatIdSet: !!this._documentProperties.getProperty(EnvironmentModel.InputMeta.ADMIN_CHAT_ID),
            defaultLanguage: this._documentProperties.getProperty(EnvironmentModel.InputMeta.DEFAULT_LANGUAGE),
            defaultLanguageSet: !!this._documentProperties.getProperty(EnvironmentModel.InputMeta.DEFAULT_LANGUAGE),
            debugMode: this._documentProperties.getProperty(EnvironmentModel.InputMeta.DEBUG_MODE) || 'false',
            debugModeSet: this._documentProperties.getProperty(EnvironmentModel.InputMeta.DEBUG_MODE) !== 'false',
            activeSpreadsheetId: this._documentProperties.getProperty(EnvironmentModel.InputMeta.ACTIVE_SPREADSHEET_ID),
            activeSpreadsheetIdSet: this._documentProperties.getProperty(EnvironmentModel.InputMeta.ACTIVE_SPREADSHEET_ID) !== null,
            environment: this._documentProperties.getProperty(EnvironmentModel.InputMeta.ENVIRONMENT) || 'exec',
            webhookCallbackUrl: this._documentProperties.getProperty(EnvironmentModel.InputMeta.WEBHOOK_CALLBACK_URL),
            webhookCallbackUrlSet: !!this._documentProperties.getProperty(EnvironmentModel.InputMeta.WEBHOOK_CALLBACK_URL),
            testDeploymentId: testDeploymentId ? `${testDeploymentId.substring(0, 4)}****${testDeploymentId.substring(testDeploymentId.length - 4)}` : null,
            testDeploymentIdSet: !!this._documentProperties.getProperty(EnvironmentModel.InputMeta.TEST_DEPLOYMENT_ID)
        }
    }
}

EnvironmentModel.InputMeta = {
    BOT_API_TOKEN: 'bot_api_token',
    DEPLOYMENT_ID: 'deployment_id',
    TEST_DEPLOYMENT_ID: 'test_deployment_id',
    ADMIN_CHAT_ID: 'admin_chat_id',
    DEFAULT_LANGUAGE: 'default_language',
    DEBUG_MODE: 'debug_mode_set',
    ACTIVE_SPREADSHEET_ID: 'active_spreadsheet_id',
    ENVIRONMENT: 'environment',
    WEBHOOK_CALLBACK_URL: 'webhook_callback_url',
    AUTOMATION_ENABLED: 'automation_enabled',
    LOG_ARCHIVE_SIZE: 'log_archive_size'
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EnvironmentModel };
}