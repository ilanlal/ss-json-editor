// src/lib/JsonStudio.js
class JsonStudio {
    /**
     * @param {Global_Resources["en"]} localization - Localization resources
     * @param {UserStore} userStore - User store instance
     */
    constructor(localization, userStore) {
        this.maxCellSize = Static_Resources.limits.maxCellSize; // Maximum number of cells in a range
        this.localization = localization || getLocalizationResources();
        this.userStore = userStore || new UserStore();
        // Initialization code
    }

    formatRange(range, identSpaces = this.userStore.getIdentSpaces()) {
        if (!this.isRangeValid(range)) {
            return;
        }
        const values = range.getValues();
        const newValues = values
            .map(row => row
                .map(cell => {
                    // Format JSON code
                    return this.formatCell(cell, identSpaces);
                }));

        range.setValues(newValues);
    }

    formatCell(cell, identSpaces = this.userStore.getIdentSpaces()) {
        const trimmedCell = this.trimCell(cell);
        // if cell is empty after cleaning, return empty string
        if (!trimmedCell || trimmedCell === '') {
            return cell;
        }

        try {
            return JSON.stringify(
                // value
                JSON.parse(trimmedCell),
                // replacer
                null,
                // space
                identSpaces*1);
        } catch (error) {
            // If parsing fails, handle the error
            return this.handleCellError(cell, error);
        }
    }

    minifyRange(range) {
        if (!this.isRangeValid(range)) {
            return;
        }
        const values = range.getValues();

        const newValues = values
            .map((row, i) => row
                .map((cell, j) => {
                    // Minify JSON code
                    return this.minifyCell(cell);
                }));

        range.setValues(newValues);
    }

    minifyCell(cell) {
        const trimmedCell = this.trimCell(cell);
        // if cell is empty after cleaning, return empty string
        if (!trimmedCell || trimmedCell === '') {
            return cell;
        }

        try {
            return JSON.stringify(
                JSON.parse(trimmedCell));
        } catch (error) {
            // If parsing fails, handle the error
            return this.handleCellError(cell, error);
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

    handleCellError(cell, error) {
        if (this.userStore.getFailNoteFlag()) {
            const message = `Error parsing JSON in cell ${cell.getA1Notation()}: ${error.message}`;
            // Add a note to the cell if JSON parsing fails
            cell.setNote(message);
        }
        return cell;
    }

    isRangeValid(range) {
        // Check if the range is valid and does not exceed the maximum allowed size
        if (!range || !range.getNumRows || !range.getNumColumns) {
            return false;
        }
        // Check if the range is valid
        return range.getNumRows() * range.getNumColumns() <= this.maxCellSize
    }
}
