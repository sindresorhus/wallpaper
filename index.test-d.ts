import {expectType} from 'tsd';
import {getWallpaper, setWallpaper, screens} from './index.js';

expectType<Promise<string>>(getWallpaper());
expectType<Promise<string>>(getWallpaper({screen: 'all'}));
expectType<Promise<string>>(getWallpaper({screen: 'main'}));
expectType<Promise<string>>(getWallpaper({screen: 0}));

expectType<Promise<void>>(setWallpaper('unicorn.jpg'));
expectType<Promise<void>>(setWallpaper('unicorn.jpg', {screen: 'all'}));
expectType<Promise<void>>(setWallpaper('unicorn.jpg', {screen: 'main'}));
expectType<Promise<void>>(setWallpaper('unicorn.jpg', {screen: 0}));
expectType<Promise<void>>(setWallpaper('unicorn.jpg', {scale: 'auto'}));
expectType<Promise<void>>(setWallpaper('unicorn.jpg', {scale: 'fill'}));
expectType<Promise<void>>(setWallpaper('unicorn.jpg', {scale: 'fit'}));
expectType<Promise<void>>(setWallpaper('unicorn.jpg', {scale: 'stretch'}));
expectType<Promise<void>>(setWallpaper('unicorn.jpg', {scale: 'center'}));

if (screens) {
	expectType<Promise<string[]>>(screens());
}
