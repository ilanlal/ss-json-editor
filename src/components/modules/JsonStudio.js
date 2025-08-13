// Google Apps Script code for Google Workspace Add-ons
class JsonStudio {
    constructor() {
    }
    
    /**
     * @param {*} range 
     * @param {number} indentSpaces
     * @returns RangeReport
     */
    prettifyRange(range, indentSpaces = 2) {
        const report = ModuleBuilder.newRangeReport().setRange(range);
        const values = range.getValues();

        // Check if the range is valid and does not exceed the maximum allowed size
        const newValues = values
            .map((row, i) => row
                .map((cell, j) => {
                    // Format JSON code
                    try {
                        // if cell is empty after cleaning, return empty string
                        if (this.trimValue(cell) === '') {
                            return cell; // Return the original cell value
                        }

                        const newValue = JSON.stringify(
                            // value
                            JSON.parse(cell),
                            // replacer
                            null,
                            // space
                            indentSpaces);

                        report.incrementEffectedCells();
                        return newValue;
                    } catch (error) {
                        report.addItem(ReportItem.createInvalid(
                            range.getCell(i + 1, j + 1).getA1Notation(), `${error.message}`)
                        );

                        return cell; // Return the original cell value
                    }
                }));

        range.setValues(newValues);

        return report;
    }

    /**
     * @param {*} range 
     * @returns RangeReport
     */
    minifyRange(range) {
        const report = ModuleBuilder.newRangeReport().setRange(range);
        const values = range.getValues();

        // Map through the values and minify each cell
        const newValues = values
            .map((row, i) => row
                .map((cell, j) => {
                    try {
                        // if cell is empty after cleaning, return empty string
                        if (this.trimValue(cell) === '') {
                            return cell; // Return the original cell value
                        }

                        const newValue = JSON.stringify(JSON.parse(cell));
                        report.incrementEffectedCells();
                        return newValue;
                    } catch (error) {
                        report.addItem(ReportItem.createInvalid(
                            range.getCell(i + 1, j + 1).getA1Notation(), `${error.message}`)
                        );

                        return cell; // Return the original cell value
                    }

                }));

        range.setValues(newValues);

        return report;
    }

    trimValue(value) {
        if (typeof value !== 'string') {
            // If the cell is not a string, return it as is
            return value;
        }

        // Trim whitespace from the cell value
        return value?.toString()?.replace(/[\n\r]/g, '')?.trim();
    }

    static newInstance() {
        return new JsonStudio();
    }
}
