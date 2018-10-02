'use strict';

const childProcess = require('child_process');
const util = require('util');
const {existCommand} = require('../util');

const execFile = util.promisify(childProcess.execFile);

exports.available = function () {
	return existCommand('setroot');
};

exports.set = async function (imagePath) {
	await execFile('setroot', [imagePath]);
};
