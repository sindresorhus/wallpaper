import path from 'path';
import test from 'ava';
import wallpaper from '.';

test('main', async t => {
	const orignalImagePath = await wallpaper.get();

	await wallpaper.set('fixture.jpg');
	t.is(await wallpaper.get(), path.resolve('fixture.jpg'));

	await wallpaper.set(orignalImagePath);
});

if (process.platform === 'darwin') {
	test('.screens()', async t => {
		const screens = await wallpaper.screens();
		console.log('Screens:', screens);
		t.true(Array.isArray(screens));
		t.true(screens[0].length > 4);
	});
}
