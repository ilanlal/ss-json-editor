// Apps Script code for Google Workspace Add-ons
class JsonStudioController {
    constructor(localization, userStore, userInfo) {
        this.localization = localization;
        this.userStore = userStore;
        this.userLicense = userInfo?.getUserLicense();
        this.indentSpaces = this.userStore.getIndentSpaces() || "2";
        this.userInfo = userInfo;
    }

    /**
     * Creates a new instance of JsonStudioController with the necessary dependencies.
     * @returns {JsonStudioController}
     */
    static newJsonStudioController(localization, userStore, userInfo) {
        return new JsonStudioController(localization, userStore, userInfo);
    }

    validateRange(range) {
        if (!range || !range.getA1Notation) {
            throw new Error("Invalid range object provided.");
        }
        const maxRows = 100; // Example limit
        const maxColumns = 10; // Example limit
        if (range.getNumRows() > maxRows || range.getNumColumns() > maxColumns) {
            throw new Error(`Selected range exceeds limits: ${maxRows} rows and ${maxColumns} columns.`);
        }
        return this;
    }


    /**
     * @returns {CardService.ActionResponse}
     */
    prettifyRange(range, indentSpaces = 2) {
        if (!range || !range.getA1Notation) {
            throw new Error("Invalid range object provided.");
        }

        // Call the formatRange method of JsonStudio
        const rangeReport = ServiceBuilder.newJsonStudio()
            .prettifyRange(range, indentSpaces);

        // If there are results, create and return the report card
        if (rangeReport.hasItems()) {
            return this.handleInvalidJsonReport(rangeReport);
        }


        return this.handleOperationSuccess(rangeReport);
    }

    /**
     * @returns {CardService.ActionResponse}
     */
    minifyRange(range) {
        if (!range || !range.getA1Notation) {
            throw new Error("Invalid range object provided.");
        }
        const rangeReport = ServiceBuilder.newJsonStudio()
            .minifyRange(range);
        // If there are results, create and return the report card
        if (rangeReport.hasItems()) {
            return this.handleInvalidJsonReport(rangeReport);
        }


        return this.handleOperationSuccess(rangeReport);
    }

    /**
     * @returns {CardService.ActionResponse}
     */
    handleOperationSuccess(rangeReport) {
        return CardService.newActionResponseBuilder()
            .setNotification(
                CardService.newNotification()
                    .setText(
                        this.localization.messages.operationSuccess
                            .replace("{0}", rangeReport.getEffectedCells())
                    ))
            .setStateChanged(true);
    }

    /**
     * @returns {CardService.ActionResponse}
     */
    handleInvalidJsonReport(rangeReport) {
        return ControllerBuilder.newReportController(this.localization, this.userStore)
            .home(rangeReport)
            .setStateChanged(true);
    }

    /**
     * @returns {CardService.ActionResponse}
     */
    handleOutOfRange(range, maxRangeSize) {
        return CardService.newActionResponseBuilder()
            .setNotification(
                CardService.newNotification()
                    .setText(this.localization.messages.outOfRange
                        .replace("{1}", range.getA1Notation())
                        .replace("{0}", maxRangeSize)
                    ))
            .setStateChanged(false);
    }

    isOutOfRange(range) {
        return !SpreadsheetHelper.isRangeWithinLimits(range);
    }
}
