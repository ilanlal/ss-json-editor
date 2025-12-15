require('../../../tests');
const { CardNavigationsController } = require('./CardNavigationsController');
const { EMD } = require('../../config/EMD');

describe('CardNavigationsController', () => {
    const documentProperties = PropertiesService.getDocumentProperties();
    test('should create an instance using the static create method', () => {
        const cardNavigationsController = CardNavigationsController.create();
        expect(cardNavigationsController).toBeInstanceOf(CardNavigationsController);
    });

    // pushCard
    it('should push a card onto the navigation stack', () => {
        const cardNavigationsController = CardNavigationsController.create();
        const navigation = cardNavigationsController.pushCard(EMD.Cards.Home);
        expect(navigation).toBeDefined();
        expect(typeof navigation).toBe('object');
    });

    // updateCard
    it('should update the current card in the navigation stack', () => {
        const cardNavigationsController = CardNavigationsController.create();
        const navigation = cardNavigationsController.updateCard(EMD.Cards.EnvironmentVariables);
        expect(navigation).toBeDefined();
        expect(typeof navigation).toBe('object');
    });

    // popCard
    it('should pop the current card off the navigation stack', () => {
        const cardNavigationsController = CardNavigationsController.create();
        const navigation = cardNavigationsController.popCard();
        expect(navigation).toBeDefined();
        expect(typeof navigation).toBe('object');
    });

    // popToRoot
    it('should pop to the root card in the navigation stack', () => {
        const cardNavigationsController = CardNavigationsController.create();
        const navigation = cardNavigationsController.popToRoot();
        expect(navigation).toBeDefined();
        expect(typeof navigation).toBe('object');
    });
});