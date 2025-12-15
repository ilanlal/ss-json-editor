class CardNavigationsController {
    static create(cardService = CardService,
        documentProperties = PropertiesService.getDocumentProperties()) {
        return new CardNavigationsController(cardService, documentProperties);
    }

    constructor(cardService, documentProperties) {
        this.cardService = cardService;
        this.documentProperties = documentProperties;
    }

    pushCard(cardMeta = {}) {
        const cardWeapper = CardViewModel.CardServiceWrapper
            .create(this.cardService, this.documentProperties);
        const cardBuilder = cardWeapper.newCardBuilder(cardMeta);

        // Pushes a new card onto the navigation stack. Can be chained with other card navigation actions.
        return this.cardService.newNavigation()
            .pushCard(
                cardBuilder.build()
            );
    }

    updateCard(cardMeta = {}) {
        const cardWeapper = CardViewModel.CardServiceWrapper
            .create(this.cardService, this.documentProperties);
        const cardBuilder = cardWeapper.newCardBuilder(cardMeta);

        // Does an in-place replacement of the current card. Can be chained with other card navigation actions.
        return this.cardService.newNavigation()
            .updateCard(
                cardBuilder.build()
            );
    }

    popCard() {
        // Pops the current card off the navigation stack. Can be chained with other card navigation actions.
        return this.cardService.newNavigation()
            .popCard();
    }

    popToRoot() {
        // Pops all cards off the navigation stack until the root card is reached. Can be chained with other card navigation actions.
        return this.cardService.newNavigation()
            .popToRoot();
    }

    popToNamedCard(cardName) {
        // Pops to the specified card by its card name. Can be chained with other card navigation actions.
        return this.cardService.newNavigation()
            .popToNamedCard(cardName);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CardNavigationsController
    };
}