class test_UserLicense {
    constructor() {
        QUnit.module("User License Tests");
        this.runTests();
        QUnit.done(() => {
            //this.tearDown();
        });
    }

    runTests() {
        const tests = [
            "test_constructor",
            "test_isActive"
        ];
        tests.forEach(test => this[test]());
    }

    test_constructor() {
        QUnit.test("Test UserLicense Constructor", (assert) => {
            const userId = "user123";
            const planId = "plan456";
            const createdOn = new Date("2023-01-01T00:00:00Z");
            const utcExpirationDate = new Date("2024-01-01T00:00:00Z");
            const amount = 100;
            const userLicense = new UserLicense(userId, planId, createdOn, utcExpirationDate, amount);
            assert.ok(userLicense, "UserLicense instance should be created");
            assert.strictEqual(userLicense.userId, userId, "User ID should match");
            assert.strictEqual(userLicense.planId, planId, "Plan ID should match");
            assert.strictEqual(userLicense.createdOn.getTime(), createdOn.getTime(), "CreatedOn date should match");
            assert.strictEqual(userLicense.utcExpirationDate.getTime(), utcExpirationDate.getTime(), "Expiration date should match");
            assert.strictEqual(userLicense.amount, amount, "Amount should match");
        });
    }

    test_isActive() {
        QUnit.test("Test UserLicense isActive Method", (assert) => {
            const userId = "user123";
            const planId = "plan456";
            const createdOn = new Date("2023-01-01T00:00:00Z");
            const utcExpirationDate = new Date("2024-01-01T00:00:00Z");
            const amount = 100;
            const userLicense = new UserLicense(userId, planId, createdOn, utcExpirationDate, amount);
            assert.strictEqual(userLicense.isActive(), true, "UserLicense should be active");

            // Test with an expired license
            const expiredDate = new Date("2022-01-01T00:00:00Z");
            const expiredLicense = new UserLicense(userId, planId, createdOn, expiredDate);
            assert.strictEqual(expiredLicense.isActive(), false, "Expired UserLicense should not be active");
        });
    }
}