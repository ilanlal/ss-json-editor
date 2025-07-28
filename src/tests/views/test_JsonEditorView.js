// Google Apps Script code for Google Workspace Add-ons
class test_JsonEditorView {
    constructor() {
        QUnit.module("JsonEditor View Tests");
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
            const a1Notation = 'A1'; // Example cell notation
            const data = "{}"; // Example data, replace with actual data as needed
            const view = new JsonEditorCard(
                a1Notation, localization);


            const editorCard = JSON.parse(
                view.createCard(data)
                .build()
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
