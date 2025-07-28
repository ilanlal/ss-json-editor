// Apps Script code for Google Workspace Add-ons
class HomeController {
    constructor(localization, userStore) {
        this.localization = localization;
        this.userStore = userStore;
    }

    createHomeCard() {
        return new HomeCard(this.localization, this.userStore)
            .createHomeCard()
            .build();
    }
}
