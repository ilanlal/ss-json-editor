require('..');
const { Addon } = require('../../src/Addon');

describe('Addon.Home', () => {
    beforeEach(() => {
        // UrlFetchAppStubConfiguration.reset();
    });

    describe('Home Plugin', () => {
        // Load test
        it('should handle Load', () => {
            // mock event parameters
            const e = { parameters: {} };
            const homeCard = Addon.Home.Controller.Load(e);
            expect(homeCard).toBeDefined();
            const cardData = homeCard.getData();
            expect(cardData).toBeDefined();
            expect(cardData.cardNavigations).toBeDefined();
            expect(cardData.cardNavigations.length).toBeGreaterThan(0);
            expect(cardData.cardNavigations[0].pushCard).toBeDefined();
            // No notification
            expect(cardData.notification).toBeUndefined();

            // pushCard data
            const pushCardData = cardData.cardNavigations[0].pushCard;
            expect(pushCardData.name).toBe(Addon.Home.id + '-Home');

        });

        // OnHelp test
        it('should handle OnHelp', () => {
            // mock event parameters
            const e = { parameters: {} };
            const helpCard = Addon.Home.Controller.Help(e);
            expect(helpCard).toBeDefined();
            const cardData = helpCard.getData();
            expect(cardData).toBeDefined();
            // no notification
            expect(cardData.notification).toBeUndefined();
        });

        // OnAbout test
        it('should handle OnAbout', () => {
            // mock event parameters
            const e = { parameters: {} };
            const aboutCard = Addon.Home.Controller.About(e);
            expect(aboutCard).toBeDefined();
            const cardData = aboutCard.getData();
            expect(cardData).toBeDefined();

            // no notification
            expect(cardData.notification).toBeUndefined();
        });

        
    });
});