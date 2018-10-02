'use strict';

const childProcess = require('child_process');
const util = require('util');
const {existCommand} = require('../util');

const execFile = util.promisify(childProcess.execFile);

exports.available = function () {
	return existCommand('xfconf-query');
};

exports.set = async function (imagePath) {
	await execFile('xfconf-query', ['-c xfce4-desktop', '-p /backdrop/screen0/monitor0/image-path', '-s ' + imagePath]);
};
