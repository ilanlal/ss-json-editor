require('../../tests');
const { EMD } = require('./EMD');

describe('EMD Configuration', () => {
    it('should have Home entity defined correctly with all properties', () => {
        expect(EMD.Home).toBeDefined();
        expect(EMD.Home.entityName).toBe('Home');
        expect(typeof EMD.Home.card).toBe('function');
        expect(EMD.Home.sheetMeta).toBeUndefined();

        const card = EMD.Home.card({ isActive: true, isAdmin: false });
        expect(card).toBeDefined();
        expect(card.name).toBe('homeCard');
        expect(card.header).toBeDefined();
        expect(card.sections).toBeDefined();
        expect(card.sections.length).toBeGreaterThan(0);
        expect(card.sections[0].widgets).toBeDefined();
        expect(card.sections[0].widgets.length).toBeGreaterThan(0);
    });
});