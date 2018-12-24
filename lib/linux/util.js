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

exports.grep = (stdout, stringToFind) => {
	let found = false;

	for (const line in stdout.split('\n')) {
		if (line.trim() === stringToFind) {
			found = true;
			break;
		}
	}

	return found;
};

exports.execFile = execFile;
exports.exec = util.promisify(childProcess.exec);
exports.readFile = util.promisify(fs.readFile);
