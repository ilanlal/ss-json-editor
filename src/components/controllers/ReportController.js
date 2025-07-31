// Google Apps Script code for Google Workspace Add-ons
class ReportController {
    /**
     * Represents a report for a specific range in Google Sheets.
     * @param {RangeReport} rangeReport - The report for the range.
     */
    constructor(rangeReport, userStore = new UserStore(), localization) {
        // Google Sheets range object
        if (!rangeReport || !rangeReport.getA1Notation) {
            throw new Error("Invalid range report object");
        }

        // A1 notation of the range
        /** @type {string} */
        this.a1Notation = rangeReport.getA1Notation();

        // Initialize the range report
        /** @type {RangeReport} */
        this.rangeReport = rangeReport;

        this.localization = localization;
        this.userStore = userStore;
        this.userLicenseManager = new UserLicenseManager(userStore);
    }

    home() {
        const userLicense = this.userLicenseManager.getLicense();
        return ReportCard
            .create(userLicense, this.rangeReport, this.localization)
            .build();
    }
}