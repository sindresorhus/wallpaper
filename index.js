'use strict';

if (process.platform === 'darwin') {
	module.exports = require('./lib/macos');
} else if (process.platform === 'win32') {
	module.exports = require('./lib/win');
} else {
	module.exports = require('./lib/linux');
}
