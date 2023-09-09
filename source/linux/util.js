import {promisify} from 'node:util';
import childProcess from 'node:child_process';
import {promises as fsPromises} from 'node:fs';

export const execFile = promisify(childProcess.execFile);
export const exec = promisify(childProcess.exec);
export const spawn = (
	cmd,
	args,
) => new Promise(resolve => {
	const cp = childProcess.spawn(cmd, args);
	cp.on('spawn', () => {
		resolve();
	});

	cp.on('exit', (code, signal) => {
		if (code) {
			console.log(`swaybg exited with ${code} code`);
		}

		if (signal) {
			console.log(`swaybg exited with ${signal} signal`);
		}
	});
});

export async function commandExists(command) {
	// `which` all commands and expect stdout to return a positive
	try {
		let {stdout} = await execFile('which', ['-a', command]);
		stdout = stdout.trim();

		if (!stdout) {
			return false;
		}

		return true;
	} catch {
		return false;
	}
}

export function hasLine(string, lineToFind) {
	return string.split('\n').find(line => line.trim() === lineToFind);
}

export const {readFile} = fsPromises;
