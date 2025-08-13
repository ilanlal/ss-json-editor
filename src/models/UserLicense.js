// Google Apps Script code for Google Workspace Add-ons
class UserLicense {
    /**
     * Create a user license.
     * @param {string} userId - ID of the user associated with the license
     * @param {string} planId - ID of the plan associated with the license
     * @param {Date} createdOn - Creation date in ISO format
     * @param {Date} expirationDate - Expiration date in ISO format
     * @param {number} [amount=0] - Amount associated with the license, default is 0 (e.g., for tokens or credits)
     */
    constructor(userId='', planId='', createdOn=null, expirationDate=null, amount=0) {
        this.userId = userId;
        this.planId = planId;
        this.createdOn = createdOn;
        this.expirationDate = expirationDate;
        this.amount = amount;
    }

    setCreatedOn(createdOn) {
        this.createdOn = createdOn;
        return this;
    }

    getCreatedOn() {
        return this.createdOn;
    }

    setAmount(amount) {
        this.amount = amount;
        return this;
    }

    getAmount() {
        return this.amount;
    }

    setPlanId(planId) {
        this.planId = planId;
        return this;
    }

    getPlanId() {
        return this.planId;
    }

    setUserId(userId) {
        this.userId = userId;
        return this;
    }

    getUserId() {
        return this.userId;
    }

    setExpirationDate(expirationDate) {
        this.expirationDate = expirationDate;
        return this;
    }

    getExpirationDate() {
        return this.expirationDate;
    }

    /**
     * Check if the license is active based on the current date and expiration date.
     * @returns {boolean} - True if the license is active, false otherwise
     */
    isActive() {
        // Check if the license is active based on the current date and expiration date
        const now = new Date();
        return (now < new Date(this.expirationDate)) || this.amount > 0;
    }

    static fromJSON(json) {
        // Parse the JSON string into a UserLicense object
        const data = JSON.parse(json, (key, value) => {
            if (key === 'createdOn' || key === 'expirationDate') {
                return new Date(value); // Convert date strings back to Date objects
            }
            return value;
        });

        return new UserLicense(
            data.userId,
            data.planId,
            data.createdOn,
            data.expirationDate,
            data.amount
        );
    }

    static toJSON(license) {
        return JSON.stringify({
            userId: license.userId,
            planId: license.planId,
            createdOn: license.createdOn,
            expirationDate: license.expirationDate,
            amount: license.amount
        });
    }

    static newUserLicense() {
        return new UserLicense().setCreatedOn(new Date().toISOString());
    }
}