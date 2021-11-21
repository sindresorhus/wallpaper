import process from 'node:process';
import path from 'node:path';
import test from 'ava';
import {getWallpaper, setWallpaper, setSolidColorWallpaper, screens} from './index.js';

const MACOS_COLOR_PLACEHOLDER_PATH = '/System/Library/PreferencePanes/DesktopScreenEffectsPref.prefPane/Contents/Resources/DesktopPictures.prefPane/Contents/Resources/Transparent.tiff';

test('main', async t => {
	const orignalImagePath = await getWallpaper();

	await setWallpaper('fixture.jpg');
	t.is(await getWallpaper(), path.resolve('fixture.jpg'));

	await setWallpaper(orignalImagePath);
});

if (process.platform === 'darwin') {
	test('screens()', async t => {
		const screens_ = await screens();
		console.log('Screens:', screens_);
		t.true(Array.isArray(screens_));
		t.true(screens_[0].length > 4);
	});

	test('setSolidColorWallpaper()', async t => {
		const originalImagePath = await getWallpaper();

		await setSolidColorWallpaper('000000');

		t.is(await getWallpaper(), MACOS_COLOR_PLACEHOLDER_PATH);

		await setWallpaper(originalImagePath);
	});
}
