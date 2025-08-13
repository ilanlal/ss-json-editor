class AboutController {
    constructor(localization) {
        this.localization = localization || AppManager.getLocalizationResources();
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
}