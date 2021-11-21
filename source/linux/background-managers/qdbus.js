import {commandExists, execFile} from '../util.js';

export async function isAvailable() {
	return commandExists('qdbus');
}

export async function set(imagePath) {
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
		`,
	]);
}
