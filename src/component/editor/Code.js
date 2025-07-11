function openDialog(e, file) {
    // Only show the sidebar if the user is an add-on
    if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
        const htmlOutput = HtmlService
            .createTemplateFromFile(file)
            .evaluate()
            .setHeight(600)
            .setWidth(640);

        SpreadsheetApp.getUi()
            .showModalDialog(htmlOutput, 'JSON Studio');
    }
    else {
        SpreadsheetApp.getUi().alert('This add-on can only be used in Google Sheets™️.');
    }
}