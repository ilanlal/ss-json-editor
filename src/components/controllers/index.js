const { CardController } = require('./CardController');
const { CardNavigationsController } = require('./CardNavigationsController');
const { SpreadsheetController } = require('./SpreadsheetController');

// Expose globally for tests and other scripts
global.CardController = CardController;
global.CardNavigationsController = CardNavigationsController;
global.SpreadsheetController = SpreadsheetController;