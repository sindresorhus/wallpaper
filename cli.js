#!/usr/bin/env node
'use strict';
var meow = require('meow');
var wallpaper = require('./');
var lockscreen = require('linux-lockscreen');

var cli = meow({
	help: [
		'Usage',
		'  $ wallpaper [file] [--lock]',
		'',
		'Flags:',
		'  "lock" -- Manipulate lockscreen instead of wallpaper',
		'',
		'Example',
		'  $ wallpaper unicorn.jpg',
		'  $ wallpaper',
		'  /Users/sindresorhus/unicorn.jpg',
		'  $ wallpaper --lock',
		'  /Users/sindresorhus/pegasus.jpg'
	].join('\n')
}, {
	string: ['_']
});

// Override wallpaper using lockscreen if the flag is present
// A hack but quick and clean
if(cli.flags.hasOwnProperty("lock")){
	wallpaper = lockscreen;
}

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
