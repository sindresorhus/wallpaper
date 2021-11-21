import {commandExists, execFile, hasLine} from '../util.js';

export async function isAvailable() {
	if (!await commandExists('gsettings')) {
		return false;
	}

	try {
		const {stdout} = await execFile('gsettings', ['list-schemas']);
		return hasLine(stdout, 'org.cinnamon.desktop.background');
	} catch {
		return false;
	}
}

export async function get() {
	const {stdout} = await execFile('gsettings', [
		'get',
		'org.cinnamon.desktop.background',
		'picture-uri',
	]);

	return stdout.trim().slice(8, -1);
}

export async function set(imagePath) {
	await execFile('gsettings', [
		'set',
		'org.cinnamon.desktop.background',
		'picture-uri',
		`file://${imagePath}`,
	]);
}
