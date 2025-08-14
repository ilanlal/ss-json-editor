// Apps Script code for Google Workspace Add-ons
class HomeController {
    constructor() {
    }

    setIndentSpaces(spaces) {
        this.indentSpaces = spaces || UserStore.Constants.DEFAULT_INDENT_SPACES;
        return this;
    }

    getIndentSpaces() {
        return this.indentSpaces || UserStore.Constants.DEFAULT_INDENT_SPACES;
    }

    getLocalization() {
        return this.localization;
    }

    setUserInfo(userInfo) {
        this.userInfo = userInfo;
        return this;
    }

    getUserInfo() {
        return this.userInfo;
    }

    setUserStore(userStore) {
        this.userStore = userStore;
        return this;
    }

    getUserStore() {
        return this.userStore;
    }

    getUserLicense() {
        return this.getUserInfo()?.getUserLicense();
    }

    /**
     * @returns {CardService.ActionResponse}
     */
    home() {
        return CardService
            .newActionResponseBuilder()
            .setNavigation(
                CardService.newNavigation()
                    .pushCard(
                        ViewBuilder
                            .newHomeCard(this.userLicense, this.localization, this.indentSpaces)
                            .build()
                    )
            );
    }

    /**
     * Creates a new instance of HomeController with the necessary dependencies.
     * @returns {HomeController}
     */
    static newHomeController(localization, userStore) {
        return new HomeController(localization, userStore);
    }
}
