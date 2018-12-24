'use strict';

const {commandExists, execFile} = require('../util');

exports.isAvailable = function () {
	return commandExists('setroot');
};

exports.set = async function (imagePath) {
	await execFile('setroot', [imagePath]);
};
