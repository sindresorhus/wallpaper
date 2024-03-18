import {commandExists, execFile, hasLine} from '../util.js';

export async function isAvailable() {
	return commandExists('gsettings');
}

async function isDarkStyle() {
	const {stdout} = await execFile('gsettings', [
		'get',
		'org.gnome.desktop.interface',
		'color-scheme',
	]);

	return Boolean(hasLine(stdout, '\'prefer-dark\''));
}

export async function get() {
	const keyForStyle = (await isDarkStyle()) ? 'picture-uri-dark' : 'picture-uri';

	const {stdout} = await execFile('gsettings', [
		'get',
		'org.gnome.desktop.background',
		keyForStyle,
	]);

	return stdout.trim().slice(8, -1);
}

export async function set(imagePath) {
	const keyForStyle = (await isDarkStyle()) ? 'picture-uri-dark' : 'picture-uri';

	await execFile('gsettings', [
		'set',
		'org.gnome.desktop.background',
		keyForStyle,
		`file://${imagePath}`,
	]);
}
