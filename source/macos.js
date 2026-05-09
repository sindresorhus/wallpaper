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

async function shouldPrimeSamePathRefresh(imagePath, screen) {
	const stats = await fs.stat(imagePath).catch(() => undefined);

	if (!stats) {
		return false;
	}

	if (!stats.isFile()) {
		return false;
	}

	const currentWallpaper = await getWallpaper({screen});
	const currentWallpapers = Array.isArray(currentWallpaper) ? currentWallpaper : [currentWallpaper];

	return currentWallpapers.some(wallpaperPath => path.resolve(wallpaperPath) === imagePath);
}

async function withTemporaryWallpaperCopy(imagePath, run) {
	const temporaryPath = path.join(os.tmpdir(), `wallpaper-${randomUUID()}-${path.basename(imagePath)}`);

	await fs.copyFile(imagePath, temporaryPath);

	try {
		await run(temporaryPath);
	} finally {
		await fs.rm(temporaryPath, {force: true});
	}
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

	const resolvedImagePath = path.resolve(imagePath);

	const arguments_ = [
		'set',
		resolvedImagePath,
		'--screen',
		screen,
		'--scale',
		scale,
	];

	if (await shouldPrimeSamePathRefresh(resolvedImagePath, screen)) {
		await withTemporaryWallpaperCopy(resolvedImagePath, async temporaryPath => {
			await execFile(binary, [
				'set',
				temporaryPath,
				'--screen',
				screen,
				'--scale',
				scale,
			]);
			await execFile(binary, arguments_);
		});

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
