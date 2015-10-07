'use strict';

if (process.platform === 'darwin') {
	module.exports = require('./lib/osx');
} else if (process.platform === 'win32') {
	module.exports = require('./lib/win');
} else {
	module.exports = require('pify').all(require('./lib/linux'));
}
