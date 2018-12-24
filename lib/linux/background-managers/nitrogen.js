'use strict';

const homeDir = require('os').homedir();
const path = require('path');
const {commandExists, execFile, readFile} = require('../util');

exports.isAvailable = function () {
	return commandExists('nitrogen');
};

exports.set = async function (imagePath) {
	try {
		await execFile('nitrogen', ['--set-zoom-fill', '--save', imagePath]);
	} catch (_) {}
};

exports.get = async function () {
	try {
		const configFile = path.join(homeDir, '.config/nitrogen/bg-saved.cfg');
		const config = await readFile(configFile, 'utf8');

		return config.trim().split('\n').find(line => line.startsWith('file=')).replace('file=', '');
	} catch (_) {}
};
