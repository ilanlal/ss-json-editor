class AccountController {
    constructor(localization, userStore) {
        this.localization = localization;
        this.userStore = userStore;
        this.userLicense = this.userStore.getUserLicense();
    }

    static newAccountController(localization, userStore) {
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
                        ViewBuilder.newAccountCard(this.userLicense, this.localization)
                            .build()
                    )
            );
    }

    activatePremium(e) {
        // Set the user license in the UserStore
        const userId = 'me'; // Assuming 'me' refers to the current user
        const planId = 'premium'; // Example plan ID
        const createdOn = new Date();
        const ticks = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
        const expirDate = new Date(createdOn.getTime() + ticks); // 14 days from now
        const amount = 0; // Assuming no cost for the trial
        const newUserLicense = ModelBuilder.newUserLicense()
            .setUserId(userId)
            .setPlanId(planId)
            .setExpirationDate(expirDate)
            .setAmount(amount);

        this.userStore.setUserLicense(newUserLicense);

        // navigate to root
        return CardService.newActionResponseBuilder()
            .setNavigation(
                CardService.newNavigation()
                    .popToRoot()
                    .updateCard(
                        ViewBuilder.newHomeCard(
                            this.userStore.getUserLicense(),
                            this.localization,
                            this.userStore.getIndentSpaces()
                        ).build()
                    ));
    }

    revokePremium(e) {
        this.userStore.clearUserLicense();

        // navigate to root
        return CardService
            .newActionResponseBuilder()
            .setNavigation(
                CardService.newNavigation()
                    .popToRoot()
                    .updateCard(
                        ViewBuilder.newHomeCard(
                            this.userStore.getUserLicense(),
                            this.localization,
                            this.userStore.getIndentSpaces()
                        ).build()
                    ));

    }

    /**
     * Handles the change of indent spaces.
     * @param {Object} e - The event object containing the new indent spaces.
     * @returns {CardService.ActionResponse}
     */
    indentSpacesChange(e) {
        try {
            const selectedSpaces = e?.commonEventObject
                ?.formInputs?.[Static_Resources.resources.indentSpaces]
                ?.stringInputs?.value[0] || "2";
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