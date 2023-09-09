import {commandExists, spawn} from '../util.js';

export async function isAvailable() {
	return commandExists('swaybg');
}

export async function set(imagePath) {
	await spawn('swaybg', ['-i', imagePath, '-m', 'fill']);
}
