'use strict';
const path = require('path');
const os = require('os');
const {commandExists, execFile, readFile} = require('../util');

const homeDir = os.homedir();

exports.isAvailable = () => commandExists('nitrogen');

exports.set = async imagePath => {
	await execFile('nitrogen', [
		'--set-zoom-fill',
		'--save',
		imagePath
	]);
};

exports.get = async () => {
	const configFile = path.join(homeDir, '.config/nitrogen/bg-saved.cfg');
	const config = await readFile(configFile, 'utf8');

	return config.trim().split('\n').find(line => line.startsWith('file=')).replace('file=', '');
};
