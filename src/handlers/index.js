const { NavigationHandler } = require('./core/NavigationHandler');
const { EventHandler } = require('./core/EventHandler');
const { SpreadsheetHandler } = require('./core/SpreadsheetHandler');
const { AddonHandler } = require('./AddonHandler');

// Expose globally for tests and other scripts
global.NavigationHandler = NavigationHandler;
global.EventHandler = EventHandler;
global.SpreadsheetHandler = SpreadsheetHandler;
global.AddonHandler = AddonHandler;