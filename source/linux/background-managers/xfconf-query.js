'use strict';
const {commandExists, execFile} = require('../util');

exports.isAvailable = () => commandExists('xfconf-query');

exports.set = async imagePath => {
	await execFile('xfconf-query', [
		'--channel',
		'xfce4-desktop',
		'--property',
		'/backdrop/screen0/monitor0/image-path',
		'--set',
		`${imagePath}`
	]);
};
