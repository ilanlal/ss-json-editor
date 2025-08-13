// Apps Script code for Google Workspace Add-ons
class JsonStudioController {
    constructor(localization, userStore) {
        this.localization = localization;
        this.userStore = userStore;
        this.userLicense = this.userStore.getUserLicense();
        this.indentSpaces = this.userStore.getIndentSpaces() || "2";
    }

    /**
     * Creates a new instance of JsonStudioController with the necessary dependencies.
     * @returns {JsonStudioController}
     */
    static newJsonStudioController(localization, userStore) {
        return new JsonStudioController(localization, userStore);
    }

    validateRange(range) {
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
        const jsonStudio = ModuleBuilder.newJsonStudio();

        // Call the formatRange method of JsonStudio
        const rangeReport = jsonStudio.prettifyRange(range, indentSpaces);

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
        const jsonStudio = new JsonStudio(this.localization, this.userStore);

        // Call the minifyRange method of JsonStudio
        const rangeReport = jsonStudio.minifyRange(range);
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
        return new ReportController(this.userStore, this.localization)
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
