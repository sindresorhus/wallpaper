'use strict';

const {commandExists, execFile} = require('../util');

exports.isAvailable = function () {
	return commandExists('xfconf-query');
};

exports.set = async function (imagePath) {
	await execFile('xfconf-query', ['-c xfce4-desktop', '-p /backdrop/screen0/monitor0/image-path', '-s ' + imagePath]);
};
