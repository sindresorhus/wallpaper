'use strict';

const childProcess = require('child_process');
const util = require('util');
const fs = require('fs');

const execFile = util.promisify(childProcess.execFile);

exports.commandExists = async cmd => {
	// `which` all commands and expect stdout to return a positive
	try {
		let {stdout} = await execFile('which', ['-a', cmd]);
		stdout = stdout.trim();

		if (!stdout) {
			return false;
		}

		return true;
	} catch (_) {
		return false;
	}
};

exports.hasLine = (string, lineToFind) => string.split('\n').find(line => line.trim() === lineToFind);

exports.execFile = execFile;
exports.exec = util.promisify(childProcess.exec);
exports.readFile = util.promisify(fs.readFile);
