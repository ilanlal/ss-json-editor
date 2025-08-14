class AboutController {
    constructor(localization) {
        this.localization = localization;
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

    static newAboutController(localization) {
        return new AboutController(localization);
    }
}