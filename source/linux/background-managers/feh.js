import {commandExists, execFile} from '../util.js';

export async function isAvailable() {
	return commandExists('feh');
}

export async function set(imagePath) {
	await execFile('feh', ['--bg-fill', imagePath]);
}
