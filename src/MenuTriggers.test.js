require('../tests');
const { MenuTriggers } = require('./MenuTriggers');

describe('MenuTriggers', () => {
    beforeEach(() => {
    });

    // onMenuFormatRange
    it('should run onMenuFormatRange message handler', () => {
        const event = {}; // Mock event object
        MenuTriggers.onMenuFormatRange(event);
    });

    // onMenuMinifyRange
    it('should run onMenuMinifyRange message handler', () => {
        const event = {}; // Mock event object
        MenuTriggers.onMenuMinifyRange(event);
    });
});