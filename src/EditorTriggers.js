// Apps Script code for Google Workspace Add-ons
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
        const localization = AppManager.getLocalizationResources();
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.messages.error,
                15);
    }
}

function onMinifyRange(e) {
    const localization = AppManager.getLocalizationResources();
    try {
        const userStore = new UserStore();
        const jsonStudio = new JsonStudio(
            SpreadsheetApp
                .getActiveSpreadsheet(), localization, userStore);

        // minify the range
        const report = jsonStudio.minifyRange();

        // Extract the results from the range report
        const results = report.getResults();
        // If there are results, create and return the report card
        if (results?.items?.length > 0) {
            const reportCard = new ReportCard(results.items, localization);
            return reportCard.createReportCard().build();
        }
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
    const localization = AppManager.getLocalizationResources();

    try {
        const userStore = new UserStore();
        const jsonStudio = new JsonStudio(
            SpreadsheetApp.getActiveSpreadsheet(), localization, userStore);

        // Call the formatRange method of JsonStudio
        const report = jsonStudio.formatRange();
        // Extract the results from the range report
        const results = report.getResults();
        // If there are results, create and return the report card
        if (results?.items?.length > 0) {
            const reportCard = new ReportCard(results.items, localization);
            return reportCard.createReportCard().build();
        }
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
        const localization = AppManager.getLocalizationResources();
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
        const localization = AppManager.getLocalizationResources();
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
        const localization = AppManager.getLocalizationResources();
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
        const localization = AppManager.getLocalizationResources();
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.messages.error,
                15);
    }
}

function onReportItemClick(e) {
    try {
        const a1Notation = e?.parameters?.a1Notation;
        if (a1Notation) {
            const range = SpreadsheetApp.getActiveSpreadsheet().getRange(a1Notation);
            // Show the cell value in a toast
            const cellValue = range.getValue();
            SpreadsheetApp.getActiveSpreadsheet().toast(
                `Cell ${a1Notation} value: ${cellValue}`,
                'Cell Value',
                10);
        }
    } catch (error) {
        const localization = AppManager.getLocalizationResources();
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.messages.error,
                15);
    }
}