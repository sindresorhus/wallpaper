'use strict';

const {commandExists, execFile} = require('../util');

exports.isAvailable = function () {
	return commandExists('feh');
};

exports.set = async function (imagePath) {
	await execFile('feh', ['--bg-fill', imagePath]);
};
