// Google Apps Script code for Google Workspace Add-ons
class ReportItem {
    /**
     * @param {string} a1Notation - A1 notation of the cell
     * @param {string} message - Error message, if any
     * @param {string} status - Status of the report item
     */
  constructor(a1Notation, message, status = ReportItem.Status.VALID) {
    this.a1Notation = a1Notation; // A1 notation of the cell
    this.message = message; // Error message, if any
    this.status = status; // Status of the report item
    // Icon representing the status
    /** @type {string} */
    this.icon = ReportItem.Icons[status] || ReportItem.Icons.VALID; // Icon representing the status
  }
};

// create enum for ReportItem status
ReportItem.Status = {
    VALID: 'VALID',
    INVALID: 'INVALID',
    ERROR: 'ERROR'
};
// create enum for ReportItem Icons
ReportItem.Icons = {
    VALID: '💫',
    INVALID: '⚠️',
    ERROR: '‼️'
};
