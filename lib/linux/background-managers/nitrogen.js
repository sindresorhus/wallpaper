'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const homeDir = require('os').homedir();
const path = require('path');
const util = require('util');
const {existCommand} = require('../util');

const execFile = util.promisify(childProcess.execFile);
const readFile = util.promisify(fs.readFile);

exports.available = function () {
	return existCommand('nitrogen');
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
