import {promisify} from 'node:util';
import childProcess from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execFile = promisify(childProcess.execFile);

// Binary source → https://github.com/sindresorhus/win-wallpaper
const binary = path.join(__dirname, 'windows-wallpaper-x86-64.exe');

export async function getWallpaper() {
	const arguments_ = [
		'get',
	];

	const {stdout} = await execFile(binary, arguments_);
	return stdout.trim();
}

export async function setWallpaper(imagePath, {scale = 'fill'} = {}) {
	if (typeof imagePath !== 'string') {
		throw new TypeError('Expected a string');
	}

	const arguments_ = [
		'set',
		path.resolve(imagePath),
		'--scale',
		scale,
	];

	await execFile(binary, arguments_);
}
