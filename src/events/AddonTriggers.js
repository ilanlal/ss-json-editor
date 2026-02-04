// Google Apps Script file for handling add-on triggers and events
/**
 * Callback for the add-on homepage.
 * This function is called when the user opens the add-on.
 * It returns the home card to be displayed in the sidebar.
 * @see appsscript.json -->homepageTrigger
 */
function onDefaultHomePageOpen(e) {
    return Addon.Home.Controller.Load(e);
}
function onOpenAccountCard(e) {
    return Addon.UserProfile.Controller.Load(e);
}

function onMinifyRange(e) {
    return Addon.Home.Controller.Minify(e);
}

function onFormatRange(e) {
    return Addon.Home.Controller.Beautify(e);
}

function onShowAboutCard(e) {
    return Addon.Home.Controller.About(e);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        onDefaultHomePageOpen,
        onOpenAccountCard,
        onMinifyRange,
        onFormatRange,
        onShowAboutCard
    };
}