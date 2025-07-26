// src/tests/test_UserStore.js
// test_UserStore.gs
class test_UserStore {
    constructor() {
        QUnit.module("UserStore Tests");
        this.runTests();
    }

    runTests() {
        const tests = [
            "test_localization",
            "test_identSpaces"
        ];
        tests.forEach(test => this[test]());
    }

    test_identSpaces() {
        QUnit.test("identSpaces", (assert) => {
            const userStore = new UserStore();
            userStore.setIdentSpaces(4);
            const identSpaces = userStore.getIdentSpaces();
            assert.equal(identSpaces, 4, "identSpaces should return the correct identSpaces");

            // check if identSpaces is set to a different value
            userStore.setIdentSpaces("6");
            const newIdentSpaces = userStore.getIdentSpaces();
            assert.equal(newIdentSpaces, "6", "identSpaces should return the correct identSpaces");

            // Check for default value if no input is provided
            userStore.setIdentSpaces(""); // Reset to empty to check default
            const defaultIdentSpaces = userStore.getIdentSpaces();
            assert.equal(defaultIdentSpaces, "2", "identSpaces should default to 2 if not set");
        });
    }
    
    test_localization() {
        QUnit.test("localization", (assert) => {
            const userStore = new UserStore();
            userStore.setLocalization("fr");
            const localization = userStore.getLocalization();
            assert.equal(localization, "fr", "localization should return the correct localization");

            // Check for default value if no input is provided
            userStore.setLocalization(""); // Reset to empty to check default
            const defaultLocalization = userStore.getLocalization();
            assert.equal(defaultLocalization, "en", "localization should default to 'en' if not set");
        });
    }
}