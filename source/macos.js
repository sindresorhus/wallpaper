'use strict';
const {promisify} = require('util');
const path = require('path');
const childProcess = require('child_process');

const execFile = promisify(childProcess.execFile);

// Binary source → https://github.com/sindresorhus/macos-wallpaper
const binary = path.join(__dirname, 'macos-wallpaper');

exports.get = async ({screen = 'main'} = {}) => {
	let {stdout} = await execFile(binary, ['get', '--screen', screen]);
	stdout = stdout.trim();

	if (screen === 'all') {
		return stdout.split('\n');
	}

	return stdout;
};

exports.set = async (imagePath, {screen = 'all', scale = 'auto'} = {}) => {
	if (typeof imagePath !== 'string') {
		throw new TypeError('Expected a string');
	}

	const arguments_ = [
		'set',
		path.resolve(imagePath),
		'--screen',
		screen,
		'--scale',
		scale
	];

	await execFile(binary, arguments_);
};

exports.screens = async () => {
	const {stdout} = await execFile(binary, ['screens']);
	return stdout.trim().split('\n').map(line => line.replace(/^\d+ - /, ''));
};
