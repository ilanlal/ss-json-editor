// Google Apps Script code for Google Workspace Add-ons
class JsonEditorController {
    /**
     * Initializes the JsonEditorController with the provided context.
     */
    constructor(sheet = SpreadsheetApp.getActiveSpreadsheet()) {
        this.sheet = sheet;
        this.localization = AppManager.getLocalizationResources(sheet);
    }

    /**
     * Creates a card for the JSON editor.
     * @returns {CardService.Card} - The card for the JSON editor.
     */
    createCard(a1Notation) {
        if (!a1Notation) {
            throw new Error("A1 notation is required to create the JSON editor card.");
        }
        const data = this.sheet
            .getRange(a1Notation)
            .getValue();

        const card = new JsonEditorCard(a1Notation, this.localization);
        return card.createCard(data)
            .build();
    }

    onSaveEditor(a1Notation, data = '') {
        if (!a1Notation) {
            throw new Error("A1 notation is required to save the editor data.");
        }
        this.sheet
            .getRange(a1Notation)
            .setValue(data);

        // Close the editor card after saving
        return CardService.newActionResponseBuilder()
            .setNavigation(
                CardService.newNavigation()
                    .popCard()
            )
            .build();
    }

    onCancelEditor() {
        // Todo: navigate to previous card
        return CardService.newActionResponseBuilder()
            .setNavigation(
                CardService.newNavigation()
                    .popCard()
            )
            .build();
    }
}