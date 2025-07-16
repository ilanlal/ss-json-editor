// Apps Script code for Google Workspace Add-ons
// src/component/Code.js
// src/component/Code.gs

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .getContent();
}

function openDialog(file, title) {
    const htmlOutput = HtmlService
        .createTemplateFromFile(file)
        .evaluate()
        .setHeight(600)
        .setWidth(640);

    SpreadsheetApp.getUi()
        .showModalDialog(htmlOutput, title || 'Dialog');
}

/**
 * Opens the JSON editor dialog for the specified cell.
 * This function is called when the user clicks on the "Open Editor" button in the sidebar (Report).
 * @param {string} a1n The A1 notation of the cell to edit.
 * @return {CardService.ActionResponse} The action response to open the editor dialog.
 */
function openEditor(a1n) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    // set the active cell to the value of the a1n parameter
    //sheet.getRange(a1n).activate();
    const range = sheet.getRange(a1n);
    range.activateAsCurrentCell();
    return openDialogEditor();
}

function getCurrentCell(e) {
    // get the current cell
    const range = SpreadsheetApp
        .getActiveSpreadsheet()
        .getActiveSheet()
        .getCurrentCell();

    return {
        cell: {
            a1n: range.getA1Notation(),
            input: range.getValue()
        }
    };
}