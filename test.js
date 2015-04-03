'use strict';
var path = require('path');
var test = require('ava');
var wallpaper = require('./');

test(function (t) {
	t.plan(4);

	var orignalImagePath;

	wallpaper.get(function (err, imagePath) {
		orignalImagePath = imagePath;

		wallpaper.set('fixture.jpg', function (err) {
			t.assert(!err, err);

			wallpaper.get(function (err, imagePath) {
				t.assert(!err, err);
				t.assert(imagePath === path.resolve('fixture.jpg'));

				wallpaper.set(orignalImagePath, function (err) {
					t.assert(!err, err);
				});
			});
		});
	});
});
