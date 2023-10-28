import {commandExists, execFile} from '../util.js';

export async function isAvailable() {
	return commandExists('swww');
}

async function initialize() {
	try {
		await execFile('swww', ['init']);
	} catch (error) {
		if (
			error.stderr.includes('There seems to already be another instance running...')
		) {
			return;
		}

		throw new Error(`Failed to set image: \n swww - ${error.stderr}`);
	}
}

export async function set(imagePath) {
	await initialize();
	await execFile('swww', ['img', imagePath]);
}
