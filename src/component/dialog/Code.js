function openDialog(e, file) {
    // Only show the sidebar if the user is an add-on
    if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
        SpreadsheetApp.getUi().alert('Opening the dialog (add-on)');
    }

    const htmlOutput = HtmlService
        .createTemplateFromFile(file)
        .evaluate()
        .setHeight(600)
        .setWidth(480);

    SpreadsheetApp.getUi()
        .showModalDialog(htmlOutput, 'JSON Studio');
}