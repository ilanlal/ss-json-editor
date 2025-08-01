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
            .home()
            .build();

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
    console.log("onMinifyRange called with event:", e);
    try {
        const localization = AppManager.getLocalizationResources();
        const userStore = new UserStore();
        return new HomeController(localization, userStore)
            .minifyJsonFormat()
            .build();
    } catch (error) {
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
                .setText(error.toString()))
            .build();
    }
}

function onFormatRange(e) {
    console.log("onFormatRange called with event:", e);
    
    try {
        const localization = AppManager.getLocalizationResources();
        const userStore = new UserStore();
        return new HomeController(localization, userStore)
            .prettyJsonFormat()
            .build();
    } catch (error) {
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
                .setText(error.toString()))
            .build();
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

function onIndentSpacesSelectorChange(e) {
    try {
        const userStore = new UserStore();
        const selectedSpaces = e?.commonEventObject?.formInputs?.[Static_Resources.resources.indentSpaces]?.stringInputs?.value[0] || "2";
        userStore.setIndentSpaces(selectedSpaces); // Store the selected spaces in user properties
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

function onEditRange(e) {
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
        return new AccountController()
            .home()
            .build();

    } catch (error) {
        return CardService.newActionResponseBuilder()
            .setNotification(
                CardService.newNotification()
                    .setText(
                        error.toString()))
            .build();
    }
}

function onActivatePremium(e) {
    try {
        return new AccountController()
            .activatePremium()
            .build();
    } catch (error) {
        return CardService.newActionResponseBuilder()
            .setNotification(
                CardService.newNotification()
                    .setText(
                        error.toString()))
            .build();
    }
}

function onRevokeLicense(e) {
    try {
        return new AccountController()
            .revokePremium()
            .build();
    } catch (error) {
        return CardService.newActionResponseBuilder()
            .setNotification(
                CardService.newNotification()
                    .setText(
                        error.toString()))
            .build();
    }
}