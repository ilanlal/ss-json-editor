// Google Apps Script file for handling add-on triggers and events
/**
 * Callback for the add-on homepage.
 * This function is called when the user opens the add-on.
 * It returns the home card to be displayed in the sidebar.
 * @see appsscript.json -->homepageTrigger
 */
function onDefaultHomePageOpen(e) {
    console.log("onDefaultHomePageOpen called with event:", e);
    try {
        // Return the home card
        return ControllerBuilder.newHomeController()
            .home()
            .build();

    } catch (error) {
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.message || error.toString(),
                "Error",
                7);
    }
}

function onMinifyRange(e) {
    // This function is called when the user selects "Minify" from the add-on menu    
    console.log("onMinifyRange called with event:", e);
    try {
        const range = SpreadsheetApp.getActiveSpreadsheet().getActiveRange();
        return ControllerBuilder.newJsonStudioController()
            .validateRange(range)
            .minifyRange(range)
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
        const range = SpreadsheetApp.getActiveSpreadsheet().getActiveRange();
        const userStore = new UserStore();
        const indentSpaces = e?.commonEventObject?.formInputs?.[Static_Resources.resources.indentSpaces]?.stringInputs?.value[0] || userStore.getIndentSpaces() || "2";
        return ControllerBuilder.newJsonStudioController()
            .validateRange(range)
            .prettifyRange(range, indentSpaces * 1)
            .build();
    } catch (error) {
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
                .setText(error.toString()))
            .build();
    }
}

function onShowAboutCard(e) {
    console.log("onShowAboutCard called with event:", e);
    try {
        const localization = AppManager.getLocalizationResources();
        return new AboutController(localization)
            .home()
            .build();
    } catch (error) {
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
                .setText(error.toString()))
            .build();
    }
}

function onIndentSpacesSelectorChange(e) {
    console.log("onIndentSpacesSelectorChange called with event:", e);
    try {
        return ControllerBuilder.newAccountController()
            .indentSpacesChange(e)
            .build();
    } catch (error) {
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
                .setText(error.toString()))
            .build();
    }
}

function onReportItemClick(e) {
    console.log("onReportItemClick called with event:", e);
    try {
        const localization = AppManager.getLocalizationResources();
        const userStore = new UserStore();
        return new ReportController(userStore, localization)
            .reportItemClick(e)
            .build();
    } catch (error) {
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
                .setText(error.toString()))
            .build();
    }
}

function onReportClose(e) {
    console.log("onReportClose called with event:", e);
    try {
        return new ReportController()
            .close(e)
            .build();
    } catch (error) {
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
                .setText(error.toString()))
            .build();
    }
}

function onSaveEditor(e) {
    console.log("onSaveEditor called with event:", e);
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
    console.log("onEditRange called with event:", e);
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
    console.log("onOpenAccountCard called with event:", e);
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
    console.log("onActivatePremium called with event:", e);
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
    console.log("onRevokeLicense called with event:", e);
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