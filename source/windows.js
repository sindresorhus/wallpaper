import {promisify} from 'node:util';
import childProcess from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execFile = promisify(childProcess.execFile);

// Binary source → https://github.com/sindresorhus/win-wallpaper
const binary = path.join(__dirname, 'windows-wallpaper.exe');

export async function getWallpaper() {
	const {stdout} = await execFile(binary);
	return stdout.trim();
}

export async function setWallpaper(imagePath) {
	if (typeof imagePath !== 'string') {
		throw new TypeError('Expected a string');
	}

	await execFile(binary, [path.resolve(imagePath)]);
}
