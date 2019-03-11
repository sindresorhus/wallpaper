'use strict';
const {promisify} = require('util');
const childProcess = require('child_process');
const fs = require('fs');

const execFile = promisify(childProcess.execFile);

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
exports.exec = promisify(childProcess.exec);
exports.readFile = promisify(fs.readFile);
