const { EMD } = require('./EMD');
const { Config } = require('./Config');

// Expose globally for tests and other scripts
global.Config = Config;
global.EMD = EMD;