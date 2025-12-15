class CardController {
    static create(
        cardService = CardService,
        documentProperties = PropertiesService.getDocumentProperties()
    ) {
        return new CardController(cardService, documentProperties);
    }

    constructor(cardService, documentProperties) {
        this.cardService = cardService;
        this.documentProperties = documentProperties;
    }

    pushCard(cardMeta = {}) {
        const cardWeapper = CardViewModel.CardServiceWrapper
            .create(this.cardService, this.documentProperties);

        const cardBuilder = cardWeapper.newCardBuilder(cardMeta);

        return this.cardService.newActionResponseBuilder()
            .setNavigation(
                this.cardService.newNavigation()
                    .pushCard(cardBuilder.build())
            );
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CardController };
}