import {commandExists, execFile} from '../util.js';

export async function isAvailable() {
	return commandExists('setroot');
}

export async function set(imagePath) {
	await execFile('setroot', [imagePath]);
}
