import fs from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {promisify} from 'node:util';
import childProcess from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execFile = promisify(childProcess.execFile);

// Binary source → https://github.com/sindresorhus/macos-wallpaper
const binary = path.join(__dirname, 'macos-wallpaper');

async function isAlreadySetToPath(resolvedPath, screen) {
	const stat = await fs.stat(resolvedPath).catch(() => undefined);
	if (!stat?.isFile()) {
		return false;
	}

	const current = await getWallpaper({screen});
	const currentPaths = Array.isArray(current) ? current : [current];
	return currentPaths.some(p => path.resolve(p) === resolvedPath);
}

export async function getWallpaper({screen = 'main'} = {}) {
	let {stdout} = await execFile(binary, ['get', '--screen', screen]);
	stdout = stdout.trim();

	if (screen === 'all') {
		return stdout.split('\n');
	}

	return stdout;
}

export async function setWallpaper(imagePath, {screen = 'all', scale = 'auto'} = {}) {
	if (typeof imagePath !== 'string') {
		throw new TypeError('Expected a string');
	}

	const resolvedPath = path.resolve(imagePath);
	const arguments_ = ['set', resolvedPath, '--screen', screen, '--scale', scale];

	if (await isAlreadySetToPath(resolvedPath, screen)) {
		const temporaryPath = path.join(os.tmpdir(), `wallpaper-${randomUUID()}${path.extname(imagePath)}`);
		await fs.copyFile(resolvedPath, temporaryPath);
		try {
			await execFile(binary, ['set', temporaryPath, '--screen', screen, '--scale', scale]);
			await execFile(binary, arguments_);
		} finally {
			await fs.rm(temporaryPath, {force: true});
		}

		return;
	}

	await execFile(binary, arguments_);
}

export async function setSolidColorWallpaper(color, {screen = 'all'} = {}) {
	if (typeof color !== 'string') {
		throw new TypeError('Expected a string');
	}

	const arguments_ = [
		'set-solid-color',
		color,
		'--screen',
		screen,
	];

	await execFile(binary, arguments_);
}

export async function screens() {
	const {stdout} = await execFile(binary, ['screens']);
	return stdout.trim().split('\n').map(line => line.replace(/^\d+ - /, ''));
}
