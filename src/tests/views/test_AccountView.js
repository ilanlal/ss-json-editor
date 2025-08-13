class test_AccountView {
    constructor() {
        QUnit.module("AccountCard (views)");
        this.runTests();
    }

    runTests() {
        const tests = [
            "test_create"
        ];
        tests.forEach(test => this[test]());
    }

    test_create() {
        QUnit.test("Test create AccountCard", (assert) => {
            const localization = AppManager.getLocalizationResources();
            const userLicense = ModelBuilder.newUserLicense()
                .setAmount(0)
                .setUserId("me")
                .setPlanId("free trial")
                .setCreatedOn(new Date())
                .setExpirationDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));

            const cardBuilder = ViewBuilder.newAccountCard(userLicense, localization);
            assert.ok(cardBuilder, "AccountCard should be created");
            const card = cardBuilder
                .build()
                .printJson();
            assert.ok(card, "AccountCard should build successfully");
            const cardJson = JSON.parse(card);
            assert.ok(cardJson.header, "Account card header should be present");
            assert.strictEqual(
                cardJson.header.title,
                localization.cards.account.title,
                "Account card title should match localization"
            );

        });
    }
}