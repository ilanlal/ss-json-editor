// Apps Script code for Google Workspace Add-ons
// src/Code.js

function minifyRange() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getActiveSheet();
  const lastRow = sheet.getLastRow();
  const range = sheet.getActiveRange();
  const values = range.getValues();
  const newValues = values
    .map((row, i) => row
      .map((cell, j) => {
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

function prettifyRange(nofIndentationSpaces) {
  let nofSpaces = nofIndentationSpaces; // Use the provided number of spaces for indentation
  if (typeof nofSpaces !== 'number' || nofSpaces <= 0) {
    nofSpaces = 2; // Default to 2 spaces if the input is invalid
  }
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getActiveSheet();
  const lastRow = sheet.getLastRow();
  const range = sheet.getActiveRange();
  const values = range.getValues();
  const newValues = values
    .map((row, i) => row
      .map((cell, j) => {
        // if range is out of last row, remove the cell from newValus 
        if (i > lastRow) {
          return;
        }
        try {
          return JSON.stringify(JSON.parse(cell), null, nofSpaces);
        } catch (error) {
          return cell;
        }
      }));
  range.setValues(newValues);
}

function showTipForMenu(e) {
  const localization = getLocalizationResources(e);
  SpreadsheetApp
    .getActiveSpreadsheet()
    .toast(
      localization.message.tipForMenu,
      localization.message.tip, 20);
}
/**
 * Gets the localization resources based on the user's locale.
 * This function retrieves the localization resources from the Global_Resources object.
 * 
 * @param {Event} e The event object containing the user's locale.
 */
function getLocalizationResources(e) {
  return Global_Resources.en;
}

/**
 * Sets up the custom menu in Google Sheets.
 */
function createAppMenu(e) {
  const localization = getLocalizationResources(e);
  const ui = SpreadsheetApp.getUi();

  // The label for a menu item should be in sentence case (only the first word capitalized).
  // see https://developers.google.com/apps-script/reference/base/menu#detailed-documentation
  ui.createMenu(localization.menu.top)
    .addItem(localization.menu.prettify, 'onPrettifyRange')
    .addItem(localization.menu.minify, 'onMinifyRange')
    .addSeparator()
    .addItem(localization.menu.about, 'onShowAboutInfo')
    .addToUi();
}

function onIdentSpacesSelectorChange(e) {
  const userProperties = PropertiesService.getUserProperties();
  //Operation completed successfully.
  const t = {
    "ident_spaces_selector":
    {
      "stringInputs":
      {
        "value": ["2"]
      }
    }, "validate_json_switch": {
      "stringInputs": {
        "value": ["true"]
      }
    }
  }

  // field name: ident_spaces_selector
  const selectedSpaces = e.commonEventObject?.formInputs?.ident_spaces_selector?.stringInputs?.value[0] || "2";
  // Set the user property to the selected number of spaces
  userProperties.setProperty('identSpaces', selectedSpaces);
}

function onValidateJsonSwitchChange(e) {
  const userProperties = PropertiesService.getUserProperties();
  // field name: validate_json_switch
  const isChecked = e.commonEventObject?.formInputs?.validate_json_switch?.stringInputs?.value[0] === 'true';
  // Set the user property to the value of the switch
  userProperties.setProperty('validateJson', isChecked);
}