'use strict';
const util = require('util');
const path = require('path');
const childProcess = require('child_process');

const execFile = util.promisify(childProcess.execFile);

// Binary source → https://github.com/sindresorhus/macos-wallpaper
const bin = path.join(__dirname, 'macos-wallpaper');

exports.get = async () => {
	const {stdout} = await execFile(bin, ['get']);
	return stdout.trim();
};

exports.set = async (imagePath, options) => {
	if (typeof imagePath !== 'string') {
		throw new TypeError('Expected a string');
	}

	options = {
		screen: 'all',
		scale: 'auto',
		...options
	};

	const args = [
		'set',
		path.resolve(imagePath),
		'--screen',
		options.screen,
		'--scale',
		options.scale
	];

	await execFile(bin, args);
};

exports.screens = async () => {
	const {stdout} = await execFile(bin, ['screens']);
	return stdout.trim().split('\n').map(x => x.replace(/^\d+ - /, ''));
};
