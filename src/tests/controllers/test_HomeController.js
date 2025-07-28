// Google Apps Script code for Google Workspace Add-ons
class test_HomeController {
    constructor() {
        QUnit.module("Home Controller Tests");
        this.runTests();
        QUnit.done(() => {
            //this.tearDown();
        });
    }

    runTests() {
        const tests = [
            "test_createHomeCard"
        ];
        tests.forEach(test => this[test]());
    }

    test_createHomeCard() {
        QUnit.test("Test createHomeCard", (assert) => {
            const localization = AppManager.getLocalizationResources();
            const userStore = new UserStore();
            const homeController = new HomeController(localization, userStore);
            const card = JSON.parse(homeController
                .createHomeCard()
                .printJson());
            assert.ok(card, "Home card should be created successfully");
            assert.strictEqual(
                card.header.title,
                localization.cards.home.title,
                "Home card title should match localization"
            );
        });
    }
}