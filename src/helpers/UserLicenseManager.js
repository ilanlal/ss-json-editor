// Google Apps Script code for Google Workspace Add-ons
class UserLicenseManager {
    constructor(userStore = new UserStore()) {
        this.userStore = userStore;
    }

    /**
     * Sets the user's license information.
     * 
     * @returns {UserLicense} The newly set UserLicense object.
     */
    setLicense(userId, planId, createdOn, utcExpirationDate = null, amount = 0) {
        const license = new UserLicense(
            userId, planId, createdOn, utcExpirationDate, amount);
        this.userStore.setUserLicense(license);

        return license;
    }
    /**
     * Retrieves the user's license information.
     * @returns {UserLicense | undefined} The user's license information, or undefined if not set.
     */
    getLicense() {
        const licenseData = this.userStore.getUserLicense();
        if (!licenseData) {
            return undefined;
        }
        return new UserLicense(
            licenseData.userId,
            licenseData.planId,
            licenseData.createdOn,
            licenseData.utcExpirationDate,
            licenseData.amount
        );
    }

    revokeLicense() {
        this.userStore.clearUserLicense();
    }
}
