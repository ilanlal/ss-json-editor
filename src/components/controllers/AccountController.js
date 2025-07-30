class AccountController {
    constructor(sheet = SpreadsheetApp.getActiveSpreadsheet()) {
        this.sheet = sheet;
        this.localization = AppManager.getLocalizationResources(sheet);
        this.userStore = new UserStore();
        this.userLicenseManager = new UserLicenseManager(this.userStore);
        this.userLicense = this.userLicenseManager.getLicense();
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
        // Set the user license in the UserStore
        const userId = 'me'; // Assuming 'me' refers to the current user
        const planId = 'premium'; // Example plan ID
        const createdOn = new Date();
        const utcExpirationDate = new Date(
            createdOn.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
        const amount = 0; // Assuming no cost for the trial
        const userLicenseManager = new UserLicenseManager(this.userStore);
        userLicenseManager.setLicense(
            userId, planId, createdOn, utcExpirationDate, amount);

        // navigate to root
        const card = CardService.newActionResponseBuilder()
            .setNavigation(
                CardService.newNavigation()
                    .popToRoot())
            .setNavigation(
                CardService.newNavigation()
                    .updateCard(
                        HomeCard.create(
                            userLicenseManager.getLicense(),
                            this.localization,
                            this.userStore.getIndentSpaces())
                            .build()
                    ))
            .build();
        return card;
    }

    revokeLicense() {
        const userLicenseManager = new UserLicenseManager(this.userStore);
        userLicenseManager.revokeLicense();

        // navigate to root
        const card = CardService
            .newActionResponseBuilder()
            .setNavigation(
                CardService.newNavigation()
                    .popToRoot()
                    .updateCard(
                        HomeCard.create(
                            this.userLicenseManager.getLicense(),
                            this.localization,
                            this.userStore.getIndentSpaces())
                            .build()
                    ))
            .build();
        return card;
    }
}