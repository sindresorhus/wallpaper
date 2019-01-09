'use strict';
const {commandExists, execFile} = require('../util');

exports.isAvailable = () => commandExists('gsettings');

exports.set = async imagePath => {
	await execFile('gsettings', [
		'set',
		'org.gnome.desktop.background',
		'picture-uri',
		`file://${imagePath}`
	]);
};

exports.get = async () => {
	const {stdout} = await execFile('gsettings', [
		'get',
		'org.gnome.desktop.background',
		'picture-uri'
	]);

	return stdout.trim().slice(8, -1);
};
