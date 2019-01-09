'use strict';
const {commandExists, execFile} = require('../util');

exports.isAvailable = () => commandExists('pcmanfm');

exports.set = async imagePath => {
	await execFile('pcmanfm', ['--set-wallpaper', imagePath]);
};
