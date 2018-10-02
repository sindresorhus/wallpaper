'use strict';

const childProcess = require('child_process');
const util = require('util');
const {existCommand} = require('../util');

const execFile = util.promisify(childProcess.execFile);
const exec = util.promisify(childProcess.exec);

exports.available = async function () {
	if (!await existCommand('gsettings')) {
		return false;
	}

	try {
		const {stdout} = await exec('gsettings list-schemas | grep org.cinnamon.desktop.background');
		return stdout.trim() === 'org.cinnamon.desktop.background';
	} catch (_) {}
};

exports.set = async function (imagePath) {
	await execFile('gsettings', [
		'set',
		'org.cinnamon.desktop.background',
		'picture-uri',
		'file://' + imagePath
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
