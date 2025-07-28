// Google Apps Script code for Google Workspace Add-ons
class test_AccountController {
    constructor() {
        QUnit.module("Account controller Tests");
        this.runTests();
        QUnit.done(() => {
            //this.tearDown();
        });

    }

    runTests() {
        const tests = [
            "test_home"
        ];
        tests.forEach(test => this[test]());
    }

    test_home() {
        QUnit.test("Test home action", (assert) => {
            const controller = new AccountController();
            const card = JSON.parse(
                controller
                    .home()
                    .printJson());

            assert.ok(card, "Card should be created");
            assert.strictEqual(
                card.header.title,
                AppManager.getLocalizationResources().cards.account.title,
                "Card title should match localization"
            );
        });
    }
}