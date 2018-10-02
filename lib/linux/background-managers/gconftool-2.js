'use strict';

const childProcess = require('child_process');
const util = require('util');
const {existCommand} = require('../util');

const execFile = util.promisify(childProcess.execFile);

exports.available = function () {
	return existCommand('gconftool-2');
};

exports.set = async function (imagePath) {
	await execFile('gconftool-2', ['--set', '/desktop/gnome/background/picture_filename', '--type=string', imagePath]);
};
