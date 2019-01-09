'use strict';
const {commandExists, execFile, hasLine} = require('../util');

exports.isAvailable = async () => {
	if (!await commandExists('gsettings')) {
		return false;
	}

	try {
		const {stdout} = await execFile('gsettings', ['list-schemas']);
		return hasLine(stdout, 'org.cinnamon.desktop.background');
	} catch (_) {
		return false;
	}
};

exports.set = async imagePath => {
	await execFile('gsettings', [
		'set',
		'org.cinnamon.desktop.background',
		'picture-uri',
		`file://${imagePath}`
	]);
};

exports.get = async () => {
	const {stdout} = await execFile('gsettings', [
		'get',
		'org.cinnamon.desktop.background',
		'picture-uri'
	]);

	return stdout.trim().slice(8, -1);
};
