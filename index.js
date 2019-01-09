'use strict';

if (process.platform === 'darwin') {
	module.exports = require('./source/macos');
} else if (process.platform === 'win32') {
	module.exports = require('./source/win');
} else {
	module.exports = require('./source/linux');
}
