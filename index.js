import process from 'node:process';
import * as macos from './source/macos.js';
import * as linux from './source/linux/index.js';
import * as windows from './source/windows.js';

let wallpaper;
if (process.platform === 'darwin') {
	wallpaper = macos;
} else if (process.platform === 'win32') {
	wallpaper = windows;
} else {
	wallpaper = linux;
}

export const {getWallpaper, setWallpaper, setSolidColorWallpaper, screens} = wallpaper;
