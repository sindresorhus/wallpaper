'use strict';
const {commandExists, execFile} = require('../util');

exports.isAvailable = () => commandExists('gconftool-2');

exports.set = async imagePath => {
	await execFile('gconftool-2', [
		'--set',
		'/desktop/gnome/background/picture_filename',
		'--type',
		'string',
		imagePath
	]);
};
