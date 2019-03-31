'use strict';

let wallpaper;
if (process.platform === 'darwin') {
	wallpaper = require('./source/macos');
} else if (process.platform === 'win32') {
	wallpaper = require('./source/win');
} else {
	wallpaper = require('./source/linux');
}

module.exports = wallpaper;
// TODO: remove this in the next major version
module.exports.default = wallpaper;
