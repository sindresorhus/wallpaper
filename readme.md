# wallpaper

> Get or set the desktop wallpaper

Works on macOS 10.14.4+, Linux, and Windows 10+.

*Maintainer needed for the Linux part of the code. No new Linux-related changes will be accepted until someone with good Linux knowledge volunteers.*

## Install

```sh
npm install wallpaper
```

## Usage

```js
import {getWallpaper, setWallpaper} from 'wallpaper';

await setWallpaper('unicorn.jpg');

await getWallpaper();
//=> '/Users/sindresorhus/unicorn.jpg'
```

## API

### getWallpaper(options?)

Returns a `Promise<string>` with the path of the current desktop wallpaper.

#### options

Type: `object`

##### screen *(macOS only)*

Type: `string | number`\
Values: `'all'`, `'main'`, or the index of a screen from `.screens()`\
Default: `'main'`

The screen to get the wallpaper from.

If you set `'all'` then `getWallpaper()` will return a `Promise<string[]>`.

### setWallpaper(imagePath, options?)

Returns a `Promise`.

#### imagePath

Type: `string`

The path to the image to set as the desktop wallpaper.

#### options

Type: `object`

##### screen *(macOS only)*

Type: `string | number`\
Values: `'all'`, `'main'`, or the index of a screen from `.screens()`
Default: `'all'`

The screen to set the wallpaper on.

*On Linux and Windows it's hard-coded to `'main'`.*

##### scale *(macOS & Windows)*

Type: `string`\
macOS Values: `'auto' | 'fill' | 'fit' | 'stretch' | 'center'`\
Windows Values: `'center' | 'stretch' | 'tile' | 'span' | 'fit' | 'fill'`\
Default macOS: `'auto'`\
Default Windows: `'span'`

Scaling method.

### setSolidColorWallpaper(color, options?) *(macOS only)*

Returns a `Promise`.

#### color

Type: `string`

The color to set as a RGB Hex value. For example, `000000` for black.

#### options

Type: `object`

##### screen

Type: `string | number`\
Values: `'all'`, `'main'`, or the index of a screen from `.screens()`
Default: `'all'`

The screen to set the wallpaper on.

```js
import {setSolidColorWallpaper} from 'wallpaper';

await setSolidColorWallpaper('000000');
```

### screens() *(macOS only)*

Returns a `Promise<string[]>` with the available screens.

```js
import {screens} from 'wallpaper';

await screens();
//=> ['Color LCD']
```

## FAQ

#### How can I set a website as a static wallpaper?

If you only need a static snapshot of the website, you can use [`capture-website`](https://github.com/sindresorhus/capture-website) and then pass the result to this package. You can make it semi-dynamic, by capturing the website snapshot every 10 seconds, for example.

#### How can I set a website, video, or WebGL as a dynamic wallpaper?

You cannot use this package to set a dynamic wallpaper.

On macOS, check out [Plash](https://github.com/sindresorhus/Plash), which lets you set any website as your wallpaper. The website could contain a fullscreen video, WebGL, slideshow, animated, etc.

You can also do this with Electron on macOS and Linux by using [`new BrowserWindow({type: 'desktop'})`](https://www.electronjs.org/docs/latest/api/browser-window#new-browserwindowoptions).

On Windows, you can use [Wallpaper Engine](https://wallpaperengine.io). It's available on Steam, HumbleBundle, and Green Man Gaming for around 4 USD.

## Related

- [wallpaper-cli](https://github.com/sindresorhus/wallpaper-cli) - CLI for this module
- [macos-wallpaper](https://github.com/sindresorhus/macos-wallpaper) - macOS binary used in this module
- [win-wallpaper](https://github.com/sindresorhus/win-wallpaper) - Windows binary used in this module
- [trash](https://github.com/sindresorhus/trash) - Move files and directories to the trash
