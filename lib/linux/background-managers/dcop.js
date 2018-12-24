'use strict';

const {commandExists, execFile} = require('../util');

exports.isAvailable = function () {
	return commandExists('dcop');
};

exports.set = async function (imagePath) {
	await execFile('dcop', ['kdesktop', 'KBackgroundIface', 'setWallpaper', imagePath + ' 1']);
};
