'use strict';
const {commandExists, execFile} = require('../util.js');

exports.isAvailable = () => commandExists('feh');

exports.set = async imagePath => {
	await execFile('feh', ['--bg-fill', imagePath]);
};
