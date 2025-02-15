// [File: AddonsTrigers.gs]
// https://developers.google.com/apps-script/guides/triggers
function onOpen(e) {
    const ui = SpreadsheetApp.getUi();

    // The label for a menu item should be in sentence case (only the first word capitalized).
    // see https://developers.google.com/apps-script/reference/base/menu#detailed-documentation
    ui.createMenu('JSON Studio')
        .addItem('Vallidate selected range', 'openSidebarIndex_')
        .addSubMenu(SpreadsheetApp.getUi().createMenu('Format selected range')
            .addItem('Minify selected range', 'openSidebarIndex_')
            .addItem('Pretty print selected range', 'openSidebarIndex_'))
        .addItem('Open dialog', 'openDialogHelp_')
        .addSeparator()
        .addItem('Setting', 'openSidebarSetting_')
        .addSeparator()
        .addItem('Help', 'openSidebarHelp_')
        .addItem('About', 'openSidebarAbout_')
        .addToUi();
}


function getRecords(a1n) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const range = a1n ? sheet.getRange(a1n) : sheet.getDataRange();

    // first column letter of the selected range
    const firstCol = customeRange.getA1Notation().split(':')[0].replace(/\d/g, '');
    // array of columns, input range as "C8:E12" will return ["C", "D", "E"]
    const columns = [];
    for (let i = 0; i < customeRange.getNumColumns(); i++) {
        columns.push(String.fromCharCode(firstCol.charCodeAt(0) + i));
    }

    const startRow = range.getRow();
    // array of rows, input range as "C8:E12" will return [8, 9, 10, 11, 12]
    const rows = [];
    for (let i = 0; i < range.getNumRows(); i++) {
        rows.push(startRow + i);
    }

    // get the values ([[]]) of the selected range
    const rangeValues = range.getValues();
    var records = [];
    // for each record in the selected range create a record object
    for (let i = 0; i < rangeValues.length; i++) {
        const rowValues = rangeValues[i];
        // create a new record object
        var record = {
            // line number of the record
            line: startRow + i,

        };

        // for each column in the record
        for (let j = 0; j < values[i].length; j++) {
            // a1 notation of the cell
            const currentRange = columns[j] + rows[i];
            // add a new property to the record object
            record[columns[j]] = values[i][j];
        }
        records.push(record);
    }
}

function onSelectionChange(e) {

}

function onInstall(e) {
    // Set a value in the property store.   
    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('sidebarOpen', 'false');
    onOpen(e);
}
function openSidebarIndex_(e) {
    openSidebar_(e, 'component/sidebar/Index');
}
function openSidebarSetting_(e) {
    openSidebar_(e, 'component/pages/setting/Index');
}

function openSidebarHelp_(e) {
    openSidebar_(e, 'component/pages/Help');
}

function openSidebarAbout_(e) {
    openSidebar_(e, 'component/pages/About');
}
// This function is called when the user clicks on the "Open Sidebar" button in the add-on menu
function openSidebar_(e, file) {
    // Only show the sidebar if the user is an add-on
    if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
        SpreadsheetApp.getUi().alert('Opening the sidebar (add-on)');
    }

    const htmlOutput = HtmlService
        .createTemplateFromFile(file)
        .evaluate()
        .setTitle('JSON Studio');
    SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

function openDialogHelp_(e) {
    openDialog_(e, 'component/pages/Help');
}
function openDialog_(e, file) {
    // Only show the sidebar if the user is an add-on
    if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
        SpreadsheetApp.getUi().alert('Opening the dialog (add-on)');
    }

    const htmlOutput = HtmlService
        .createTemplateFromFile(file)
        .evaluate();
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'JSON Studio');
}

