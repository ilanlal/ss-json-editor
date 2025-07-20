// test_EditorTriggers.gs
class test_EditorTriggers {
    constructor() {
        QUnit.module("Editor Triggers Tests");
        this.runTests();
    }
    runTests() {
        const tests = [
            "test_onIdentSpacesSelectorChange",
            //"test_onValidateJsonSwitchChange",
            // Add more test methods here as needed
        ];
        tests.forEach(test => this[test]());
    }

    test_onIdentSpacesSelectorChange() {
        QUnit.test("onIdentSpacesSelectorChange", function (assert) {
            // Mock event object

            const e = {
                commonEventObject: {
                    formInputs: {
                        "identSpaces": {
                            stringInputs: {
                                value: ["4"]
                            }
                        }
                    }
                }
            };


            onIdentSpacesSelectorChange(e);
            // Assert that the UserStore's identSpaces is set correctly
            const userStore = new UserStore();
            assert.equal(userStore.getIdentSpaces(), "4", "Ident spaces should be set to 4");

            // Check for default value if no input is provided
            const eDefault = {
                commonEventObject: {
                    formInputs: {
                        "identSpaces": {
                            stringInputs: {
                                value: [""]
                            }
                        }
                    }
                }
            };
            onIdentSpacesSelectorChange(eDefault);
            assert.equal(userStore.getIdentSpaces(), "2", "Ident spaces should default to 2");
        });
    }
}