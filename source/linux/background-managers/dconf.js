'use strict';
const {commandExists, execFile} = require('../util');

exports.isAvailable = () => commandExists('dconf');

exports.set = async imagePath => {
	await execFile('dconf', [
		'write',
		'/org/mate/desktop/background/picture-filename',
		`"${imagePath}"`
	]);
};

exports.get = async () => {
	const {stdout} = await execFile('dconf', [
		'read',
		'/org/mate/desktop/background/picture-filename'
	]);

	return stdout.trim().slice(1, -1);
};
