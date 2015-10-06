'use strict';
var path = require('path');
var execFile = require('child_process').execFile;
var BIN = './osx-wallpaper';

exports.get = function (cb) {
	execFile(BIN, {cwd: __dirname}, function (err, stdout) {
		if (err) {
			cb(err);
			return;
		}

		cb(null, stdout.trim());
	});
};

exports.set = function (imagePath, cb) {
	if (typeof imagePath !== 'string') {
		throw new Error('imagePath required');
	}

	cb = cb || function () {};

	execFile(BIN, [path.resolve(imagePath)], {cwd: __dirname}, function (err) {
		cb(err);
	});
};
