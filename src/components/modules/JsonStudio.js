// Google Apps Script code for Google Workspace Add-ons
class JsonStudio {
    /**
     * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to get the optimal range for.
     * @param {Global_Resources["en"]} localization - Localization resources
     * @param {UserStore} userStore - User store instance
     */
    constructor(sheet, localization, userStore) {
        this.sheet = sheet;
        this.localization = localization || AppManager.getLocalizationResources();
        this.userStore = userStore || new UserStore();
        this.indentSpaces = this.userStore.getIndentSpaces();
        this.rangeReport = new RangeReport(sheet.getActiveRange());
    }

    formatRange() {
        const range = SpreadsheetHelper.getOptimalRange(this.sheet);
        // Check if the range is valid and does not exceed the maximum allowed size
        if (!JsonStudio.isRangeWithinLimits(range)) {
            throw new Error(this.localization.messages.outOfRange);
        }

        const values = range.getValues();

        // Check if the range is valid and does not exceed the maximum allowed size
        const newValues = values
            .map((row, i) => row
                .map((cell, j) => {
                    // Format JSON code
                    return this.formatCell(
                        range.getCell(i + 1, j + 1).getA1Notation(), cell);
                }));

        range.setValues(newValues);

        return this.getReport();
    }

    formatCell(a1Notation, cell) {
        const trimmedCell = this.trimCell(cell);
        // if cell is empty after cleaning, return empty string
        if (!trimmedCell || trimmedCell === '') {
            return cell; // Return the original cell value
        }

        try {
            const formatted = JSON.stringify(
                // value
                JSON.parse(trimmedCell),
                // replacer
                null,
                // space
                this.indentSpaces * 1);
            return formatted; // Return the formatted JSON string
        } catch (error) {
            // If parsing fails, handle the error
            this.rangeReport.addItem(
                new ReportItem(
                    a1Notation,
                    `${error.message}`,
                    ReportItem.Status.INVALID
                )
            );
            return cell; // Return the original cell value
        }
    }

    /**
     * Minify the range of cells in the sheet.
     *
     * @returns {RangeReport} - Returns a RangeReport object containing validation results.
     * @throws {Error} - Throws an error if the selected range exceeds the maximum allowed.
     */
    minifyRange() {
        const range = SpreadsheetHelper.getOptimalRange(this.sheet);
        // Check if the range is valid and does not exceed the maximum allowed size
        if (!JsonStudio.isRangeWithinLimits(range)) {
            throw new Error(this.localization.messages.outOfRange);
        }
        const values = range.getValues();

        // Map through the values and minify each cell
        const newValues = values
            .map((row, i) => row
                .map((cell, j) => {
                    // Minify JSON code
                    return this.minifyCell(
                        range.getCell(i + 1, j + 1).getA1Notation(), cell);
                }));

        range.setValues(newValues);

        return this.getReport();
    }

    minifyCell(a1Notation, cell) {
        const trimmedCell = this.trimCell(cell);
        // if cell is empty after cleaning, return empty string
        if (!trimmedCell || trimmedCell === '') {
            return cell; // Return the original cell value
        }

        try {
            const minified = JSON.stringify(
                JSON.parse(trimmedCell));

            return minified; // Return the minified JSON string
        } catch (error) {
            // If parsing fails, handle the error
            this.rangeReport.addItem(
                new ReportItem(
                    a1Notation,
                    `${error.message}`,
                    ReportItem.Status.INVALID
                )
            );
            return cell; // Return the original cell value
        }
    }

    trimCell(cell) {
        if (typeof cell !== 'string') {
            // If the cell is not a string, return it as is
            return cell;
        }

        // Trim whitespace from the cell value
        return cell?.toString()?.replace(/[\n\r]/g, '')?.trim();
    }

    getReport() {
        // Return the report containing validation results
        return this.rangeReport;
    }

    /**
     * Check if the provided range is valid and does not exceed the maximum allowed size.
     * @param {GoogleAppsScript.Spreadsheet.Range} range - The range to validate.
     * @returns {boolean} - True if the range is valid, false otherwise.
     */
    static isRangeWithinLimits(range) {
        // Check if the range is valid and does not exceed the maximum allowed size
        return SpreadsheetHelper.isRangeWithinLimits(range);
    }
}
