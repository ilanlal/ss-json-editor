class AppModel {
    get userProperties() {
        if (!this._userProperties) {
            this._userProperties = PropertiesService.getUserProperties();
        }
        return this._userProperties;
    }

    get activeSpreadsheet() {
        if (!this._activeSpreadsheet) {
            this._activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        }
        return this._activeSpreadsheet;
    }

    constructor(userProperties, activeSpreadsheet) {
        this._userProperties = userProperties;
        this._activeSpreadsheet = activeSpreadsheet;
        this.sheetModel = SheetModel.create(activeSpreadsheet);
        this.sheet = this.sheetModel.initializeSheet(EMD.Spreadsheet.Logger({}));
    }

    static create(
        userProperties = PropertiesService.getUserProperties(),
        activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    ) {
        return new AppModel(userProperties, activeSpreadsheet);
    }

    setLanguage(languageCode) {
        this.userProperties.setProperty(AppModel.InputMeta.DEFAULT_LANGUAGE, languageCode);
    }

    get state() {
        return {
            defaultLanguage: this.userProperties.getProperty(
                AppModel.InputMeta.DEFAULT_LANGUAGE) || 'en'
        };
    }
};

AppModel.InputMeta = {
    DEFAULT_LANGUAGE: 'default_language'
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppModel };
}