// src/component/SideAddonCode.gs



function getSheetsSelection() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const range = sheet.getActiveRange();
    const values = range.getValues();
    const inputText = values.map(row => row.join(' ')).join('\n');

    // Update the card with the selected text
    const card = createSelectionCard(null, '', '', inputText, '');
    return card;
}

