class NavigationHandler {
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

    get cardService() {
        if (!this._cardService) {
            this._cardService = CardService;
        }
        return this._cardService;
    }

    constructor(cardService, documentProperties, userProperties, scriptProperties) {
        this._cardService = cardService;
        this._documentProperties = documentProperties;
        this._userProperties = userProperties;
        this._scriptProperties = scriptProperties;
    }
};

NavigationHandler.ViewModel = {
    onPushCardClick: (e) => {
        return new NavigationHandler
            .ControllerWrapper(
                NavigationHandler.prototype.cardService, NavigationHandler.prototype.documentProperties, NavigationHandler.prototype.userProperties, NavigationHandler.prototype.scriptProperties)
            .handlePushCard(e);
    },
    onPopCardClick: (e) => {
        return new NavigationHandler
            .ControllerWrapper(
                NavigationHandler.prototype.cardService, NavigationHandler.prototype.documentProperties, NavigationHandler.prototype.userProperties, NavigationHandler.prototype.scriptProperties)
            .handlePopCard(e);
    },
    onUpdateCardClick: (e) => {
        return new NavigationHandler
            .ControllerWrapper(
                NavigationHandler.prototype.cardService, NavigationHandler.prototype.documentProperties, NavigationHandler.prototype.userProperties, NavigationHandler.prototype.scriptProperties)
            .handleUpdateCard(e);
    },
    onPopToNamedCardClick: (e) => {
        return new NavigationHandler
            .ControllerWrapper(
                NavigationHandler.prototype.cardService, NavigationHandler.prototype.documentProperties, NavigationHandler.prototype.userProperties, NavigationHandler.prototype.scriptProperties)
            .handlePopToNamedCard(e);
    },
    onPopToRootCardClick: (e) => {
        return new NavigationHandler
            .ControllerWrapper(
                NavigationHandler.prototype.cardService, NavigationHandler.prototype.documentProperties, NavigationHandler.prototype.userProperties, NavigationHandler.prototype.scriptProperties)
            .handlePopToRootCard(e);
    }
}

NavigationHandler.ControllerWrapper = class {
    constructor(cardService, documentProperties, userProperties, scriptProperties) {
        this._cardService = cardService;
        this._documentProperties = documentProperties;
        this._userProperties = userProperties;
        this._scriptProperties = scriptProperties;
    }

    handlePushCard(e) {
        try {
            // extract parameters from event
            const template = e.parameters?.template || null;
            const cardName = e.parameters?.cardName || null;

            if (!template) {
                throw new Error("'template' parameter is required for handlePushCard.");
            }

            const emd_card = EMD.Cards[template.split('.').pop()];
            if (!emd_card) {
                throw new Error(`Card configuration for '${template}' not found in EMD.`);
            }

            const packageInfo = {
                version: Config.getVersion(),
                build: Config.getBuild(),
                author: Config.getAuthor(),
                license: Config.getLicense(),
                repository: Config.getRepository()
            };
            const appModel = AppModel.create(
                SpreadsheetApp.getActiveSpreadsheet(),
                this._documentProperties,
                this._userProperties,
                this._scriptProperties);

            const cardModel = CardViewModel.CardServiceWrapper
                .create(this._cardService, this._documentProperties, this._userProperties, this._scriptProperties);

            const cardBuilder = cardModel.newCardBuilder(
                emd_card({
                    appModel: appModel.state,
                    packageInfo: packageInfo,
                    cardName: cardName
                }));
            return this._cardService.newActionResponseBuilder()
                .setNavigation(
                    this._cardService.newNavigation()
                        .pushCard(cardBuilder.build()))
                .build();
        } catch (error) {
            return this.handleError(error)
                .build();
        }
    }

    handlePopCard(e) {
        try {
            return this._cardService.newActionResponseBuilder()
                .setNavigation(
                    this._cardService.newNavigation()
                        .popCard()
                )
                .build();
        } catch (error) {
            return this.handleError(error)
                .build();
        }
    }

    handleUpdateCard(e) {
        try {
            // parameters: { template: 'EMD.Cards.Customer', cardName: 'CustomerCard' }
            const template = e.parameters?.template || null;
            const cardName = e.parameters?.cardName || null;

            if (!template) {
                throw new Error("'template' parameter is required for handlePushCard.");
            }
            const emd_card = EMD.Cards[template.split('.').pop()];
            if (!emd_card) {
                throw new Error(`Card configuration for '${template}' not found in EMD.`);
            }

            const packageInfo = {
                version: Config.getVersion(),
                build: Config.getBuild(),
                author: Config.getAuthor(),
                license: Config.getLicense(),
                repository: Config.getRepository()
            };
            const appModel = AppModel.create(
                SpreadsheetApp.getActiveSpreadsheet(),
                this._documentProperties,
                this._userProperties,
                this._scriptProperties);

            const cardModel = CardViewModel.CardServiceWrapper
                .create(this._cardService, this._documentProperties, this._userProperties, this._scriptProperties);

            const cardBuilder = cardModel.newCardBuilder(
                emd_card({
                    appModel: appModel.state,
                    packageInfo: packageInfo,
                    cardName: cardName
                }));

            return this._cardService.newActionResponseBuilder()
                .setNavigation(
                    this._cardService.newNavigation()
                        .updateCard(cardBuilder.build()))
                .build();
        } catch (error) {
            return this.handleError(error)
                .build();
        }
    }

    handlePopToNamedCard(e) {
        try {
            // parameters: { cardName: 'CardName' }
            const cardName = e.parameters?.cardName || null;
            if (!cardName) {
                throw new Error("'cardName' parameter is required for handlePopToNamedCard.");
            }
            return this._cardService.newActionResponseBuilder()
                .setNavigation(
                    this._cardService.newNavigation()
                        .popToNamedCard(cardName)
                )
                .build();
        } catch (error) {
            return this.handleError(error)
                .build();
        }
    }

    handlePopToRootCard(e) {
        try {
            return this._cardService.newActionResponseBuilder()
                .setNavigation(
                    this._cardService.newNavigation()
                        .popToRoot()
                )
                .build();
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
        NavigationHandler
    };
}