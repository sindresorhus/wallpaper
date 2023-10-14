import childProcess from 'node:child_process';
import {commandExists} from '../util.js';

export async function isAvailable() {
	return commandExists('swaybg');
}

export async function set(imagePath) {
	return new Promise((resolve, reject) => {
		const cp = childProcess.spawn('swaybg', ['--image', imagePath, '--mode', 'fill']);

		cp.stderr.on('data', data => {
			if (data.includes('Failed to load image')) {
				cp.kill('SIGINT');
				reject(new Error(`Failed to load image from ${imagePath}`));
			} else {
				resolve();
			}
		});
	});
}
