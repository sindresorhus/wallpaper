'use strict';

const {commandExists, execFile} = require('../util');

exports.isAvailable = function () {
	return commandExists('pcmanfm');
};

exports.set = async function (imagePath) {
	await execFile('pcmanfm', ['-w ' + imagePath]);
};
