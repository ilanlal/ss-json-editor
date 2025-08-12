// Google Apps Script code for Google Workspace Add-ons
class ReportController {
    /**
     * Represents a report for a specific range in Google Sheets.
     * @param {RangeReport} rangeReport - The report for the range.
     */
    constructor(localization, userStore) {
        this.localization = localization;
        this.userStore = userStore;
        this.userLicenseManager = new UserLicenseManager(userStore);
        this.userLicense = this.userLicenseManager.getLicense();
    }

    static newController(localization, userStore) {
        return new ReportController(localization, userStore);
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
                    .pushCard(
                        ReportCard
                            .create(this.userLicense, rangeReport, this.localization)
                            .build()));
    }

    close(e) {
        return CardService.newActionResponseBuilder()
            .setNavigation(
                CardService.newNavigation()
                    .popToRoot());
    }

    /** 
     * @returns {CardService.ActionResponse}
     */
    reportItemClick(e) {
        const a1Notation = e.parameters.a1Notation;
        if (!a1Notation) {
            throw new Error("No A1 notation provided in the event parameters.");
        }

        // Focus on the cell in the active spreadsheet
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        const range = sheet.getRange(a1Notation);
        sheet.setActiveRange(range);

        // Return a notification to the user
        return CardService.newActionResponseBuilder()
            .setNotification(
                CardService.newNotification()
                    .setText(
                        this.localization.messages.focusedOnCell.replace("{0}", a1Notation)));
    }
}