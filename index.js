'use strict';

let wallpaper;
if (process.platform === 'darwin') {
	wallpaper = require('./source/macos.js');
} else if (process.platform === 'win32') {
	wallpaper = require('./source/windows.js');
} else {
	wallpaper = require('./source/linux/index.js');
}

module.exports = wallpaper;
// TODO: remove this in the next major version
module.exports.default = wallpaper;
