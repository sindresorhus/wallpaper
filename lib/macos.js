'use strict';
const path = require('path');
const childProcess = require('child_process');
const pify = require('pify');

const execFile = pify(childProcess.execFile);

// Binary source → https://github.com/sindresorhus/macos-wallpaper
const bin = path.join(__dirname, 'macos-wallpaper');

exports.get = () => execFile(bin, ['get']).then(x => x.trim());

exports.set = (imagePath, opts) => {
	if (typeof imagePath !== 'string') {
		return Promise.reject(new TypeError('Expected a string'));
	}

	opts = opts || {};

	const args = ['set', path.resolve(imagePath)];

	if (opts.screen) {
		args.push('--screen', opts.screen);
	}

	if (opts.scale) {
		args.push('--scale', opts.scale);
	}

	return execFile(bin, args);
};
