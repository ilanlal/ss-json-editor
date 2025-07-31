// Apps Script code for Google Workspace Add-ons
class HomeController {
    constructor(localization, userStore) {
        this.localization = localization;
        this.userStore = userStore;
        this.userLicenseManager = new UserLicenseManager(userStore);
    }

    home() {
        const indentSpaces = this.userStore.getIndentSpaces() || "2";
        const userLicense = this.userLicenseManager.getLicense();
        return HomeCard.create(userLicense, this.localization, indentSpaces)
            .build();
    }

    prettyJsonFormat() {
        const userLicense = this.userLicenseManager.getLicense();
        
        const jsonStudio =
            new JsonStudio(
                SpreadsheetApp.getActiveSpreadsheet(),
                this.localization,
                this.userStore);

        // Call the formatRange method of JsonStudio
        const rangeReport = jsonStudio.formatRange();
        const reportItems = rangeReport.getItems();
        // If there are results, create and return the report card
        if (reportItems?.length > 0) {
            return ReportCard
                .create(userLicense, rangeReport, this.localization)
                .build();
        }
    }

    minifyJsonFormat() {
        // Implement the logic for minifying JSON format
        // This method should return a card with the minified JSON format
    }
}
