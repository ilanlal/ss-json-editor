require('..');
const { Addon } = require('../../src/Addon');

describe('Addon Package', () => {
    it('should have required properties', () => {
        expect(Addon.Package.version).toBeDefined();
        expect(Addon.Package.name).toBeDefined();
        expect(Addon.Package.description).toBeDefined();
        expect(Addon.Package.short_description).toBeDefined();
        expect(Addon.Package.build).toBeDefined();
        expect(Addon.Package.gitRepository).toBeDefined();
        expect(Addon.Package.author).toBeDefined();
        expect(Addon.Package.license).toBeDefined();
        expect(Addon.Package.imageUrl).toBeDefined();
    });
});