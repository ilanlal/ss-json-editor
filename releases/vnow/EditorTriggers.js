/**
 * Callback for the add-on homepage.
 * This function is called when the user opens the add-on.
 * It returns the home card to be displayed in the sidebar.
 * @see appsscript.json -->homepageTrigger
 */
function onDefaultHomePageOpen(e) {
    try {
        // Return the home card
        return createHomeCard(e);
    } catch (error) {
        const localization = getLocalizationResources(e);
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.message.error,
                10);
    }
}

function onMinifyRange(e) {
    try {
        minifyRange();
    } catch (error) {
        const localization = getLocalizationResources(e);
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.message.error,
                10);
    }
}

function onPrettifyRange(e) {
    try {
        prettifyRange();
    } catch (error) {
        const localization = getLocalizationResources(e);
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.message.error,
                10);
    }
}

function onShowAboutInfo(e) {
    try {
        // Show an alert with information about the add-on
        const localization = getLocalizationResources(e);
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                localization.dialogs.about.content,
                localization.dialogs.about.title,
                0);
    }
    catch (error) {
        const localization = getLocalizationResources(e);
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.message.error,
                10);
    }
}
function onShowAboutCard(e) {
    try {
        // Return the about card
        return createAboutCard(e);
    } catch (error) {
        const localization = getLocalizationResources(e);
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.message.error,
                10);
    }
}

function onIdentSpacesSelectorChange(e) {
    try {
        const userStore = new UserStore();
        const selectedSpaces = e.commonEventObject?.formInputs?.[Static_Resources.keys.identSpaces]?.stringInputs?.value[0] || "2";
        userStore.setIdentSpaces(selectedSpaces); // Store the selected spaces in user properties
    }
    catch (error) {
        const localization = getLocalizationResources(e);
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.message.error,
                10);
    }
}

function onFailNoteFlagChange(e) {
    try {
        const userStore = new UserStore();
        const isChecked = e.commonEventObject?.formInputs?.[Static_Resources.keys.failNoteFlag]?.stringInputs?.value[0] === 'true';
        userStore.setFailNoteFlag(isChecked);
    }
    catch (error) {
        const localization = getLocalizationResources(e);
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.message.error,
                10);
    }
}

function onShowErrorFlagChange(e) {
    try {
        const userStore = new UserStore();
        const isChecked = e.commonEventObject?.formInputs?.[Static_Resources.keys.showErrorsFlag]?.stringInputs?.value[0] === 'true';
        userStore.setShowErrorsFlag(isChecked);
    }
    catch (error) {
        const localization = getLocalizationResources(e);
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.message.error,
                10);
    }
}