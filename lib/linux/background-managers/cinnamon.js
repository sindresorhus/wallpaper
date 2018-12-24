'use strict';

const {commandExists, execFile, grep} = require('../util');

exports.isAvailable = async () => {
	if (!await commandExists('gsettings')) {
		return false;
	}

	try {
		const {stdout} = await execFile('gsettings', ['list-schemas']);

		return grep(stdout, 'org.cinnamon.desktop.background');
	} catch (_) {}
};

exports.set = async function (imagePath) {
	await execFile('gsettings', [
		'set',
		'org.cinnamon.desktop.background',
		'picture-uri',
		`file://${imagePath}`
	]);
};

exports.get = async function () {
	try {
		const {stdout} = await execFile('gsettings', [
			'get',
			'org.cinnamon.desktop.background',
			'picture-uri'
		]);

		return stdout.trim().slice(8, -1);
	} catch (_) {}
};
