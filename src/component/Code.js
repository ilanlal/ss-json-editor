// [File: AddonsTrigers.gs]
// https://developers.google.com/apps-script/guides/triggers
function onOpen(e) {
    const ui = SpreadsheetApp.getUi();

    // The label for a menu item should be in sentence case (only the first word capitalized).
    // see https://developers.google.com/apps-script/reference/base/menu#detailed-documentation
    ui.createMenu('JSON Studio')
        .addItem("⇱ Edit", 'openEditorDialog')
        .addItem('▦ Range', 'openSidebarView')
        .addSubMenu(SpreadsheetApp.getUi().createMenu('↹ Format')
            .addItem('Minify', 'minifyRange')
            .addItem('Prettify', 'prettifyRange'))
        .addSeparator()
        .addItem('⨏ Setting', 'openSettingDialog')
        .addSeparator()
        .addItem('⁈ Help', 'openHelpDialog')
        .addToUi();
}

function onInstall(e) {
    // Set a value in the property store.   
    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('sidebarOpen', 'false');
    onOpen(e);
}

function minifyRange(e) {
    // Only show the sidebar if the user is an add-on
    if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
        SpreadsheetApp.getUi().alert('Minifying the range (add-on)');
    }
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const range = sheet.getActiveRange();
    const values = range.getValues();
    const newValues = values.map(row => row.map(cell => {
        try {
            return JSON.stringify(JSON.parse(cell));
        } catch (error) {
            return cell;
        }
    }));

    range.setValues(newValues);
}

function prettifyRange(e) {
    // Only show the sidebar if the user is an add-on
    if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
        SpreadsheetApp.getUi().alert('Prettifying the range (add-on)');
    }
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const range = sheet.getActiveRange();
    const values = range.getValues();
    const newValues = values.map(row => row.map(cell => {
        try {
            return JSON.stringify(JSON.parse(cell), null, 2);
        } catch (error) {
            return cell;
        }
    }));

    range.setValues(newValues);
}


