/**
 * Deprecated: These functions are no longer used in the current implementation of the add-on.
 * They are retained here for reference and may be removed in future versions. 
 * The add-on now uses a more modular and event-driven architecture, 
 * and these functions have been replaced by more specific event handlers within the respective controllers.
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