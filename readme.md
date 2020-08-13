# wallpaper [![Build Status](https://travis-ci.org/sindresorhus/wallpaper.svg?branch=master)](https://travis-ci.org/sindresorhus/wallpaper) [![Build status](https://ci.appveyor.com/api/projects/status/xhwaihmhhplh5d05/branch/master?svg=true)](https://ci.appveyor.com/project/sindresorhus/wallpaper/branch/master)

> Get or set the desktop wallpaper

Works on macOS 10.12+, Linux, and Windows 10+.

*Maintainer needed for the Linux part of the code. No new Linux-related changes will be accepted until someone with good Linux knowledge volunteers.*

## Install

```
$ npm install wallpaper
```

## Usage

```js
const wallpaper = require('wallpaper');

(async () => {
	await wallpaper.set('unicorn.jpg');

	await wallpaper.get();
	//=> '/Users/sindresorhus/unicorn.jpg'
})();
```

## API

### .get(options?)

Returns a `Promise<string>` with the path of the current desktop wallpaper.

#### options

Type: `object`

##### screen *(macOS only)*

Type: `string | number`\
Values: `'all'`, `'main'`, or the index of a screen from `.screens()`\
Default: `'main'`

The screen to get the wallpaper from.

If you set `'all'` then `.get()` will return a `Promise<string[]>`.

### .set(imagePath, options?)

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

##### scale *(macOS only)*

Type: `string`\
Values: `'auto' | 'fill' | 'fit' | 'stretch' | 'center'`\
Default: `'auto'`

Scaling method.

### .screens() *(macOS only)*

Returns a `Promise<string[]>` with the available screens.

```js
(async () => {
	await wallpaper.screens();
	//=> ['Color LCD']
})();
```

## FAQ

#### How can I set a website as a static wallpaper?

If you only need a static snapshot of the website, you can use [`capture-website`](https://github.com/sindresorhus/capture-website) and then pass the result to this package. You can make it semi-dynamic, by capturing the website snapshot every 10 seconds, for example.

#### How can I set a website, video, or WebGL as a dynamic wallpaper?

You cannot use this package to set a dynamic wallpaper.

On macOS, check out [Plash](https://github.com/sindresorhus/Plash), which lets you set any website as your wallpaper. The website could contain a fullscreen video, WebGL, slideshow, animated, etc.

You can also do this with Electron on macOS and Linux by using [`new BrowserWindow({type: 'desktop'})`](https://electronjs.org/docs/api/browser-window#new-browserwindowoptions).

On Windows, you can use [Wallpaper Engine](https://wallpaperengine.io). It's available on Steam, HumbleBundle, and Green Man Gaming for around 4 USD.

## Related

- [wallpaper-cli](https://github.com/sindresorhus/wallpaper-cli) - CLI for this module
- [macos-wallpaper](https://github.com/sindresorhus/macos-wallpaper) - macOS binary used in this module
- [win-wallpaper](https://github.com/sindresorhus/win-wallpaper) - Windows binary used in this module
- [trash](https://github.com/sindresorhus/trash) - Move files and directories to the trash
