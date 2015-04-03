'use strict';

if (process.platform === 'darwin') {
	module.exports = require('osx-wallpaper');
	return;
}

if (process.platform === 'win32') {
	module.exports = require('win-wallpaper');
	return;
}

module.exports = require('linux-wallpaper');
