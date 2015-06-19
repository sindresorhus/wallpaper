#!/usr/bin/env node
'use strict';
var meow = require('meow');
var wallpaper = require('./');

var cli = meow({
	help: [
		'Usage',
		'  $ wallpaper [file]',
		'',
		'Example',
		'  $ wallpaper unicorn.jpg',
		'  $ wallpaper',
		'  /Users/sindresorhus/unicorn.jpg'
	]
}, {
	string: ['_']
});

var inputPath = cli.input[0];

if (inputPath) {
	wallpaper.set(inputPath, function (err) {
		if (err) {
			console.error(err.message);
			process.exit(1);
		}
	});
} else {
	wallpaper.get(function (err, imagePath) {
		if (err) {
			console.error(err.message);
			process.exit(1);
		}

		console.log(imagePath);
	});
}
