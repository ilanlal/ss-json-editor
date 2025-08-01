// Google Apps Script code for Google Workspace Add-ons
class test_AccountController {
    constructor() {
        QUnit.module("Account (controllers)");
        this.runTests();
        QUnit.done(() => {
            //this.tearDown();
        });

    }

    runTests() {
        const tests = [
            "test_home",
            "test_activatePremium",
            "test_revokePremium"
        ];
        tests.forEach(test => this[test]());
    }

    test_home() {
        QUnit.test("Test home action", (assert) => {
            const controller = new AccountController();
            const actionResponse = JSON.parse(
                controller
                    .home()
                    .build()
                    .printJson());

            assert.ok(actionResponse, "Action response should be created successfully");
            const card = 
                actionResponse.renderActions.action.navigations[0].pushCard;
            assert.ok(card, "Card should be created successfully");
            assert.strictEqual(
                card.header.title,
                AppManager.getLocalizationResources().cards.account.title,
                "Card title should match localization"
            );
        });
    }

    test_activatePremium() {
        QUnit.test("Test activatePremium action", (assert) => {
            const controller = new AccountController();
            const actionResponse = JSON.parse(
                controller
                    .activatePremium()
                    .build()
                    .printJson());

            assert.ok(actionResponse, "Action response should be created successfully");
        });
    }

    test_revokePremium() {
        QUnit.test("Test revokePremium action", (assert) => {
            const controller = new AccountController();
            const actionResponse = JSON.parse(
                controller
                    .revokePremium()
                    .build()
                    .printJson());

            assert.ok(actionResponse, "Action response should be created successfully");
        });
    }
}