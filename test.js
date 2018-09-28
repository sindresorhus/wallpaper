import path from 'path';
import test from 'ava';
import wallpaper from '.';

test('main', async t => {
	const orignalImagePath = await wallpaper.get();

	await wallpaper.set('fixture.jpg');
	t.is(await wallpaper.get(), path.resolve('fixture.jpg'));

	await wallpaper.set(orignalImagePath);
});
