// [File: AddonsTrigers.gs]
// https://developers.google.com/apps-script/guides/triggers
function onOpen(e) {
    const ui = SpreadsheetApp.getUi();
    
    ui.createMenu('JSON Editor')
        .addItem('Open Sidebar', 'openSidebar')
        .addToUi();
}

function onEdit(e) {

}

function onInstall(e) {
    // Set a value in the property store.   
    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('sidebarOpen', 'false');
    onOpen(e);
}