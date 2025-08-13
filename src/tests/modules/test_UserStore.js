// Google Apps Script code for Google Workspace Add-ons
class test_UserStore {
    constructor() {
        QUnit.module("UserStore (modules)");
        // Clean up after tests
        QUnit.done(() => {
            // Any necessary cleanup can be done here
            // For example, resetting the user license to its original state
            ModuleBuilder.newUserStore().setUserLicense(this.originalUserLicense);
            ModuleBuilder.newUserStore().setLocalizationCode(this.originalLocalizationCode);
            ModuleBuilder.newUserStore().setIndentSpaces(this.originalIndentSpaces);
        });
        this.runTests();
    }

    setOriginalUserLicense(userLicense) {
        this.originalUserLicense = userLicense;
    }

    setOriginalLocalizationCode(localizationCode) {
        this.originalLocalizationCode = localizationCode;
    }

    setOriginalIndentSpaces(indentSpaces) {
        this.originalIndentSpaces = indentSpaces;
    }

    runTests() {
        const tests = [
            this.test_localization.bind(this),
            this.test_indentSpaces.bind(this),
            this.test_userLicenseCRUD.bind(this)
        ];
        tests.forEach(test => {
            try {
                test();
            } catch (error) {
                console.error(`Test failed: ${test.name} at UserStore (modules)`);
                console.error(error);
            }
        });
    }

    test_indentSpaces() {
        QUnit.test("indentSpaces", (assert) => {
            // Set up initial indentSpaces
            this.setOriginalIndentSpaces(ModuleBuilder.newUserStore().getIndentSpaces());
            assert.ok(this.originalIndentSpaces, "Original indentSpaces should be defined");

            ModuleBuilder.newUserStore().setIndentSpaces(4);
            const indentSpaces = ModuleBuilder.newUserStore().getIndentSpaces();
            assert.equal(indentSpaces, 4, "indentSpaces should return the correct indentSpaces");

            // check if indentSpaces is set to a different value
            ModuleBuilder.newUserStore().setIndentSpaces("6");
            const newIndentSpaces = ModuleBuilder.newUserStore().getIndentSpaces();
            assert.equal(newIndentSpaces, 6, "indentSpaces should return the correct indentSpaces");

            // Check for default value if no input is provided
            ModuleBuilder.newUserStore().setIndentSpaces(""); // Reset to empty to check default
            const defaultIndentSpaces = ModuleBuilder.newUserStore().getIndentSpaces();
            assert.equal(defaultIndentSpaces, UserStore.Constants.DEFAULT_INDENT_SPACES, "indentSpaces should default if not set");
        });
    }

    test_localization() {
        QUnit.test("localization", (assert) => {
            this.setOriginalLocalizationCode(ModuleBuilder.newUserStore().getLocalizationCode());
            assert.ok(this.originalLocalizationCode, "Original localizationCode should be defined");

            ModuleBuilder.newUserStore().setLocalizationCode("fr");
            const localization = ModuleBuilder.newUserStore().getLocalizationCode();
            assert.equal(localization, "fr", "localization should return the correct localization");

            // Check for default value if no input is provided
            ModuleBuilder.newUserStore().setLocalization(""); // Reset to empty to check default
            const defaultLocalization = ModuleBuilder.newUserStore().getLocalizationCode();
            assert.equal(defaultLocalization, "en", "localization should default to 'en' if not set");
        });
    }

    test_userLicenseCRUD() {
        QUnit.test("User License CRUD Operations", (assert) => {
            this.setOriginalUserLicense(ModuleBuilder.newUserStore().getUserLicense());
            assert.ok(this.originalUserLicense, "Original user license should be defined");

            // Set up unique user license for testing
            // Randomly generated unique IDs for userid and planid
            const randomUserId = () => Math.random().toString(36).substring(2, 15);
            const randomPlanId = () => Math.random().toString(36).substring(2, 15);

            const userId = randomUserId();
            const planId = randomPlanId();
            // Ysterday's date for createdOn
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);


            // Expires in one year
            const expiresInOneYear = new Date();
            expiresInOneYear.setFullYear(expiresInOneYear.getFullYear() + 1);

            const randomAmount = Math.floor(Math.random() * 1000) + 1; // Random amount between 1 and 1000

            const userLicense = UserLicense.newUserLicense()
                .setAmount(randomAmount)
                .setUserId(userId)
                .setPlanId(planId)
                .setCreatedOn(yesterday.toISOString())
                .setExpirationDate(expiresInOneYear.toISOString());

            ModuleBuilder.newUserStore().setUserLicense(userLicense);

            // Retrieve the license
            const retrievedLicense = ModuleBuilder.newUserStore().getUserLicense();
            assert.ok(retrievedLicense, "User license should be retrieved successfully");
            assert.strictEqual(retrievedLicense.userId, userId, "User ID should match");
            assert.strictEqual(retrievedLicense.planId, planId, "Plan ID should match");
            assert.strictEqual(retrievedLicense.createdOn, yesterday.toISOString(), "CreatedOn date should match");
            assert.strictEqual(retrievedLicense.expirationDate, expiresInOneYear.toISOString(), "Expiration date should match");
            assert.strictEqual(retrievedLicense.amount, randomAmount, "Amount should match");

            // Clean up
            ModuleBuilder.newUserStore().clearUserLicense();
            const clearedLicense = ModuleBuilder.newUserStore().getUserLicense();
            assert.strictEqual(clearedLicense, undefined, "User license should be cleared successfully");
        });
    }
}