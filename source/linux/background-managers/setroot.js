'use strict';
const {commandExists, execFile} = require('../util');

exports.isAvailable = () => commandExists('setroot');

exports.set = async imagePath => {
	await execFile('setroot', [imagePath]);
};
