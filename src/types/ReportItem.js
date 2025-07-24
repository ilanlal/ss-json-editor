class ReportItem {
    /**
     * @param {string} a1Notation - A1 notation of the cell
     * @param {string} message - Error message, if any
     */
  constructor(a1Notation, message) {
    this.a1Notation = a1Notation; // A1 notation of the cell
    this.message = message; // Error message, if any
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
