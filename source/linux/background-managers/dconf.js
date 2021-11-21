import {commandExists, execFile} from '../util.js';

export async function isAvailable() {
	return commandExists('dconf');
}

export async function get() {
	const {stdout} = await execFile('dconf', [
		'read',
		'/org/mate/desktop/background/picture-filename',
	]);

	return stdout.trim().slice(1, -1);
}

export async function set(imagePath) {
	await execFile('dconf', [
		'write',
		'/org/mate/desktop/background/picture-filename',
		`"${imagePath}"`,
	]);
}
