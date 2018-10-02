'use strict';

const childProcess = require('child_process');
const util = require('util');

const exec = util.promisify(childProcess.exec);

exports.existCommand = async function (cmd) {
	// `which` all commands and expect stdout to return a positive
	const whichCmd = `which -a ${cmd}`;

	try {
		let {stdout} = await exec(whichCmd);
		stdout = stdout.trim();

		if (!stdout) {
			return false;
		}

		return true;
	} catch (_) {
		return false;
	}
};
