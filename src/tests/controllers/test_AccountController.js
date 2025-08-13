// Google Apps Script code for Google Workspace Add-ons
class test_AccountController {
    constructor() {
        QUnit.module("AccountController (controllers)");
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
            const action = ControllerBuilder.newAccountController()
                .home()
                .build()
                .printJson();

            const actionResponse = JSON.parse(action);

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
            const action = ControllerBuilder.newAccountController()
                .activatePremium()
                .build()
                .printJson();
            const actionResponse = JSON.parse(action);

            assert.ok(actionResponse, "Action response should be created successfully");
        });
    }

    test_revokePremium() {
        QUnit.test("Test revokePremium action", (assert) => {
            const action = ControllerBuilder.newAccountController()
                .revokePremium()
                .build()
                .printJson();
            const actionResponse = JSON.parse(action);

            assert.ok(actionResponse, "Action response should be created successfully");
        });
    }
}