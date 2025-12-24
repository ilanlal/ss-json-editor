class EventHandler {
};

EventHandler.ViewModel = {
    onOpenHomeCard: (e) => {
        return NavigationHandler.ViewModel
            .onPushCardClick({ parameters: { template: 'EMD.Cards.Home' } });
    },
    onOpenAccountCard: (e) => {
        return NavigationHandler.ViewModel
            .onPushCardClick({ parameters: { template: 'EMD.Cards.Account' } });
    },
    onOpenAboutCard: (e) => {
        return NavigationHandler.ViewModel
            .onPushCardClick({ parameters: { template: 'EMD.Cards.About' } });
    },
    onOpenHelpCard: (e) => {
        return NavigationHandler.ViewModel
            .onPushCardClick({ parameters: { template: 'EMD.Cards.Help' } });
    },
    onActivatePremiumClicked: (e) => {
        throw new Error("Not implemented yet");
    },
    onRevokeLicenseClicked: (e) => {
        throw new Error("Not implemented yet");
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EventHandler
    };
}