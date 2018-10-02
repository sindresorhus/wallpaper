'use strict';

const childProcess = require('child_process');
const util = require('util');
const {existCommand} = require('../util');

const execFile = util.promisify(childProcess.execFile);

exports.available = function () {
	return existCommand('qdbus');
};

exports.set = async function (imagePath) {
	await execFile('qdbus', ['org.kde.plasmashell',
		'/PlasmaShell',
		'org.kde.PlasmaShell.evaluateScript',
		`
		var allDesktops = desktops();
		for (var i = 0; i < allDesktops.length; i++) {
			var desktop = allDesktops[i];
			desktop.wallpaperPlugin = 'org.kde.image';
			desktop.currentConfigGroup = ['Wallpaper', 'org.kde.image', 'General'];
			desktop.writeConfig('Image', 'file://${imagePath}');
		}
	`]);
};
