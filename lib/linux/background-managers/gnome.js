'use strict';

const {commandExists, execFile} = require('../util');

exports.isAvailable = function () {
	return commandExists('gsettings');
};

exports.set = async function (imagePath) {
	await execFile('gsettings', [
		'set',
		'org.gnome.desktop.background',
		'picture-uri',
		'file://' + imagePath
	]);
};

exports.get = async function () {
	try {
		const {stdout} = await execFile('gsettings', [
			'get',
			'org.gnome.desktop.background',
			'picture-uri'
		]);

		return stdout.trim().slice(8, -1);
	} catch (_) {}
};
