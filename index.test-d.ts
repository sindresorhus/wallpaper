import {expectType} from 'tsd-check';
import wallpaper from '.';

expectType<Promise<string>>(wallpaper.get());
expectType<Promise<string>>(wallpaper.get({screen: 'all'}));
expectType<Promise<string>>(wallpaper.get({screen: 'main'}));
expectType<Promise<string>>(wallpaper.get({screen: 0}));

expectType<Promise<void>>(wallpaper.set('unicorn.jpg'));
expectType<Promise<void>>(wallpaper.set('unicorn.jpg', {screen: 'all'}));
expectType<Promise<void>>(wallpaper.set('unicorn.jpg', {screen: 'main'}));
expectType<Promise<void>>(wallpaper.set('unicorn.jpg', {screen: 0}));
expectType<Promise<void>>(wallpaper.set('unicorn.jpg', {scale: 'auto'}));
expectType<Promise<void>>(wallpaper.set('unicorn.jpg', {scale: 'fill'}));
expectType<Promise<void>>(wallpaper.set('unicorn.jpg', {scale: 'fit'}));
expectType<Promise<void>>(wallpaper.set('unicorn.jpg', {scale: 'stretch'}));
expectType<Promise<void>>(wallpaper.set('unicorn.jpg', {scale: 'center'}));

if (wallpaper.screens) {
	expectType<Promise<string[]>>(wallpaper.screens());
}
