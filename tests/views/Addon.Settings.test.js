require('..');
const { Addon } = require('../../src/Addon');

const view = Addon.Settings.View;

describe('Addon.Settings.View', () => {
    // Home card test
    it('should build Settings Card', () => {
    const data = Addon.Modules.App.getData();
        const settingsCard = view.HomeCard(data);
        expect(settingsCard).toBeDefined();
        const cardData = settingsCard.getData();
        expect(cardData).toBeDefined();
        expect(cardData.name).toBe(Addon.Settings.name + '-Home');
    });
});