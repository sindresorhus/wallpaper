'use strict';
const {commandExists, execFile} = require('../util.js');

exports.isAvailable = () => commandExists('dcop');

exports.set = async imagePath => {
	await execFile('dcop', [
		'kdesktop',
		'KBackgroundIface',
		'setWallpaper',
		`${imagePath} 1`
	]);
};
