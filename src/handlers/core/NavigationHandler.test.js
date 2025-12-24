require('../../../tests');
const { NavigationHandler } = require('./NavigationHandler');

describe('NavigationHandler', () => {
    beforeEach(() => {
        // Reset any stubs or mocks if necessary
    });

    it('should create an instance of NavigationHandler', () => {
        const handler = new NavigationHandler();
        expect(handler).toBeInstanceOf(NavigationHandler);
    });

    // onPushCardClick
    it('should handle onPushCardClick', () => {
        const event = {
            parameters: {
                template: 'EMD.Cards.CardSample',
                cardName: 'cardA'
            }
        }; // Mock event object
        const actionResponse = NavigationHandler.ViewModel.onPushCardClick(event);
        expect(actionResponse).toBeDefined();

        const data = actionResponse.getData();
        expect(data).toBeDefined();

        // card name sholud be 'cardA' and 'cardA' sholud display in header.title
        expect(data.cardNavigations[0].pushCard.name).toBe('cardA');
        expect(data.cardNavigations[0].pushCard.header.title).toContain('cardA');
        expect(data.cardNavigations[0].pushCard.header.subTitle).toContain('Time: ');
    });

    // onPopCardClick
    it('should handle onPopCardClick', () => {
        const event = {}; // Mock event object
        const actionResponse = NavigationHandler.ViewModel.onPopCardClick(event);
        expect(actionResponse).toBeDefined();
        const data = actionResponse.getData();
        expect(data).toBeDefined();
        // no 'error' string in data
        expect(JSON.stringify(data).toLowerCase()).not.toContain('error');

    });

    // onUpdateCardClick
    it('should handle onUpdateCardClick', () => {
        const event = {
            parameters: {
                template: 'EMD.Cards.CardSample',
                cardName: 'cardA'
            }
        }; // Mock event object
        const actionResponse = NavigationHandler.ViewModel.onUpdateCardClick(event);
        expect(actionResponse).toBeDefined();
        const data = actionResponse.getData();
        expect(data).toBeDefined();
        // no 'error' string in data
        expect(JSON.stringify(data).toLowerCase()).not.toContain('error');
    });

    // onPopToNamedCardClick
    it('should handle onPopToNamedCardClick', () => {
        const event = {
            parameters: {
                cardName: 'EMD.Cards.Home'
            }
        }; // Mock event object
        const actionResponse = NavigationHandler.ViewModel.onPopToNamedCardClick(event);
        expect(actionResponse).toBeDefined();
        const data = actionResponse.getData();
        expect(data).toBeDefined();
        // no 'error' string in data
        expect(JSON.stringify(data).toLowerCase()).not.toContain('error');
    });

    // onPopToRootCardClick
    it('should handle onPopToRootCardClick', () => {
        const event = {}; // Mock event object
        const actionResponse = NavigationHandler.ViewModel.onPopToRootCardClick(event);
        expect(actionResponse).toBeDefined();
        const data = actionResponse.getData();
        expect(data).toBeDefined();
        // no 'error' string in data
        expect(JSON.stringify(data).toLowerCase()).not.toContain('error');
    });
});