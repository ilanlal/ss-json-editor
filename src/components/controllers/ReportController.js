// Google Apps Script code for Google Workspace Add-ons
class ReportController {
    /**
     * Represents a report for a specific range in Google Sheets.
     * @param {RangeReport} rangeReport - The report for the range.
     */
    constructor(localization, userStore, userInfo) {
        this.localization = localization;
        this.userStore = userStore;
        this.userLicense = userInfo?.getUserLicense();
        this.userInfo = userInfo;
    }

    static newReportController(localization, userStore, userInfo) {
        return new ReportController(localization, userStore, userInfo);
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
                        ViewBuilder
                            .newReportCard(rangeReport, this.userLicense, this.localization)
                            .build()
                    )
            );
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
        const a1Notation = e?.parameters?.a1Notation;
        if (!a1Notation) {
            throw new Error("No A1 notation provided in the event parameters.");
        }

        const sheetName = e?.parameters?.sheetName;
        if (!sheetName) {
            throw new Error("No sheet name provided in the event parameters.");
        }

        const rangeService = ServiceBuilder.newRangeService(sheetName, a1Notation);

        const currentColor = rangeService.getBackgroundColor();
        if (currentColor === '#ffffff' || currentColor === 'white') {
            // Highlight the range in the Google Sheets UI
            rangeService.setBackgroundColor('#ffff00');
        }
        else {
            rangeService.setBackgroundColor('#ffffff');
        }

        // Return a notification to the user
        return CardService.newActionResponseBuilder()
            .setNotification(
                CardService.newNotification()
                    .setText(
                        this.localization.messages.focusedOnCell.replace("{0}", a1Notation)));
    }
}