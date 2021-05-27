import path from 'path';
import test from 'ava';
import wallpaper from '.';

const MACOS_COLOR_PLACEHOLDER_PATH = '/System/Library/PreferencePanes/DesktopScreenEffectsPref.prefPane/Contents/Resources/DesktopPictures.prefPane/Contents/Resources/Transparent.tiff';

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

	test('.setSolidColor()', async t => {
		const originalImagePath = await wallpaper.get();

		await wallpaper.setSolidColor('000000');

		t.is(await wallpaper.get(), MACOS_COLOR_PLACEHOLDER_PATH);

		await wallpaper.set(originalImagePath);
	});
}
