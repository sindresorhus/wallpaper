'use strict';

const {commandExists, execFile} = require('../util');

exports.isAvailable = function () {
	return commandExists('dconf');
};

exports.set = async function (imagePath) {
	await execFile('dconf', ['write', '/org/mate/desktop/background/picture-filename', `"${imagePath}"`]);
};

exports.get = async function () {
	try {
		const {stdout} = await execFile('dconf', ['read', '/org/mate/desktop/background/picture-filename']);

		return stdout.trim().slice(1, -1);
	} catch (_) {}
};
