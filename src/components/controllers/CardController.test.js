require('../../../tests');
const { CardController } = require('./CardController');
const { EMD } = require('../../config/EMD');

describe('Entity Controller', () => {
    const documentProperties = PropertiesService.getDocumentProperties();
    test('should create an instance using the static create method', () => {
        const cardController = CardController.create();
        expect(cardController).toBeInstanceOf(CardController);
    });

    // pushCard
    test('should push a card to the card service', () => {
        const cardServiceController = CardController.create(
            CardService,
            documentProperties
        );

        const actionResponseBuilder = cardServiceController.pushCard(
            EMD.Cards.Home({ isActive: true, isAdmin: false }));

        expect(actionResponseBuilder).toBeDefined();
        const builtResponse = actionResponseBuilder.build();
        expect(builtResponse).toBeDefined();
        const data = builtResponse.getData();
        expect(data).toBeDefined();
        expect(data.cardNavigations).toBeDefined();
        expect(data.cardNavigations.length).toBeGreaterThan(0);
        expect(data.cardNavigations[0].pushCard).toBeDefined();
        //console.log(JSON.stringify(data, null, 2));
    });
});