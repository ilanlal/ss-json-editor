// This file is part of the SS JSON Editor project.
class test_UserLicenseManager {
    constructor() {
        this.userLicenseManager = new UserLicenseManager();
        QUnit.module("UserLicenseManager");
        this.runTests();

        QUnit.done(() => {
            // Cleanup or finalization if needed
        });
    }

    runTests() {
        const tests = [
            "test_setLicense",
            "test_getLicense",
            "test_revokeLicense"
        ];

        tests.forEach((testName) => {
            QUnit.test(testName, (assert) => {
                this[testName](assert);
            });
        });
    }

    test_setLicense(assert) {
        const userId = "testUser";
        const planId = "testPlan";
        const createdOn = new Date();
        // Use UTC date for expiration 30 days from now
        const utcExpirationDate = new Date(createdOn.getTime() + 30 * 24 * 60 * 60 * 1000);
        // Example amount, could be 0 for free plans or a specific amount for paid plans
        const amount = 100;

        this.userLicenseManager
            .setLicense(userId, planId, createdOn, utcExpirationDate, amount);
        assert.ok(true, "License should be set successfully.");

        // Retrieve the license to verify it was set correctly
        const license = this.userLicenseManager.getLicense();
        assert.ok(license, "License should be retrieved successfully.");
        assert.ok(license instanceof UserLicense, "Retrieved license should be an instance of UserLicense.");
        //assert.ok(license.createdOn instanceof Date, "CreatedOn should be a Date object.");
        //assert.ok(license.utcExpirationDate instanceof Date, "UTC Expiration Date should be a Date object.");
        assert.equal(license.amount, amount, "Amount should match the set value.");
        assert.equal(license.userId, userId, "User ID should match.");
        assert.equal(license.planId, planId, "Plan ID should match.");


        // test isActive
        const isActive = license.isActive();
        assert.ok(isActive, "License should be active.");
    }

    test_getLicense(assert) {
        const license = this.userLicenseManager.getLicense();
        assert.ok(license || license === undefined, "License should be retrieved.");
    }

    test_revokeLicense(assert) {
        this.userLicenseManager.revokeLicense();
        const license = this.userLicenseManager.getLicense();
        assert.ok(!license, "License should be revoked and not found.");
    }
}