import path from 'path';
import test from 'ava';
import wallpaper from './';

test(t => {
	t.plan(4);

	let orignalImagePath;

	wallpaper.get((err, imagePath) => {
		t.ifError(err);

		orignalImagePath = imagePath;

		wallpaper.set('fixture.jpg', err => {
			t.ifError(err);

			wallpaper.get((err, imagePath) => {
				t.ifError(err);
				t.is(imagePath, path.resolve('fixture.jpg'));

				wallpaper.set(orignalImagePath, err => {
					t.ifError(err);
				});
			});
		});
	});
});
