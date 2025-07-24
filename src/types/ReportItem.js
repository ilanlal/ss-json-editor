class ReportItem {
    /**
     * @param {string} a1Notation - A1 notation of the cell
     * @param {string} input - The original input value
     * @param {boolean} isValid - Boolean indicating if the value is valid
     * @param {string} message - Error message, if any
     * @param {boolean} [modified=false] - Boolean indicating if the value was modified
     */
  constructor(a1Notation, input='', isValid=true, message='', modified = false) {
    this.a1Notation = a1Notation; // A1 notation of the cell
    this.isValid = isValid; // Boolean indicating if the value is valid
    this.input = input; // The original input value
    this.status = isValid ? ReportItem.Status.VALID : ReportItem.Status.INVALID; // Status of the validation (e.g., 'valid', 'invalid')
    this.icon = isValid ? ReportItem.Icons.VALID : ReportItem.Icons.INVALID; // Icon representing the status
    this.message = message; // Error message, if any
    this.modified = modified; // Boolean indicating if the value was modified
  }
};

// create enum for ReportItem status
ReportItem.Status = {
    VALID: 'valid',
    INVALID: 'invalid',
    ERROR: 'error'
};
// create enum for ReportItem Icons
ReportItem.Icons = {
    VALID: '💫',
    INVALID: '⚠️',
    ERROR: '‼️'
};
