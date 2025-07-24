// src/lib/JsonStudio.js
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
        this.maxCellSize = Static_Resources.limits.maxCellSize;
        this.identSpaces = this.userStore.getIdentSpaces();
        // Allocate a 2D array to store the validation report
        this.report = [ReportItem];
        // Initialization code
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
                    return this.formatCell(range.getCell(i + 1, j + 1), cell);
                }));

        range.setValues(newValues);
    }

    formatCell(a1Notation, cell) {
        const trimmedCell = this.trimCell(cell);
        // if cell is empty after cleaning, return empty string
        if (!trimmedCell || trimmedCell === '') {
            this.handleParseSuccess(a1Notation, cell);
            return cell; // Return the original cell value
        }

        try {
            const formatted = JSON.stringify(
                // value
                JSON.parse(trimmedCell),
                // replacer
                null,
                // space
                this.identSpaces * 1);
            this.handleParseSuccess(a1Notation, formatted, true);
            return formatted; // Return the formatted JSON string
        } catch (error) {
            // If parsing fails, handle the error
            this.handleParseException(a1Notation, cell, error);
            return cell; // Return the original cell value
        }
    }

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
                    return this.minifyCell(range.getCell(i + 1, j + 1), cell);
                }));

        range.setValues(newValues);
    }

    minifyCell(range, cell) {
        const trimmedCell = this.trimCell(cell);
        // if cell is empty after cleaning, return empty string
        if (!trimmedCell || trimmedCell === '') {
            this.handleParseSuccess(range, cell);
            return cell; // Return the original cell value
        }

        try {
            const minified = JSON.stringify(
                JSON.parse(trimmedCell));

            this.handleParseSuccess(range, minified, true);
            return minified; // Return the minified JSON string
        } catch (error) {
            // If parsing fails, handle the error
            this.handleParseException(range, cell, error);
            return cell; // Return the original cell value
        }
    }

    focusCell(a1n) {
        const range = this.sheet.getRange(a1n);
        range.activateAsCurrentCell();
    }

    focusRange(a1n) {
        const range = this.sheet.getRange(a1n);
        range.activate();
    }

    highlightRange(a1n) {
        const range = this.sheet.getRange(a1n);
        range.activateAsCurrentCell();
        const orgColor = range.getBackground();
        for (let i = 0; i < 3; i++) {
            // set the background color blink to yellow for 1 second
            range.setBackground('#FFFF00');
            // flush the changes
            SpreadsheetApp.flush();
            // sleep for 1 seconds
            Utilities.sleep(300);
            range.setBackground(orgColor);
            SpreadsheetApp.flush();
            Utilities.sleep(400);
        }
    }

    saveValuToCell(a1n, value) {
        const localization = AppManager.getLocalizationResources();

        try {
            const range = this.sheet.getRange(a1n);
            range.setValue(value);
            return {
                a1n: a1n,
                input: value,
                message: localization.message.success,
            };
        }
        catch (error) {
            this.sheet.toast(
                localization.message.error, error.toString(), 15);
            throw error;
        }
    }

    trimCell(cell) {
        if (typeof cell !== 'string') {
            // If the cell is not a string, return it as is
            return cell;
        }

        // Trim whitespace from the cell value
        return cell?.toString().replace(/[\n\r]/g, '').trim();
    }

    handleParseSuccess(range, cell, modified = false) {
        // Handle the success case, e.g., by returning the cell value
        const reportItem = new ReportItem({
            a1Notation: range.getA1Notation(),
            input: cell,
            isValid: true,
            message: '',
            modified: modified
        });

        // Add the report item to the report
        this.report.push(reportItem);

        return cell; // Return the original cell value
    }

    handleParseException(range, cell, error) {
        // Create a detailed error message
        const errorMessage = `${error.message}`;
        // Optionally, you can set a note on the cell with the error message
        const reportItem = new ReportItem({
            a1Notation: range.getA1Notation(),
            input: cell,
            isValid: false,
            message: errorMessage
        });

        // Add the report item to the report
        this.report.push(reportItem);

        //a1Notation.setNote(errorMessage);
        return cell; // Return the original cell value
    }

    getReport() {
        // Return the report containing validation results
        return this.report;
    }

    /**
     * Check if the provided range is valid and does not exceed the maximum allowed size.
     * @param {GoogleAppsScript.Spreadsheet.Range} range - The range to validate.
     * @returns {boolean} - True if the range is valid, false otherwise.
     */
    static isRangeWithinLimits(range) {
        // Check if the range is valid and does not exceed the maximum allowed size
        if (!range || !range.getNumRows || !range.getNumColumns) {
            return true; // If range is not valid, consider it within limits
        }

        // if not selected range, return true
        if (range.getA1Notation() === 'A1') {
            return true;
        }
        // Check if the range is valid
        return range.getNumRows() * range.getNumColumns() <= Static_Resources.limits.maxCellSize;
    }
}
