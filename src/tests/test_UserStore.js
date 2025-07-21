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
            "test_identSpaces",
            "test_failNoteFlag",
            "test_showErrorsFlag"
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

    test_failNoteFlag() {
        QUnit.test("failNoteFlag", (assert) => {
            const userStore = new UserStore();
            userStore.setFailNoteFlag(true);
            const failNoteFlag = userStore.getFailNoteFlag();
            assert.equal(failNoteFlag, true, "failNoteFlag should return the correct failNoteFlag");

            // false case
            userStore.setFailNoteFlag(false);
            const newFailNoteFlag = userStore.getFailNoteFlag();
            assert.equal(newFailNoteFlag, false, "failNoteFlag should return false for failNoteFlag");

            // Check for default value if no input is provided
            userStore.setFailNoteFlag(""); // Reset to empty to check default
            const defaultFailNoteFlag = userStore.getFailNoteFlag();
            assert.equal(defaultFailNoteFlag, false, "failNoteFlag should default to false if not set");
        });
    }

    test_showErrorsFlag() {
        QUnit.test("showErrorsFlag", (assert) => {
            const userStore = new UserStore();
            userStore.setShowErrorsFlag(true);
            const showErrorsFlag = userStore.getShowErrorsFlag();
            assert.equal(showErrorsFlag, true, "showErrorsFlag should return true for showErrorsFlag");

            // false case
            userStore.setShowErrorsFlag(false);
            const newShowErrorsFlag = userStore.getShowErrorsFlag();
            assert.equal(newShowErrorsFlag, false, "showErrorsFlag should return false for showErrorsFlag");

            // Check for default value if no input is provided
            userStore.setShowErrorsFlag(""); // Reset to empty to check default
            const defaultShowErrorsFlag = userStore.getShowErrorsFlag();
            assert.equal(defaultShowErrorsFlag, false, "showErrorsFlag should default to false if not set");
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