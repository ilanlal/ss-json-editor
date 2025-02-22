// This function is called when the user clicks on the "Open Sidebar" button in the add-on menu
function openSidebar(e, file) {
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