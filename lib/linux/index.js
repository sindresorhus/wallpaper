'use strict';

const path = require('path');
const {managers} = require('./background-managers');

let availableApps;

async function setAvailableApps() {
	availableApps = [];

	const promises = Object.keys(managers).map(async managerName => {
		const manager = managers[managerName];

		if (await manager.available()) {
			availableApps.push(manager);
		}
	});

	await Promise.all(promises);
}

exports.get = async function get() {
	if (!availableApps) {
		await setAvailableApps();
		return get();
	}

	const wallpapersVoted = {};
	const promises = availableApps.map(async app => {
		if (typeof app.get === 'function') {
			const imagePath = await app.get();

			if (typeof imagePath !== 'undefined') {
				if (!wallpapersVoted[imagePath]) {
					wallpapersVoted[imagePath] = 0;
				}

				wallpapersVoted[imagePath]++;
			}
		}
	});

	await Promise.all(promises);

	let wallpaperMostVoted;
	let wallpaperMostVotedCount;

	for (const wallpaper in wallpapersVoted) {
		if (!wallpaperMostVoted || wallpaperMostVoted[wallpaper] > wallpaperMostVotedCount) {
			wallpaperMostVoted = wallpaper;
			wallpaperMostVotedCount = wallpaperMostVoted[wallpaper];
		}
	}

	return wallpaperMostVoted;
};

exports.set = async function set(imagePath) {
	if (typeof imagePath !== 'string') {
		throw new TypeError('Expected a string');
	}

	if (!availableApps) {
		await setAvailableApps();
		await set(imagePath);
		return;
	}

	const promises = availableApps.map(async app => {
		if (typeof app.set === 'function') {
			try {
				await app.set(path.resolve(imagePath));
			} catch (error) {
				console.error(error);
			}
		}
	});

	await Promise.all(promises);
};
