// Google Apps Script code for Google Workspace Add-ons
class UserLicense {
    /**
     * Create a user license.
     * @param {string} userId - ID of the user associated with the license
     * @param {string} planId - ID of the plan associated with the license
     * @param {Date} createdOn - Creation date in ISO format
     * @param {Date} [utcExpirationDate=null] - Expiration date in ISO format
     * @param {number} [amount=0] - Amount associated with the license, default is 0 (e.g., for tokens or credits)
     */
    constructor(userId, planId, createdOn, utcExpirationDate = null, amount = 0) {
        this.userId = userId; // ID of the user associated with the license
        this.planId = planId; // ID of the plan associated with the license
        this.createdOn = createdOn; // Creation date in UTC format
        this.utcExpirationDate = utcExpirationDate; // Expiration date in UTC format
        this.amount = amount; // Amount associated with the license
    }
    /**
     * Check if the license is active based on the current date and expiration date.
     * @returns {boolean} - True if the license is active, false otherwise
     */
    isActive() {
        // Check if the license is active based on the current date and expiration date
        const now = new Date();
        return (now < new Date(this.utcExpirationDate)) || this.amount > 0;
    }
}