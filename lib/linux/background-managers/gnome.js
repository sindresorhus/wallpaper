'use strict';

const childProcess = require('child_process');
const util = require('util');
const {existCommand} = require('../util');

const execFile = util.promisify(childProcess.execFile);

exports.available = function () {
	return existCommand('gsettings');
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
