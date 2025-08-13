// Google Apps Script code for Google Workspace Add-ons
class ReportItem {
  /**
   * @param {string} a1Notation - A1 notation of the cell
   * @param {string} message - Error message, if any
   * @param {string} status - Status of the report item
   */
  constructor() {
    this.a1Notation = ''; // A1 notation of the cell
    this.message = ''; // Error message, if any
    this.status = ReportItem.Status.VALID; // Status of the report item
  }

  getEmoji() {
    return ReportItem.Icons[this.status] || ReportItem.Icons.VALID;
  }

  getA1Notation() {
    return this.a1Notation;
  }

  setA1Notation(a1Notation) {
    this.a1Notation = a1Notation;
    return this;
  }

  getMessage() {
    return this.message;
  }

  setMessage(message) {
    this.message = message;
    return this;
  }

  getStatus() {
    return this.status;
  }

  setStatus(status) {
    if (!Object.values(ReportItem.Status).includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    this.status = status;
    this.icon = ReportItem.Icons[status] || ReportItem.Icons.VALID; // Update icon based on status
    return this;
  }

  static newReportItem() {
    return new ReportItem();
  }
};

// create enum for ReportItem status
ReportItem.Status = {
  VALID: 'VALID',
  INVALID: 'INVALID'
};

// create enum for ReportItem Icons
ReportItem.Icons = {
  VALID: '💫',
  INVALID: '⚠️'
};
