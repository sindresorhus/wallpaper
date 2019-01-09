'use strict';
const path = require('path');
const managers = require('./background-managers');

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

exports.get = async () => {
	if (!availableApps) {
		await setAvailableApps();
		return exports.get();
	}

	const wallpapersVoted = new Map();
	const promises = availableApps.map(async app => {
		if (typeof app.get !== 'function') {
			return;
		}

		const imagePath = await app.get();

		if (typeof imagePath !== 'undefined') {
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
};

exports.set = async imagePath => {
	if (typeof imagePath !== 'string') {
		throw new TypeError('Expected a string');
	}

	if (!availableApps) {
		await setAvailableApps();
		await exports.set(imagePath);
		return;
	}

	const promises = availableApps.map(async app => {
		if (typeof app.set === 'function') {
			await app.set(path.resolve(imagePath));
		}
	});

	await Promise.all(promises.map(promise => promise.catch(() => {})));
};
