// Apps Script code for Google Workspace Add-ons
class HomeController {
    constructor(localization, userStore) {
        this.localization = localization;
        this.userStore = userStore;
        this.userLicenseManager = new UserLicenseManager(userStore);
    }

    home() {
        const identSpaces = this.userStore.getIdentSpaces() || "2";
        const userLicense = this.userLicenseManager.getLicense();
        return HomeCard.create(userLicense, this.localization, identSpaces)
            .build();
    }
}
