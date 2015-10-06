'use strict';

if (process.platform === 'darwin') {
	module.exports = require('osx-wallpaper');
} else if (process.platform === 'win32') {
	module.exports = require('./lib/win');
} else {
	module.exports = require('linux-wallpaper');
}
