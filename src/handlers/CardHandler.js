class CardHandler {
    get documentProperties() {
        if (!this._documentProperties) {
            this._documentProperties = PropertiesService.getDocumentProperties();
        }
        return this._documentProperties;
    }

    get userProperties() {
        if (!this._userProperties) {
            this._userProperties = PropertiesService.getUserProperties();
        }
        return this._userProperties;
    }

    get scriptProperties() {
        if (!this._scriptProperties) {
            this._scriptProperties = PropertiesService.getScriptProperties();
        }
        return this._scriptProperties;
    }

    constructor() {
        this._documentProperties = null;
        this._userProperties = null;
        this._scriptProperties = null;
    }
};

CardHandler.Addon = {
    onPushCardClick: (e) => {
        return new CardHandler
            .AddonWrapper(
                CardHandler.prototype.documentProperties, CardHandler.prototype.userProperties, CardHandler.prototype.scriptProperties)
            .handleOpenCard(e);
    },
    onPopCardClick: (e) => {
        return new CardHandler
            .AddonWrapper(
                CardHandler.prototype.documentProperties, CardHandler.prototype.userProperties, CardHandler.prototype.scriptProperties)
            .handleOpenCard(e);
    },
    onUpdateCardClick: (e) => {
        return new CardHandler
            .AddonWrapper(
                CardHandler.prototype.documentProperties, CardHandler.prototype.userProperties, CardHandler.prototype.scriptProperties)
            .handleOpenCard(e);
    },
    onPopToNamedCardClick: (e) => {
        return new CardHandler
            .AddonWrapper(
                CardHandler.prototype.documentProperties, CardHandler.prototype.userProperties, CardHandler.prototype.scriptProperties)
            .handleOpenCard(e);
    },
    onPopToRootCardClick: (e) => {
        return new CardHandler
            .AddonWrapper(
                CardHandler.prototype.documentProperties, CardHandler.prototype.userProperties, CardHandler.prototype.scriptProperties)
            .handleOpenCard(e);
    },
    onOpenCardClick: (e) => {
        return new CardHandler
            .AddonWrapper(
                CardHandler.prototype.documentProperties, CardHandler.prototype.userProperties, CardHandler.prototype.scriptProperties)
            .handleOpenCard(e);
    },
    onToggleBooleanSetting: (e) => {
        return new CardHandler
            .AddonWrapper(
                CardHandler.prototype.documentProperties, CardHandler.prototype.userProperties, CardHandler.prototype.scriptProperties)
            .handleToggleBooleanSetting(e);
    }
}

CardHandler.AddonWrapper = class {
    constructor(documentProperties, userProperties, scriptProperties) {
        this._documentProperties = documentProperties;
        this._userProperties = userProperties;
        this._scriptProperties = scriptProperties;
    }

    handleOpenCard(e) {
        try {
            // parameters: { card: 'EMD.Cards.Customer' }
            const cardParam = e.parameters?.card || null;

            if (!cardParam) {
                throw new Error("'card' parameter is required for onOpenCard.");
            }

            // EMD.Cards.Customer || Customer
            const selected_e_m_d_card = EMD.Cards[cardParam.split('.').pop()];
            if (!selected_e_m_d_card) {
                throw new Error(`Card configuration for '${cardParam}' not found in EMD.`);
            }

            const packageInfo = {
                version: Config.getVersion(),
                build: Config.getBuild(),
                author: Config.getAuthor(),
                license: Config.getLicense(),
                repository: Config.getRepository()
            };

            const appModel = AppModel.create(this._userProperties, SpreadsheetApp.getActiveSpreadsheet());

            return CardController
                .create(
                    CardService,
                    this._documentProperties)
                .pushCard(
                    selected_e_m_d_card(
                        {
                            isAdmin: false,
                            appModel: appModel.state,
                            packageInfo: packageInfo,
                            userInfo: { email: Session.getActiveUser().getEmail() }
                        }
                    ))
                .build();
        } catch (error) {
            return this.handleError(error)
                .build();
        }
    }

    handleToggleBooleanSetting(e) {
        try {
            throw new Error("Not implemented yet");
        } catch (error) {
            return this.handleError(error)
                .build();
        }
    }

    handleOperationSuccess(message) {
        // Show a success message to the user
        return CardService.newActionResponseBuilder()
            .setNotification(
                CardService.newNotification()
                    .setText(message));
    }

    handleError(error) {
        // Show an error message to the user
        return CardService.newActionResponseBuilder()
            .setNotification(
                CardService.newNotification()
                    .setText(
                        error.toString()));
    }
};


if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CardHandler
    };
}