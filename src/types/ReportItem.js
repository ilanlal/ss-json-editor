// src/types/ReportItem.js
/**
 * Represents a report item for a specific cell in Google Sheets.
 */
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
