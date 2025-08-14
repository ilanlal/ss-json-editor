class AccountController {
    constructor() {
    }

    setLocalization(localization) {
        this.localization = localization;
        return this;
    }

    getLocalization() {
        return this.localization;
    }

    setUserInfo(userInfo) {
        this.userInfo = userInfo;
        return this;
    }

    getUserInfo() {
        return this.userInfo;
    }

    setUserStore(userStore) {
        this.userStore = userStore;
        return this;
    }

    getUserStore() {
        return this.userStore;
    }

    getUserLicense() {
        return this.getUserInfo()?.getUserLicense();
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
                        ViewBuilder.newAccountCard(this.localization, this.getUserInfo())
                            .build()
                    )
            );
    }

    activatePremium(e) {
        // Set the user license in the UserStore
        const userId = e?.parameters?.userId || '_user'; // Assuming 'me' refers to the current user
        const planId = e?.parameters?.planId || '_plan'; // Default to 'premium' plan
        const days = parseInt(e?.parameters?.days || 1);
        const createdOn = new Date();
        const milliseconds = days * 24 * 60 * 60 * 1000; // Convert days to milliseconds
        const expirDate = new Date(createdOn.getTime() + milliseconds); // Calculate expiration date
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
                            this.getUserInfo(),
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

    static newAccountController(localization, userStore) {
        return new AccountController()
            .setLocalization(localization)
            .setUserStore(userStore);
    }
}