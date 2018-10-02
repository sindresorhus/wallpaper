'use strict';

const childProcess = require('child_process');
const util = require('util');
const {existCommand} = require('../util');

const execFile = util.promisify(childProcess.execFile);

exports.available = function () {
	return existCommand('dconf');
};

exports.set = async function (imagePath) {
	await execFile('dconf', ['write', '/org/mate/desktop/background/picture-filename', '"' + imagePath + '"']);
};

exports.get = async function () {
	try {
		const {stdout} = await execFile('dconf', ['read', '/org/mate/desktop/background/picture-filename']);

		return stdout.trim().slice(1, -1);
	} catch (_) {}
};
