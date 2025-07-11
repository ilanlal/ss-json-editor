// This function is called when the user clicks on the "Open Sidebar" button in the add-on menu
function openSidebar(e, file) {
  // Only show the sidebar if the user is authorized to use the add-on
  if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
    const htmlOutput = HtmlService
      .createTemplateFromFile(file)
      .evaluate()
      .setTitle('JSON Studio');
    SpreadsheetApp.getUi().showSidebar(htmlOutput);
  } else {
    SpreadsheetApp.getUi().alert('This add-on can only be used in Google Sheets™️.');
  }
}