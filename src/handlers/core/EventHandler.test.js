require('../../../tests');

const { EventHandler } = require('./EventHandler');

describe('EventHandler', () => {
    it('should create an instance of EventHandler', () => {
        const handler = new EventHandler();
        expect(handler).toBeInstanceOf(EventHandler);
    });

    it('should onOpenHomeCard', () => {
        const event = {}; // Mock event object
        const actionResponse = EventHandler.ViewModel.onOpenHomeCard(event);
        expect(actionResponse).toBeDefined();
        const data = actionResponse.getData();
        expect(data).toBeDefined();
        // not notification
        expect(data.notification).toBeUndefined();
        //{ cardNavigations: [ { pushCard: [Object] } ] }
        expect(data.cardNavigations).toBeDefined();
        expect(data.cardNavigations.length).toBeGreaterThan(0);
        expect(data.cardNavigations[0].pushCard).toBeDefined();
    });

    it('should handle onAccountCardOpen', () => {
        const event = {}; // Mock event object
        const actionResponse = EventHandler.ViewModel.onOpenAccountCard(event);
        expect(actionResponse).toBeDefined();
        const data = actionResponse.getData();
        expect(data).toBeDefined();

        // not notification
        expect(data.notification).toBeUndefined();
        //{ cardNavigations: [ { pushCard: [Object] } ] }
        expect(data.cardNavigations).toBeDefined();
        expect(data.cardNavigations.length).toBeGreaterThan(0);
        expect(data.cardNavigations[0].pushCard).toBeDefined();
    });

    it('should handle onAboutCardOpen', () => {
        const event = {}; // Mock event object
        const actionResponse = EventHandler.ViewModel.onOpenAboutCard(event);
        expect(actionResponse).toBeDefined();
        const data = actionResponse.getData();
        expect(data).toBeDefined();
        // not notification
        expect(data.notification).toBeUndefined();
        //{ cardNavigations: [ { pushCard: [Object] } ] }
        expect(data.cardNavigations).toBeDefined();
        expect(data.cardNavigations.length).toBeGreaterThan(0);
        expect(data.cardNavigations[0].pushCard).toBeDefined();
    });

    // Additional tests for other handlers can be added similarly
});