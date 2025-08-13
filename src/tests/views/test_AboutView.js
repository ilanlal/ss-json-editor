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
        QUnit.test("Test create AboutCard", (assert) => {
            const builder = ViewBuilder.newAboutCard();
            assert.ok(builder, "AboutCard should be created");
            const card = builder.build();
            assert.ok(card, "AboutCard should build successfully");
            const cardJson = JSON.parse(card.printJson());
            assert.ok(cardJson.header, "About card header should be present");

        });
    }
}