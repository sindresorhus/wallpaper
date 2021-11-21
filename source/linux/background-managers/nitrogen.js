import path from 'node:path';
import os from 'node:os';
import {commandExists, execFile, readFile} from '../util.js';

const homeDirectory = os.homedir();

export async function isAvailable() {
	return commandExists('nitrogen');
}

export async function get() {
	const configFile = path.join(homeDirectory, '.config/nitrogen/bg-saved.cfg');
	const config = await readFile(configFile, 'utf8');
	return config.trim().split('\n').find(line => line.startsWith('file=')).replace('file=', '');
}

export async function set(imagePath) {
	await execFile('nitrogen', [
		'--set-zoom-fill',
		'--save',
		imagePath,
	]);
}
