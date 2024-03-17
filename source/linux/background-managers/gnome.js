import {commandExists, execFile, hasLine} from '../util.js';

export async function isAvailable() {
	return commandExists('gsettings');
}

async function isDarkStyle() {
	const {stdout} = await execFile('gsettings', [
		'get',
		'org.gnome.desktop.interface',
		'color-scheme'
	]);
	return hasLine(stdout, "'prefer-dark'") ? true : false;
}

export async function get() {
	const style = (await isDarkStyle()) ? 'picture-uri-dark' : 'picture-uri';

	const {stdout} = await execFile('gsettings', [
		'get',
		'org.gnome.desktop.background',
		style,
	]);

	return stdout.trim().slice(8, -1);
}

export async function set(imagePath) {
	const style = (await isDarkStyle()) ? 'picture-uri-dark' : 'picture-uri';
	await execFile('gsettings', [
		'set',
		'org.gnome.desktop.background',
		style,
		`file://${imagePath}`,
	]);
}