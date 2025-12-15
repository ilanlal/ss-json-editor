const { CardHandler } = require('./CardHandler');
const { EventHandler } = require('./EventHandler');
const { SpreadsheetHandler } = require('./SpreadsheetHandler');

// Expose globally for tests and other scripts
global.CardHandler = CardHandler;
global.EventHandler = EventHandler;
global.SpreadsheetHandler = SpreadsheetHandler;