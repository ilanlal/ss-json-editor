class test_AboutController {
    constructor() {
        QUnit.module("AboutController (controllers)");
        this.runTests();
    }

    runTests() {
        const tests = [
            "test_home"
        ];
        tests.forEach(test => this[test]());
    }

    test_home() {
        QUnit.test("home", (assert) => {
            const localization = AppManager.getLocalizationResources();
            const controller = new AboutController(localization);
            assert.ok(controller, "AboutController should be created");
            const actionResponse = JSON.parse(
                controller
                    .home()
                    .build()
                    .printJson());
                    
            assert.ok(actionResponse, "ActionResponse should be created");
            const card =
                actionResponse.renderActions.action.navigations[0].pushCard;
            assert.ok(card, "Card should be created successfully");
        });
    }
}
