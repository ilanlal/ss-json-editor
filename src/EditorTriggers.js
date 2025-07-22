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
                localization.messages.error,
                15);
    }
}

function onMinifyRange(e) {
    const localization = getLocalizationResources();
    try {
        const userStore = new UserStore();
        const jsonStudio = new JsonStudio(SpreadsheetApp
            .getActiveSpreadsheet(), localization, userStore);

        // minify the range
        jsonStudio.minifyRange();

    } catch (error) {
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.messages.error,
                15);
    }
}

function onFormatRange(e) {
    const localization = getLocalizationResources();

    try {
        const userStore = new UserStore();
        const jsonStudio = new JsonStudio(SpreadsheetApp
            .getActiveSpreadsheet(), localization, userStore);

        // Call the formatRange method of JsonStudio
        jsonStudio.formatRange();
    } catch (error) {
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.messages.error,
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
                localization.messages.error,
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
                localization.messages.error,
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
                localization.messages.error,
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
                localization.messages.error,
                15);
    }
}