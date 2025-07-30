// Apps Script code for Google Workspace Add-ons
class HomeController {
    constructor(localization, userStore) {
        this.localization = localization;
        this.userStore = userStore;
        this.userLicenseManager = new UserLicenseManager(userStore);
    }

    home() {
        const indentSpaces = this.userStore.getIndentSpaces() || "2";
        const userLicense = this.userLicenseManager.getLicense();
        return HomeCard.create(userLicense, this.localization, indentSpaces)
            .build();
    }
}
