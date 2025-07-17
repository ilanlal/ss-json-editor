function onMinifyRange(e) {
    try {
        minifyRange();
    } catch (error) {
        const localization = getLocalizationResources(e);
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                localization.message.error,
                error.toString(), 16);
    }
}

function onPrettifyRange(e) {
    try {
        prettifyRange(4);
    } catch (error) {
        const localization = getLocalizationResources(e);
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                localization.message.error,
                error.toString(), 16);
    }
}

function onShowAboutInfo(e) {
    // Show an alert with information about the add-on
    const localization = getLocalizationResources(e);
    SpreadsheetApp
        .getActiveSpreadsheet()
        .toast(
            localization.dialogs.about.content,
            localization.dialogs.about.title,
            0);
}

/**
 * Callback for the add-on homepage.
 * This function is called when the user opens the add-on.
 * It returns the home card to be displayed in the sidebar.
 * @see appsscript.json -->homepageTrigger
 */
function onDefaultHomePageOpen(e) {
    // Return the home card
    return createHomeCard(e);
}

function onAddExtensionMenu(e) {
    createAppMenu(e);
    showTipForMenu(e);
}