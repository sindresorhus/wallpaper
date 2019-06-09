'use strict';
const {promisify} = require('util');
const path = require('path');
const childProcess = require('child_process');

const execFile = promisify(childProcess.execFile);

// Binary source → https://github.com/sindresorhus/macos-wallpaper
const binary = path.join(__dirname, 'macos-wallpaper');

exports.get = async () => {
	const {stdout} = await execFile(binary, ['get']);
	return stdout.trim().match('\n') ? stdout.trim().split('\n') : stdout.trim();
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

	const arguments_ = [
		'set',
		path.resolve(imagePath),
		'--screen',
		options.screen,
		'--scale',
		options.scale
	];

	await execFile(binary, arguments_);
};

exports.screens = async () => {
	const {stdout} = await execFile(binary, ['screens']);
	return stdout.trim().split('\n').map(line => line.replace(/^\d+ - /, ''));
};
