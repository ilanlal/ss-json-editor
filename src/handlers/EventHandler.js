class EventHandler {
    get userProperties() {
        if (!this._userProperties) {
            this._userProperties = PropertiesService.getDocumentProperties();
        }
        return this._userProperties;
    }

    constructor() {
        this._userProperties = null;
    }
};

EventHandler.Addon = {
    onOpenHomeCard: (e) => {
        return new EventHandler
            .AddonWrapper(
                EventHandler.prototype.userProperties)
            .handleOpenHomeCard(e);
    },
    onOpenAccountCard: (e) => {
        return new EventHandler
            .AddonWrapper(
                EventHandler.prototype.userProperties)
            .handleOpenAccountCard(e);
    },
    onOpenAboutCard: (e) => {
        return new EventHandler
            .AddonWrapper(
                EventHandler.prototype.userProperties)
            .handleOpenAboutCard(e);
    },
    onActivatePremiumClicked: (e) => {
        return new EventHandler
            .AddonWrapper(
                EventHandler.prototype.userProperties)
            .handleActivatePremiumClicked(e);
    },
    onRevokeLicenseClicked: (e) => {
        return new EventHandler
            .AddonWrapper(
                EventHandler.prototype.userProperties)
            .handleRevokeLicenseClicked(e);
    }
}
EventHandler.AddonWrapper = class {
    constructor(userProperties) {
        this._userProperties = userProperties;
    }

    handleOpenHomeCard(e) {
        return CardHandler.Addon
                .onOpenCardClick({ parameters: { card: 'EMD.Cards.Home' } });
    }

    handleOpenAccountCard(e) {
        return CardHandler.Addon
                .onOpenCardClick({ parameters: { card: 'EMD.Cards.Account' } });
    }

    handleOpenAboutCard(e) {
        return CardHandler.Addon
                .onOpenCardClick({ parameters: { card: 'EMD.Cards.About' } });
    }

    handleActivatePremiumClicked(e) {
        try {
            // return "Not implemented yet" error
            throw new Error("Not implemented yet");
        } catch (error) {
            return this.handleError(error)
                .build();
        }
    }

    handleRevokeLicenseClicked(e) {
        try {
            // return "Not implemented yet" error
            throw new Error("Not implemented yet");
        } catch (error) {
            return this.handleError(error)
                .build();
        }
    }

    handleOperationSuccess(message) {
        // Show a success message to the user
        return CardService.newActionResponseBuilder()
            .setNotification(
                CardService.newNotification()
                    .setText(message));
    }

    handleError(error) {
        // Show an error message to the user
        return CardService.newActionResponseBuilder()
            .setNotification(
                CardService.newNotification()
                    .setText(
                        error.toString()));
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EventHandler
    };
}