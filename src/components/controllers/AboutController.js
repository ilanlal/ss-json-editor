class AboutController {
    constructor(localization, userStore, userInfo) {
        this.localization = localization;
        this.userStore = userStore;
        this.userInfo = userInfo;
    }

    /**
    * @returns {CardService.ActionResponse}
    */
    home() {
        return CardService.newActionResponseBuilder()
            .setNavigation(CardService
                .newNavigation()
                .pushCard(ViewBuilder
                    .newAboutCard(this.localization, Static_Resources.package)
                    .build()));
    }

    static newAboutController(localization, userStore, userInfo) {
        return new AboutController(localization, userStore, userInfo);
    }
}