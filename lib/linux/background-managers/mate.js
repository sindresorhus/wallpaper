'use strict';

const {commandExists, execFile, grep} = require('../util');

exports.isAvailable = async function () {
	if (!await commandExists('gsettings')) {
		return false;
	}

	try {
		const {stdout} = await execFile('gsettings', ['list-schemas']);
		return grep(stdout, 'org.mate.background');
	} catch (_) {}
};

exports.set = async function (imagePath) {
	await execFile('gsettings', [
		'set',
		'org.mate.background',
		'picture-filename',
		'file://' + imagePath
	]);
};

exports.get = async function () {
	try {
		const {stdout} = await execFile('gsettings', [
			'get',
			'org.mate.background',
			'picture-filename'
		]);

		return stdout.trim().slice(8, -1);
	} catch (_) {}
};
