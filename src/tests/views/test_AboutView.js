class test_AboutView {
    constructor() {
        QUnit.module("AboutCard (views)");
        this.runTests();
    }

    runTests() {
        const tests = [
            "test_create"
        ];
        tests.forEach(test => this[test]());
    }

    test_create() {
        QUnit.test("create", (assert) => {
            const localization = AppManager.getLocalizationResources();
            const builder = AboutCard.create(localization);
            assert.ok(builder, "AboutCard should be created");
            const card = builder.build();
            assert.ok(card, "AboutCard should build successfully");
            const cardJson = JSON.parse(card.printJson());
            assert.strictEqual(
                cardJson.header.title,
                localization.cards.about.title,
                "About card title should match localization"
            );

        });
    }
}