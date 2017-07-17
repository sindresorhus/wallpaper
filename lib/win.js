'use strict';
const path = require('path');
const childProcess = require('child_process');
const pify = require('pify');

const spawn = childProcess.spawn;
const execFile = pify(childProcess.execFile);

// Binary source → https://github.com/sindresorhus/win-wallpaper
const bin = path.join(__dirname, 'win-wallpaper.exe');

exports.get = () => execFile(bin).then(x => x.trim());

exports.set = imagePath => {
	if (typeof imagePath !== 'string') {
		return Promise.reject(new TypeError('Expected a string'));
	}

	return new Promise((resolve, reject) => {
		let proc = spawn(bin, [path.resolve(imagePath)], {
			detached: true,
			shell: false
		});

		let err = '';

		proc.stderr.on('data', data => {
			err += data;
		});

		proc.on('close', code => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error('Program terminated with code ' + code + ':\n' + err));
			}
		});
	});
};
