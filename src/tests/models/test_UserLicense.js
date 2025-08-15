// Google Apps Script code for Google Workspace Add-ons
class test_UserLicense {
    constructor() {
        QUnit.module("User License (models)");
        this.runTests();
        QUnit.done(() => {
            //this.tearDown();
        });
    }

    runTests() {
        const tests = [
            "test_core"
        ];
        tests.forEach(test => this[test]());
    }

    test_core() {
        QUnit.test("Test UserLicense core operations", (assert) => {
            const userId = "user123";
            const planId = "plan456";
            const createdOn = new Date("2023-01-01T00:00:00Z");
            const expirationDate = new Date("2024-01-01T00:00:00Z");
            const amount = 100;
            const userLicense = UserLicense.fromJsonText(JSON.stringify({
                "userId": userId,
                "planId": planId,
                "createdOn": createdOn.toISOString(),
                "expirationDate": expirationDate.toISOString(),
                "amount": amount
            }));

            assert.ok(userLicense, "UserLicense instance should be created from JSON");
            assert.strictEqual(userLicense.userId, userId, "User ID should match");
            assert.strictEqual(userLicense.planId, planId, "Plan ID should match");
            assert.strictEqual(userLicense.createdOn.getTime(), createdOn.getTime(), "CreatedOn date should match");
            assert.strictEqual(userLicense.expirationDate.getTime(), expirationDate.getTime(), "Expiration date should match");
            assert.strictEqual(userLicense.amount, amount, "Amount should match");

            // check if active status is correct (by amount)
            assert.strictEqual(userLicense.isActive(), true, "UserLicense should be active based on amount");
            // check if amount is zero
            userLicense.setAmount(0);
            assert.strictEqual(userLicense.isActive(), false, "UserLicense should not be active when amount is zero");

            // check if a license is active based on expiration date
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            userLicense.setExpirationDate(tomorrow.toISOString());
            assert.strictEqual(userLicense.isActive(), true, "UserLicense should be active when not expired");

            // check toJsonString
            const jsonText = UserLicense.toJsonText(userLicense);
            assert.ok(jsonText, "toJsonString should return a valid JSON string");

            const json = JSON.parse(jsonText);
            assert.ok(json, "Parsed JSON should be defined");

            assert.strictEqual(json.userId, userId, "User ID should match");
            assert.strictEqual(json.planId, planId, "Plan ID should match");
            assert.strictEqual(new Date(json.createdOn).getTime(), createdOn.getTime(), "CreatedOn date should match");
            assert.strictEqual(new Date(json.expirationDate).getTime(), tomorrow.getTime(), "Expiration date should match");
            assert.strictEqual(json.amount, 0, "Amount should match");
        });
    }
}