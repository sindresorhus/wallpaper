import {commandExists, execFile} from '../util.js';

export async function isAvailable() {
	return commandExists('pcmanfm');
}

export async function set(imagePath) {
	await execFile('pcmanfm', ['--set-wallpaper', imagePath]);
}
