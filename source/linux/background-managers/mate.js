'use strict';
const {commandExists, execFile, hasLine} = require('../util');

exports.isAvailable = async () => {
	if (!await commandExists('gsettings')) {
		return false;
	}

	try {
		const {stdout} = await execFile('gsettings', ['list-schemas']);
		return hasLine(stdout, 'org.mate.background');
	} catch (_) {
		return false;
	}
};

exports.set = async imagePath => {
	await execFile('gsettings', [
		'set',
		'org.mate.background',
		'picture-filename',
		imagePath
	]);
};

exports.get = async () => {
	const {stdout} = await execFile('gsettings', [
		'get',
		'org.mate.background',
		'picture-filename'
	]);

	return stdout.trim().slice(1, -1);
};
