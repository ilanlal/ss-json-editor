class AddonHandler {
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

    get activeSpreadsheet() {
        if (!this._activeSpreadsheet) {
            this._activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        }
        return this._activeSpreadsheet;
    }

    constructor() {
        this._documentProperties = null;
        this._userProperties = null;
        this._scriptProperties = null;
        this._activeSpreadsheet = null;
    }
}

AddonHandler.Views = {
    onMinifyClick: (e) => {
        return new AddonHandler
            .ControllerWrappers(
                AddonHandler.prototype.activeSpreadsheet,
                AddonHandler.prototype.documentProperties,
                AddonHandler.prototype.userProperties,
                AddonHandler.prototype.scriptProperties)
            .handleMinifyClick(e);
    },
    onPrettifyClick: (e) => {
        return new AddonHandler
            .ControllerWrappers(
                AddonHandler.prototype.activeSpreadsheet,
                AddonHandler.prototype.documentProperties,
                AddonHandler.prototype.userProperties,
                AddonHandler.prototype.scriptProperties)
            .handlePrettifyClick(e);
    },
    onValidateClick: (e) => {
        return new AddonHandler
            .ControllerWrappers(
                AddonHandler.prototype.activeSpreadsheet,
                AddonHandler.prototype.documentProperties,
                AddonHandler.prototype.userProperties,
                AddonHandler.prototype.scriptProperties)
            .handleValidateClick(e);
    }
};

AddonHandler.ControllerWrappers = class extends AddonHandler {
    constructor(activeSpreadsheet, documentProperties, userProperties, scriptProperties) {
        super();
        this._activeSpreadsheet = activeSpreadsheet;
        this._documentProperties = documentProperties;
        this._userProperties = userProperties;
        this._scriptProperties = scriptProperties;
    }

    handleMinifyClick(e) {
        throw new Error("Not implemented yet");
    }

    handlePrettifyClick(e) {
        throw new Error("Not implemented yet");
    }

    handleValidateClick(e) {
        throw new Error("Not implemented yet");
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
        AddonHandler
    };
}
