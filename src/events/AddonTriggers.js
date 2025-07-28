// Google Apps Script file for handling add-on triggers and events
/**
 * Callback for the add-on homepage.
 * This function is called when the user opens the add-on.
 * It returns the home card to be displayed in the sidebar.
 * @see appsscript.json -->homepageTrigger
 */
function onDefaultHomePageOpen(e) {
    const localization = AppManager.getLocalizationResources();
    try {
        const userStore = new UserStore();

        // Return the home card
        return new HomeController(localization, userStore)
            .home();

    } catch (error) {
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.message || error.toString(),
                localization.messages.error,
                7);
    }
}

function onMinifyRange(e) {
    // This function is called when the user selects "Minify" from the add-on menu    
    const localization = AppManager.getLocalizationResources();
    try {
        const userStore = new UserStore();
        const jsonStudio = new JsonStudio(
            SpreadsheetApp
                .getActiveSpreadsheet(), localization, userStore);

        // minify the range
        const rangeReport = jsonStudio.minifyRange();
        const reportItems = rangeReport.getItems();
        // If there are results, create and return the report card
        if (reportItems?.length > 0) {
            // and create the report card

            const reportCard = new ReportCard(rangeReport, localization);
            return reportCard
                .createReportCard()
                .build();
        }
    } catch (error) {
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.messages.error,
                7);
    }
    // Return nothing if no results
    return;
}

function onFormatRange(e) {
    const localization = AppManager.getLocalizationResources();

    try {
        const userStore = new UserStore();
        const jsonStudio = new JsonStudio(
            SpreadsheetApp
                .getActiveSpreadsheet(),
            localization,
            userStore);

        // Call the formatRange method of JsonStudio
        const rangeReport = jsonStudio.formatRange();
        const reportItems = rangeReport.getItems();
        // If there are results, create and return the report card
        if (reportItems?.length > 0) {
            const reportCard = new ReportCard(rangeReport, localization);
            return reportCard.createReportCard().build();
        }
    } catch (error) {
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.messages.error,
                7);
    }
    // Return nothing if no results
    return;
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
                7);
    }
    // Return nothing as this is just a change event
    return;
}

function onReportItemClick(e) {
    try {
        const a1Notation = e?.parameters?.a1Notation;
        if (!a1Notation) {
            throw new Error("Invalid A1 notation provided");
        }
        // Create a new JsonEditorController with the provided A1 notation
        const jsonEditorController = new JsonEditorController(
            SpreadsheetApp.getActiveSpreadsheet());

        return jsonEditorController.createCard(a1Notation);
    } catch (error) {
        const localization = AppManager.getLocalizationResources();
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.messages.error,
                7);
    }

    return;
}

function onReportClose(e) {

    try {
        // Close the report card
        const card = CardService.newActionResponseBuilder()
            .setNavigation(
                CardService.newNavigation()
                    .popToRoot())
            .build();
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

    return;
}

function onSaveEditor(e) {
    try {
        const a1Notation = e?.parameters?.a1Notation;

        if (!a1Notation) {
            throw new Error("Invalid A1 notation or data provided");
        }

        const jsonEditorController = new JsonEditorController(
            SpreadsheetApp.getActiveSpreadsheet());

        // Get the data input from the event object
        const dataInput = e?.commonEventObject?.formInputs?.dataInput?.stringInputs?.value[0] || '';

        return jsonEditorController.onSaveEditor(
            a1Notation, dataInput);
    } catch (error) {
        const localization = AppManager.getLocalizationResources();
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.messages.error,
                7);
    }

    // Return nothing as this is just a save event
    return;
}

function onCancelEditor(e) {
    try {
        const jsonEditorController = new JsonEditorController();
        return jsonEditorController.onCancelEditor();
    } catch (error) {
        const localization = AppManager.getLocalizationResources();
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.messages.error,
                7);
    }

    // Return nothing as this is just a cancel event
    return;
}

function onEditCell(e) {
    try {
        const range = SpreadsheetApp
            .getActiveSpreadsheet()
            .getActiveRange();
        // Only 1 cell range is expected
        if (range?.getNumRows() !== 1 || range?.getNumColumns() !== 1) {
            throw new Error("Please select a single cell to edit.");
        }

        const a1Notation = range.getA1Notation();
        // Create a new JsonEditorController with the provided A1 notation
        const jsonEditorController = new JsonEditorController(
            SpreadsheetApp.getActiveSpreadsheet());

        return jsonEditorController.createCard(a1Notation);
    } catch (error) {
        const localization = AppManager.getLocalizationResources();
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.messages.error,
                7);
    }

    return;
}

function onOpenAccountCard(e) {
    try {
        const controller = new AccountController();
        return controller.home();
    } catch (error) {
        const localization = AppManager.getLocalizationResources();
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.messages.error,
                7);
    }

    return;
}

function onActivatePremium(e) {
    try {
        const controller = new AccountController();

        return controller.activatePremium();
    } catch (error) {
        const localization = AppManager.getLocalizationResources();
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.toString(),
                localization.messages.error,
                7);
    }

    // Return nothing as this is just an activation event
    return;
}