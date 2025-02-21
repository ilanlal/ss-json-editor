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

    const lastRow = sheet.getLastRow();
    // get the last column of the sheet
    const lastColumn = sheet.getLastColumn();
    if (lastColumn > 26) {
        SpreadsheetApp.getActiveSpreadsheet().toast('The sheet has more than 26 columns', 'JSON Editor ‼️', 3);
        return;
    }

    const range = sheet.getActiveRange();
    const values = range.getValues();
    const newValues = values.map((row, i) => row.map((cell, j) => {
        // if range is out of last row, remove the cell from newValus 
        if (i > lastRow) {
            return;
        }
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
    const lastRow = sheet.getLastRow();
    // get the last column of the sheet
    const lastColumn = sheet.getLastColumn();
    if (lastColumn > 26) {
        SpreadsheetApp.getActiveSpreadsheet().toast('The sheet has more than 26 columns', 'JSON Editor ‼️', 3);
        return;
    }
    const range = sheet.getActiveRange();
    const values = range.getValues();
    const newValues = values.map((row, i) => row.map((cell, j) => {
        // if range is out of last row, remove the cell from newValus 
        if (i > lastRow) {
            return;
        }
        try {
            return JSON.stringify(JSON.parse(cell), null, 2);
        } catch (error) {
            return cell;
        }
    }));

    range.setValues(newValues);
}

function highlightActiveRange(e) {
    // Only show the sidebar if the user is an add-on
    if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
        SpreadsheetApp.getUi().alert('Prettifying the range (add-on)');
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const range = sheet.getDataRange();
    
    const orgColor = range.getBackgrounds();
    const newColor = orgColor.map(row => row.map(cell => cell === '#ffff00' ? '#ffffff' : '#ffff00'));
    range.setBackgrounds(newColor);
    
    // Sleep for 2 second
    Utilities.sleep(2000);

    // Reset the background color
    range.setBackgrounds(orgColor);
}

