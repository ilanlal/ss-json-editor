// Google Apps Script code for Google Workspace Add-ons
class UserLicense {
    constructor(userId = '', planId = '', createdOn = null, expirationDate = null, amount = 0) {
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

    static fromJsonText(json = '{}') {
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

    static toJsonText(license) {
        if (!(license instanceof UserLicense)) {
            throw new Error("Invalid UserLicense object.");
        }

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