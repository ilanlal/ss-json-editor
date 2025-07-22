// src/lib/JsonStudio.js
class JsonStudio {
    /**
     * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to get the optimal range for.
     * @param {Global_Resources["en"]} localization - Localization resources
     * @param {UserStore} userStore - User store instance
     */
    constructor(sheet, localization, userStore) {
        this.localization = localization || getLocalizationResources();
        this.sheet = sheet;

        this.userStore = userStore || new UserStore();
        this.maxCellSize = Static_Resources.limits.maxCellSize;
        this.identSpaces = this.userStore.getIdentSpaces();
        // Allocate a 2D array to store the validation report
        this.report = [[]];
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
            this.handleParseSuccess(a1Notation, formatted);
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
        this.report = new Array(values.length).fill(null).map(() => new Array(values[0].length).fill(null));
        // Map through the values and minify each cell
        const newValues = values
            .map((row, i) => row
                .map((cell, j) => {
                    // Minify JSON code
                    return this.minifyCell(range.getCell(i + 1, j + 1), cell);
                }));

        range.setValues(newValues);
    }

    minifyCell(a1Notation, cell) {
        const trimmedCell = this.trimCell(cell);
        // if cell is empty after cleaning, return empty string
        if (!trimmedCell || trimmedCell === '') {
            this.handleParseSuccess(a1Notation, cell);
            return cell; // Return the original cell value
        }

        try {
            const minified = JSON.stringify(
                JSON.parse(trimmedCell));

            this.handleParseSuccess(a1Notation, minified);
            return minified; // Return the minified JSON string
        } catch (error) {
            // If parsing fails, handle the error
            this.handleParseException(a1Notation, cell, error);
            return cell; // Return the original cell value
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

    handleParseSuccess(a1Notation, cell) {
        // Handle the success case, e.g., by returning the cell value
        if (!this.report[a1Notation.getRow() - 1]) {
            this.report[a1Notation.getRow() - 1] = [];
        }
        if (!this.report[a1Notation.getRow() - 1][a1Notation.getColumn() - 1]) {
            this.report[a1Notation.getRow() - 1][a1Notation.getColumn() - 1] = {};
        }
        // Update the report with the success status
        this.report[a1Notation.getRow() - 1][a1Notation.getColumn() - 1] = {
            isValid: true,
            icon: '✓',
            range: a1Notation.getA1Notation(),
            input: cell,
            message: 'Valid JSON'
        };

        return cell; // Return the original cell value
    }

    handleParseException(a1Notation, cell, error) {
        // Handle the error by adding a note to the cell
        if (!this.report[a1Notation.getRow() - 1]) {
            this.report[a1Notation.getRow() - 1] = [];
        }
        if (!this.report[a1Notation.getRow() - 1][a1Notation.getColumn() - 1]) {
            this.report[a1Notation.getRow() - 1][a1Notation.getColumn() - 1] = {};
        }
        // Update the report with the error status
        this.report[a1Notation.getRow() - 1][a1Notation.getColumn() - 1] = {};
        // Create a detailed error message
        const errorMessage = `Error parsing JSON: ${error.message}`;
        // Optionally, you can set a note on the cell with the error message
        this.report[a1Notation.getRow() - 1][a1Notation.getColumn() - 1] = {
            isValid: false,
            icon: '⊗',
            range: a1Notation.getA1Notation(),
            message: errorMessage,
            input: cell
        };

        //a1Notation.setNote(errorMessage);
        return cell; // Return the original cell value
    }

    getTotalFailures() {
        // Count the total number of failures in the report
        return this.report.flat().filter(cell => !cell.isValid).length;
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
