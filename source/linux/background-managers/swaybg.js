import childProcess from 'node:child_process';
import {commandExists} from '../util.js';

export async function isAvailable() {
	return commandExists('swaybg');
}

export async function set(imagePath) {
	const spawn = (
		cmd,
		args,
	) => new Promise((resolve, reject) => {
		const cp = childProcess.spawn(cmd, args);
		cp.stderr.on('data', data => {
			if (data.includes('Failed to load image')) {
				reject(new Error(`Failed to load ${args[1]}`));
			} else {
				resolve();
			}
		});
	});

	try {
		await spawn('swaybg', ['--image', imagePath, '--mode', 'fill']);
	} catch (error) {
		console.error(error);
	}
}
