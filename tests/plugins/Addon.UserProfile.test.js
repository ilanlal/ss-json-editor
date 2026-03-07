require('..');
const PropertiesService = require('@ilanlal/gasmocks/src/properties/PropertiesService');
const { Addon } = require('../../src/Addon');

describe('Addon.UserProfile', () => {
    const INP = Addon.INPUT_PARAMETERS;
    const MDL = Addon.Modules;

    describe('Controller', () => {
        const Controller = Addon.UserProfile.Controller;
        const apiKey = 'test-api-key';

        beforeEach(() => {
            // Set up any necessary mocks or spies
            PropertiesService.getScriptProperties().setProperty(INP.gemini_api_key, apiKey);
        });

        // Load test
        it('should handle Load', () => {
            const e = { parameters: {} };
            // Call the controller method expecte no errors and the response to contain the expected data
            let actionResponse = Controller.Load(e);
            expect(actionResponse).toBeDefined();
            // Verify that the response contains the expected data (e.g., user profile information)
            let data = actionResponse.getData();
            expect(data).toBeDefined();

            // Expect cardNavigations to be defined
            expect(data.cardNavigations).toBeDefined();
            if (!data.cardNavigations || data.cardNavigations.length === 0 || !data.cardNavigations[0].pushCard) {
                console.log(JSON.stringify(data, null, 2));
            }
            // Expect cardData to be defined
            const cardData = data.cardNavigations[0].pushCard;
            expect(cardData).toBeDefined();
            expect(cardData.name).toBe(Addon.UserProfile.id + '-Home');
        });

        // ActivatePremium test
        it('should handle ActivatePremium', () => {
            const e = { parameters: {} };
            // Call the controller method expecte no errors and the response to contain the expected data
            let actionResponse = Controller.ActivatePremium(e);
            expect(actionResponse).toBeDefined();
            // Verify that the response contains a notification with the expected message (e.g., "Premium features activated!")
            let data = actionResponse.getData();
            expect(data).toBeDefined();

            const popToRoot = data.cardNavigations[0].popToRoot;
            expect(popToRoot).toBeDefined();

            const cardData = data.cardNavigations[1].updateCard;
            expect(cardData).toBeDefined();
            expect(cardData.name).toBe(Addon.Home.id + '-Home');
        });

        // RevokeLicense test
        it('should handle RevokeLicense', () => {
            const e = { parameters: {} };
            // Call the controller method expecte no errors and the response to contain the expected data
            let actionResponse = Controller.RevokeLicense(e);
            expect(actionResponse).toBeDefined();
            // Verify that the response contains a notification with the expected message (e.g., "License revoked.")
            let data = actionResponse.getData();
            expect(data).toBeDefined();
            if (data.cardNavigations.length <= 1) {
                console.log(JSON.stringify(data, null, 2));
            }

            const popToRoot = data.cardNavigations[0].popToRoot;
            expect(popToRoot).toBeDefined();

            const cardData = data.cardNavigations[1].updateCard;
            expect(cardData).toBeDefined();
            expect(cardData.name).toBe(Addon.Home.id + '-Home');
        });
    });
});