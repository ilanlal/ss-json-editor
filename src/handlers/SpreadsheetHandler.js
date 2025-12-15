class SpreadsheetHandler {
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
}

SpreadsheetHandler.Addon = {
    onActivateSheetClick: (e) => {
        return new SpreadsheetHandler
            .AddonWrapper(
                SpreadsheetHandler.prototype.documentProperties)
            .handleActivateSheet(e);
    },
    onInsertSampleDataClick: (e) => {
        return new SpreadsheetHandler
            .AddonWrapper(
                SpreadsheetHandler.prototype.documentProperties)
            .handleInsertSampleData(e);
    }
}

SpreadsheetHandler.AddonWrapper = class {
    constructor(documentProperties, userProperties, scriptProperties) {
        this._documentProperties = documentProperties;
        this._userProperties = userProperties;
        this._scriptProperties = scriptProperties;
    }

    handleActivateSheet(e) {
        try {
            const sheet = e.parameters?.sheet || null;
            if (!sheet) {
                throw new Error('Sheet ID is required to bind sheet data.');
            }
            // Implementation for opening spreadsheet goes here
            return this.handleOperationSuccess(`Sheet '${sheet}' opened successfully.`)
                .build();
        } catch (error) {
            return this.handleError(error)
                .build();
        }
    }

    handleInsertSampleData(e) {
        try {
            const sheet = e.parameters?.sheet || null;
            if (!sheet) {
                throw new Error('Sheet ID is required to insert sample data.');
            }

            // example usage sheet string: 'EMD.Spreadsheet.BasicAutomation' || 'BasicAutomation'
            const emd_sheet = EMD.Spreadsheet[sheet.split('.').pop()];

            if (!emd_sheet) {
                throw new Error(`Sheet configuration for '${sheet}' not found in EMD.`);
            }
           
            const rs = SpreadsheetController
                .create(
                    SpreadsheetApp.getActiveSpreadsheet(),
                    this._documentProperties)
                .bindSheetSampleData(emd_sheet({}));

            return this.handleOperationSuccess(`👍 Data inserted into sheet '${sheet}' successfully.`)
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
        SpreadsheetHandler
    };
}