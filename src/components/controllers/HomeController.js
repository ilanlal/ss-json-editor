// Apps Script code for Google Workspace Add-ons
class HomeController {
    constructor(localization, userStore) {
        this.localization = localization;
        this.userStore = userStore;
        this.userLicenseManager = new UserLicenseManager(userStore);
        this.userLicense = this.userLicenseManager.getLicense();
        this.indentSpaces = this.userStore.getIndentSpaces() || "2";
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
                        HomeCard.create(
                            this.userLicense, this.localization, this.indentSpaces)
                            .build()));
    }

    /**
     * Creates a new instance of HomeController with the necessary dependencies.
     * @returns {HomeController}
     */
    static newController(localization, userStore) {
        return new HomeController(localization, userStore);
    }


}
