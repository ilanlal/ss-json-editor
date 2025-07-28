class AccountController {
    constructor(sheet = SpreadsheetApp.getActiveSpreadsheet()) {
        this.sheet = sheet;
        this.localization = AppManager.getLocalizationResources(sheet);
        this.userStore = new UserStore();
        this.userLicense = this.userStore.getUserLicense();
    }

    /**
     * Creates a card for account management.
     * @returns {CardService.Card} - The card for account management.
     */
    home() {
        const card = AccountCard.create(this.userLicense, this.localization);
        return card.build();
    }

    activatePremium() {
        throw new Error("Not implemented");
    }
}