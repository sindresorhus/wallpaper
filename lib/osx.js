'use strict';
const path = require('path');
const childProcess = require('child_process');
const pify = require('pify');
const execFile = pify(childProcess.execFile);
const bin = path.join(__dirname, 'osx-wallpaper');

exports.get = () => execFile(bin).then(x => x.trim());

exports.set = imagePath => {
	if (typeof imagePath !== 'string') {
		return Promise.reject(new TypeError('Expected a string'));
	}

	return execFile(bin, [path.resolve(imagePath)]);
};
