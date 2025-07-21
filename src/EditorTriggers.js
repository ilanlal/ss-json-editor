/**
 * Callback for the add-on homepage.
 * This function is called when the user opens the add-on.
 * It returns the home card to be displayed in the sidebar.
 * @see appsscript.json -->homepageTrigger
 */
function onDefaultHomePageOpen(e) {
    try {
        // Return the home card
        return createHomeCard();
    } catch (error) {
        const localization = getLocalizationResources();
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.message.error,
                15);
    }
}

function onMinifyRange(e) {
    try {
        const localization = getLocalizationResources();
        const userStore = new UserStore();
        const jsonStudio = new JsonStudio(localization, userStore);
        const range = SpreadsheetApp
            .getActiveSpreadsheet()
            .getActiveRange();

        // Call the minifyRange method of JsonStudio
        if (!jsonStudio.isRangeValid(range)) {
            SpreadsheetApp
                .getActiveSpreadsheet()
                .toast(
                    localization.message.outOfRange,
                    localization.message.error,
                    15);
            return;
        }
        jsonStudio.minifyRange(range);

    } catch (error) {
        const localization = getLocalizationResources();
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.message.error,
                15);
    }
}

function onFormatRange(e) {
    try {
        const localization = getLocalizationResources();
        const userStore = new UserStore();
        const jsonStudio = new JsonStudio(localization, userStore);
        const range = SpreadsheetApp
            .getActiveSpreadsheet()
            .getActiveRange();

        // Validate the range before formatting
        if (!jsonStudio.isRangeValid(range)) {
            SpreadsheetApp
                .getActiveSpreadsheet()
                .toast(
                    localization.message.outOfRange,
                    localization.message.error,
                    15);
            return;
        }
        // Call the formatRange method of JsonStudio
        jsonStudio.formatRange(range, userStore.getIdentSpaces());
    } catch (error) {
        const localization = getLocalizationResources();
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.message.error,
                15);
    }
}

function onShowAboutCard(e) {
    try {
        const card = createAboutCard(e);
        // Return the card to be displayed in the sidebar
        return card;
    } catch (error) {
        const localization = getLocalizationResources();
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
        const selectedSpaces = e?.commonEventObject?.formInputs?.[Static_Resources.keys.identSpaces]?.stringInputs?.value[0] || "2";
        userStore.setIdentSpaces(selectedSpaces); // Store the selected spaces in user properties
    } catch (error) {
        const localization = getLocalizationResources();
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.message.error,
                15);
    }
}

function onFailNoteFlagChange(e) {
    try {
        const userStore = new UserStore();
        const isChecked = e?.commonEventObject?.formInputs?.[Static_Resources.keys.failNoteFlag]?.stringInputs?.value[0] === 'true';
        userStore.setFailNoteFlag(isChecked);
    }
    catch (error) {
        const localization = getLocalizationResources();
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.message.error,
                15);
    }
}

function onShowErrorFlagChange(e) {
    try {
        const userStore = new UserStore();
        const isChecked = e?.commonEventObject?.formInputs?.[Static_Resources.keys.showErrorsFlag]?.stringInputs?.value[0] === 'true';
        userStore.setShowErrorsFlag(isChecked);
    }
    catch (error) {
        const localization = getLocalizationResources();
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.message.error,
                15);
    }
}