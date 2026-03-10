import {commandExists, execFile} from '../util.js';

export async function isAvailable() {
	return commandExists('awww');
}

async function initialize() {
	try {
		await execFile('awww', ['init']);
	} catch (error) {
		if (error.stderr.includes('There seems to already be another instance running')) {
			return;
		}

		throw new Error(`Failed to set image for awww: ${error.stderr}`);
	}
}

export async function get() {
	await initialize();
	const {stdout: query} = await execFile('awww', ['query']);
	return query.slice(query.indexOf('/'), query.indexOf('\n'));
}

export async function set(imagePath) {
	await initialize();
	await execFile('awww', ['img', imagePath]);
}
