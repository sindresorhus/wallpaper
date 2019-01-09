'use strict';
const {commandExists, execFile} = require('../util');

exports.isAvailable = () => commandExists('qdbus');

exports.set = async imagePath => {
	await execFile('qdbus', [
		'org.kde.plasmashell',
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
		`
	]);
};
