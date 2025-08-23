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
        return ControllerBuilder.newHomeController()
            .setLocalization(AppManager.getLocalizationResources())
            .setUserInfo(ModelBuilder.newUserInfo()
                .setUserId('_user')
                .setUserLocaleCode(e?.userLocale || UserStore.Constants.DEFAULT_USER_LOCALE_CODE)
                .setUserCountry(e?.userCountry || 'US')
                .setUserTimezone(e?.userTimezone || Session.getScriptTimeZone())
                .setUserLicense(
                    ServiceBuilder.newUserStore().getUserLicense()))
            .home()
            .build();
    } catch (error) {
        console.error("Error in onDefaultHomePageOpen:", error);
        SpreadsheetApp
            .getActiveSpreadsheet()
            .toast(
                error.message || error.toString(),
                "Error",
                7);
    }

}
function onOpenAccountCard(e) {
    console.log("onOpenAccountCard called with event:", e);
    try {
        return ControllerBuilder.newAccountController()
            .setUserInfo(ModelBuilder.newUserInfo()
                .setUserId('_user')
                .setUserLocaleCode(e?.commonEventObject?.userLocale || UserStore.Constants.DEFAULT_USER_LOCALE_CODE)
                .setUserCountry(e?.commonEventObject?.userCountry || 'US')
                .setUserTimezone(e?.commonEventObject?.userTimezone || Session.getScriptTimeZone())
                .setUserLicense(
                    ServiceBuilder.newUserStore().getUserLicense()))
            .home()
            .build();

    } catch (error) {
        console.error("Error in onOpenAccountCard:", error);
        return CardService.newActionResponseBuilder()
            .setNotification(
                CardService.newNotification()
                    .setText(
                        error.toString()))
            .build();
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
        console.error("Error in onMinifyRange:", error);
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
        const indentSpaces = ServiceBuilder.newUserStore().getIndentSpaces();

        return ControllerBuilder.newJsonStudioController()
            .validateRange(range)
            .prettifyRange(range, indentSpaces * 1)
            .build();
    } catch (error) {
        console.error("Error in onFormatRange:", error);
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
                .setText(error.toString()))
            .build();
    }
}

function onShowAboutCard(e) {
    console.log("onShowAboutCard called with event:", e);
    try {
        return ControllerBuilder.newAboutController()
            .home()
            .build();
    } catch (error) {
        console.error("Error in onShowAboutCard:", error);
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
        console.error("Error in onIndentSpacesSelectorChange:", error);
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
                .setText(error.toString()))
            .build();
    }
}

function onReportItemClick(e) {
    console.log("onReportItemClick called with event:", e);
    try {
        return ControllerBuilder.newReportController()
            .reportItemClick(e)
            .build();
    } catch (error) {
        console.error("Error in onReportItemClick:", error);
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
                .setText(error.toString()))
            .build();
    }
}

function onReportClose(e) {
    console.log("onReportClose called with event:", e);
    try {
        return ControllerBuilder.newReportController()
            .close(e)
            .build();
    } catch (error) {
        console.error("Error in onReportClose:", error);
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification()
                .setText(error.toString()))
            .build();
    }
}

function onActivatePremium(e) {
    console.log("onActivatePremium called with event:", e);
    try {
        return ControllerBuilder.newAccountController()
            .activatePremium(e)
            .build();
    } catch (error) {
        console.error("Error in onActivatePremium:", error);
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
        return ControllerBuilder.newAccountController()
            .revokePremium(e)
            .build();
    } catch (error) {
        console.error("Error in onRevokeLicense:", error);
        return CardService.newActionResponseBuilder()
            .setNotification(
                CardService.newNotification()
                    .setText(
                        error.toString()))
            .build();
    }
}