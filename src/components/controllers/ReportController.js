// Google Apps Script code for Google Workspace Add-ons
class ReportController {
    /**
     * Represents a report for a specific range in Google Sheets.
     * @param {RangeReport} rangeReport - The report for the range.
     */
    constructor(userStore = new UserStore(), localization = AppManager.getLocalizationResources()) {        
        this.localization = localization;
        this.userStore = userStore;
        this.userLicenseManager = new UserLicenseManager(userStore);
        this.userLicense = this.userLicenseManager.getLicense();
    }

    home(rangeReport) {
         // Google Sheets range object
        if (!rangeReport || !rangeReport.getA1Notation) {
            throw new Error("Invalid range report object");
        }

        return CardService
            .newActionResponseBuilder()
            .setNavigation(
                CardService.newNavigation()
                    .pushCard(ReportCard
            .create(this.userLicense, rangeReport, this.localization)
            .build()));
    }

    close() {
        return CardService.newActionResponseBuilder()
            .setNavigation(
                CardService.newNavigation()
                    .popToRoot())
            .build();
    }
}