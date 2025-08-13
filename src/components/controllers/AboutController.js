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
                .pushCard(
                    AboutCard.create(this.localization)
                        .build()));
    }

    static newAboutController(localization) {
        return new AboutController(localization);
    }
}