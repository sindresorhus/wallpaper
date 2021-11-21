import {commandExists, execFile} from '../util.js';

export async function isAvailable() {
	return commandExists('gconftool-2');
}

export async function set(imagePath) {
	await execFile('gconftool-2', [
		'--set',
		'/desktop/gnome/background/picture_filename',
		'--type',
		'string',
		imagePath,
	]);
}
