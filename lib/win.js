'use strict';
const path = require('path');
const childProcess = require('child_process');
const pify = require('pify');

const execFile = pify(childProcess.execFile);

// Binary source → https://github.com/sindresorhus/win-wallpaper
const bin = path.join(__dirname, 'win-wallpaper.exe');

exports.get = () => execFile(bin).then(x => x.trim());

exports.set = imagePath => {
	if (typeof imagePath !== 'string') {
		return Promise.reject(new TypeError('Expected a string'));
	}

	return execFile(bin, [path.resolve(imagePath)]);
};
