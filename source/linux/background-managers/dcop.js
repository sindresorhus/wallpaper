import {commandExists, execFile} from '../util.js';

export async function isAvailable() {
	return commandExists('dcop');
}

export async function set(imagePath) {
	await execFile('dcop', [
		'kdesktop',
		'KBackgroundIface',
		'setWallpaper',
		`${imagePath} 1`,
	]);
}
