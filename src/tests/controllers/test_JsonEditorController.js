// Google Apps Script code for Google Workspace Add-ons
class test_JsonEditorController {
    constructor() {
        QUnit.module("JsonEditor Controller Tests");
        this.runTests();
        QUnit.done(() => {
            // Cleanup or finalization if needed
        });
    }

    runTests() {
        const tests = [
            "test_createEditorCard",
            // Add more test methods here as needed
        ];
        tests.forEach(test => this[test]());
    }

    test_createEditorCard() {
        QUnit.test("Test createEditorCard", (assert) => {
            const localization = AppManager.getLocalizationResources();
            const userStore = new UserStore();
            const jsonEditorController = new JsonEditorController(
                SpreadsheetApp.getActiveSpreadsheet());

            const editorCard = JSON.parse(
                jsonEditorController
                    .createCard('A1')
                    .printJson());

            assert.ok(editorCard, "Editor card should be created successfully");
            assert.strictEqual(
                editorCard.header.title,
                localization.cards.editor.title,
                "Editor card title should match localization"
            );
        });
    }
}
