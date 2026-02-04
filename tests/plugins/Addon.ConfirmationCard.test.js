require('..');
const { Addon } = require('../../src/Addon');

describe('Addon.ConfirmationCard', () => {
    beforeEach(() => {
    });

    describe('ConfirmationCard Plugin', () => {
        it('should have required properties', () => {
            expect(Addon.ConfirmationCard.id).toBeDefined();
            expect(Addon.ConfirmationCard.name).toBeDefined();
        });

        // Load test
        it('should handle Load', () => {
            const event = {
                commonEventObject: {
                    parameters: { title: 'Test Title', message: 'Test Message', onClickFunctionName: 'TestFunction', onClickParameters: JSON.stringify({ key: 'value' }) }
                }
            };
            const result = Addon.ConfirmationCard.Controller['Load'](event);
            expect(result).toBeDefined();
            const data = result.getData();
            expect(data).toBeDefined();
            // Expect cardNavigations to be defined
            expect(data.cardNavigations).toBeDefined();
            const cardData = data.cardNavigations[0].pushCard;
            expect(cardData).toBeDefined();
            expect(cardData.name).toBe(Addon.ConfirmationCard.id + '-Home');

        });

        // should throw error for missing parameters
        it('should handle Load with missing parameters', () => {
            const event = {
                commonEventObject: {
                    parameters: { title: 'Test Title' } // Missing message and onClickFunctionName
                }
            };
            expect(() => {
                Addon.ConfirmationCard.Controller['Load'](event);
            }).toThrowError('Missing required parameters: message, onClickFunctionName');
        });

        // Cancel test
        it('should handle Cancel', () => {
            const event = {
                commonEventObject: {}
            };
            const result = Addon.ConfirmationCard.Controller['Cancel'](event);
            expect(result).toBeDefined();
            const data = result.getData();
            expect(data).toBeDefined();
            // Expect cardNavigations to be defined
            expect(data.cardNavigations).toBeDefined();

            // Expect popCard to be defined
            expect(data.cardNavigations[0].popCard).toBeDefined();
        });
    });
});