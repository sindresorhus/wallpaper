'use strict';
const path = require('path');
const childProcess = require('child_process');
const pify = require('pify');

const execFile = pify(childProcess.execFile);

const bin = 'osascript';

exports.get = () => execFile(bin).then(x => x.trim());

exports.set = (imagePath) => {
	if (typeof imagePath !== 'string') {
		return Promise.reject(new TypeError('Expected a string'));
	}

	scriptstart = `tell application "System Events"
		tell every desktop
	set picture to "`;

	scriptend = `"
		end tell
	end tell`;

	script = scriptstart + path.resolve(imagePath) + scriptend;

	return execFile(bin, ['-e', script]);
};
