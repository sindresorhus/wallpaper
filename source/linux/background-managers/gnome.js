import {commandExists, execFile} from '../util.js';

export async function isAvailable() {
	return commandExists('gsettings');
}

export async function get() {
	const {stdout} = await execFile('gsettings', [
		'get',
		'org.gnome.desktop.background',
		'picture-uri',
	]);

	return stdout.trim().slice(8, -1);
}

export async function set(imagePath) {
	await execFile('gsettings', [
		'set',
		'org.gnome.desktop.background',
		'picture-uri',
		`file://${imagePath}`,
	]);
}
