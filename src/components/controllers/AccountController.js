class AccountController {
    constructor(localization, userStore) {
        this.localization = localization;
        this.userStore = userStore;
        this.userLicenseManager = new UserLicenseManager(this.userStore);
        this.userLicense = this.userLicenseManager.getLicense();
    }

    static newController(localization, userStore) {
        return new AccountController(localization, userStore);
    }

    /**
     * Creates a card for account management.
     * @returns {CardService.ActionResponse}
     */
    home() {
        return CardService.newActionResponseBuilder()
            .setNavigation(
                CardService.newNavigation()
                    .pushCard(
                        AccountCard
                            .create(this.userLicense, this.localization)
                            .build()));
    }

    activatePremium(e) {
        // Set the user license in the UserStore
        const userId = 'me'; // Assuming 'me' refers to the current user
        const planId = 'premium'; // Example plan ID
        const createdOn = new Date();
        const utcExpirationDate = new Date(
            createdOn.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
        const amount = 0; // Assuming no cost for the trial

        this.userLicenseManager.setLicense(
            userId, planId, createdOn, utcExpirationDate, amount);

        // navigate to root
        return CardService.newActionResponseBuilder()
            .setNavigation(
                CardService.newNavigation()
                    .popToRoot()
                    .updateCard(
                        HomeCard.create(
                            userLicenseManager.getLicense(),
                            this.localization,
                            this.userStore.getIndentSpaces())
                            .build()
                    ));
    }

    revokePremium(e) {
        this.userLicenseManager.revokeLicense();

        // navigate to root
        return CardService
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
                    ));

    }

    /**
     * Handles the change of indent spaces.
     * @param {Object} e - The event object containing the new indent spaces.
     * @returns {CardService.ActionResponse}
     */
    indentSpacesChange(e) {
        try {
            const selectedSpaces = e?.commonEventObject?.formInputs?.[Static_Resources.resources.indentSpaces]?.stringInputs?.value[0] || "2";
            this.userStore.setIndentSpaces(selectedSpaces); // Store the selected spaces in user properties
            return this.handleOperationSuccess();
        } catch (error) {
            return CardService.newActionResponseBuilder()
                .setNotification(CardService.newNotification()
                    .setText(error.toString()))
                .build();
        }
    }

    /**
     * @returns {CardService.ActionResponse}
     */
    handleOperationSuccess() {
        return CardService.newActionResponseBuilder()
            .setNotification(
                CardService.newNotification()
                    .setText(this.localization.messages.success))
            .setStateChanged(false);
    }
}