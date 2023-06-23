import path from 'node:path';
import * as managers from './background-managers/index.js';

let availableApps;

async function setAvailableApps() {
	availableApps = [];

	const promises = Object.values(managers).map(async manager => {
		if (await manager.isAvailable()) {
			availableApps.push(manager);
		}
	});

	await Promise.all(promises);
}

export async function getWallpaper() {
	if (!availableApps) {
		await setAvailableApps();
		return getWallpaper();
	}

	const wallpapersVoted = new Map();
	const promises = availableApps.map(async app => {
		if (typeof app.get !== 'function') {
			return;
		}

		const imagePath = await app.get();

		if (imagePath !== undefined) {
			if (!wallpapersVoted.get(imagePath)) {
				wallpapersVoted.set(imagePath, 0);
			}

			wallpapersVoted.set(imagePath, wallpapersVoted.get(imagePath) + 1);
		}
	});

	await Promise.all(promises.map(promise => promise.catch(() => {})));

	let wallpaperMostVoted;
	let wallpaperMostVotedCount;

	for (const [wallpaper] of wallpapersVoted) {
		if (!wallpaperMostVoted || wallpaperMostVoted[wallpaper] > wallpaperMostVotedCount) {
			wallpaperMostVoted = wallpaper;
			wallpaperMostVotedCount = wallpaperMostVoted[wallpaper];
		}
	}

	return wallpaperMostVoted;
}

export async function setWallpaper(imagePath) {
	if (typeof imagePath !== 'string') {
		throw new TypeError('Expected a string');
	}

	if (!availableApps) {
		await setAvailableApps();
		await setWallpaper(imagePath);
		return;
	}

	const promises = availableApps.map(async app => {
		if (typeof app.set === 'function') {
			await app.set(path.resolve(imagePath));
		}
	});

	await Promise.allSettled(promises);
}
