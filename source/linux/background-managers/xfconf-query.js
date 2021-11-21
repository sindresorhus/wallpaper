import {commandExists, execFile} from '../util.js';

export async function isAvailable() {
	return commandExists('xfconf-query');
}

export async function set(imagePath) {
	await execFile('xfconf-query', [
		'--channel',
		'xfce4-desktop',
		'--property',
		'/backdrop/screen0/monitor0/image-path',
		'--set',
		`${imagePath}`,
	]);
}
