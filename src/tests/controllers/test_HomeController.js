// Google Apps Script code for Google Workspace Add-ons
class test_HomeController {
    constructor() {
        QUnit.module("HomeController (controllers)");
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
        QUnit.test("Test home action", (assert) => {
            const localization = AppManager.getLocalizationResources();
            const userStore = ServiceBuilder.newUserStore();
            const homeAction = ControllerBuilder
                .newHomeController(localization, userStore)
                .home()
                .build()
                .printJson();

            const actionResponse = JSON.parse(homeAction);
            assert.ok(actionResponse, "Home card should be created successfully");
            const card = actionResponse.renderActions.action.navigations[0].pushCard;
            assert.ok(card, "Card should be created successfully");
            assert.strictEqual(
                card.header.title,
                localization.cards.home.title,
                "Card title should match localization"
            );
        });
    }
}