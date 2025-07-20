// test_Events.gs
class test_Events {
    constructor() {
        QUnit.module("Events Tests");
        this.runTests();
    }
    runTests() {
        const tests = [
            //"test_onIdentSpacesSelectorChange",
            //"test_onValidateJsonSwitchChange",
            // Add more test methods here as needed
        ];
        tests.forEach(test => this[test]());
    }

    test_onValidateJsonSwitchChange() {
        QUnit.test("Validate JSON switch change event", function (assert) {
            const e = {
                commonEventObject: {
                    formInputs: {
                        validate_json_switch: {
                            stringInputs: {
                                value: ["true"]
                            }
                        }
                    }
                }
            };
            const userProperties = PropertiesService.getUserProperties();
            onValidateJsonSwitchChange(e);
            const isChecked = userProperties.getProperty('validateJson');
            assert.strictEqual(isChecked, "true", "Validate JSON switch should be set to true");

            // Change the value to false
            e.commonEventObject.formInputs.validate_json_switch.stringInputs.value[0] = "false";
            onValidateJsonSwitchChange(e);
            const updatedIsChecked = userProperties.getProperty('validateJson');
            assert.strictEqual(updatedIsChecked, "false", "Validate JSON switch should be updated to false");
        });
    }
    
    test_onIdentSpacesSelectorChange() {
        QUnit.test("Ident space selector change event ", function (assert) {
            const e = {
                commonEventObject: {
                    formInputs: {
                        ident_spaces_selector: {
                            stringInputs: {
                                value: ["4"]
                            }
                        }
                    }
                }
            };
            const userProperties = PropertiesService.getUserProperties();
            onIdentSpacesSelectorChange(e);
            const selectedSpaces = userProperties.getProperty('identSpaces');
            assert.strictEqual(selectedSpaces, "4", "Selected spaces should be set to 4");

            // Change the value to 2
            e.commonEventObject.formInputs.ident_spaces_selector.stringInputs.value[0] = "2";
            onIdentSpacesSelectorChange(e);
            const updatedSpaces = userProperties.getProperty('identSpaces');
            assert.strictEqual(updatedSpaces, "2", "Selected spaces should be updated to 2");
        });
    }
}