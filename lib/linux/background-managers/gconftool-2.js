'use strict';

const {commandExists, execFile} = require('../util');

exports.isAvailable = function () {
	return commandExists('gconftool-2');
};

exports.set = async function (imagePath) {
	await execFile('gconftool-2', ['--set', '/desktop/gnome/background/picture_filename', '--type=string', imagePath]);
};
