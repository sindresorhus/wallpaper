# wallpaper [![Build Status](https://travis-ci.org/sindresorhus/wallpaper.svg?branch=master)](https://travis-ci.org/sindresorhus/wallpaper) [![Build status](https://ci.appveyor.com/api/projects/status/xhwaihmhhplh5d05/branch/master?svg=true)](https://ci.appveyor.com/project/sindresorhus/wallpaper/branch/master)

> Get or set the desktop wallpaper

Works on macOS, Linux, and Windows.

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

### .get([options])

Returns a promise for the path of the current desktop wallpaper.

#### options

Type: `Object`

##### screen *(macOS only)*

Type: `string` `number`<br>
Values: `all` `main` or the index of a screen from `.screens()`
Default: `main`

The screen to get the wallpaper from.

### .set(imagePath, [options])

Returns a promise.

#### imagePath

Type: `string`

Path to the image to set as the desktop wallpaper.

#### options

Type: `Object`

##### screen *(macOS only)*

Type: `string` `number`<br>
Values: `all` `main` or the index of a screen from `.screens()`
Default: `all`

The screen to set the wallpaper on.

*On Linux and Windows it's hard-coded to `main`.*

##### scale *(macOS only)*

Type: `string`<br>
Values: `auto` `fill` `fit` `stretch` `center`<br>
Default: `auto`

Scaling method.

### .screens() *(macOS only)*

Returns a promise for an array of screens.

```js
(async () => {
	await wallpaper.screens();
	//=> ['Color LCD']
})();
```


## Related

- [wallpaper-cli](https://github.com/sindresorhus/wallpaper-cli) - CLI for this module
- [macos-wallpaper](https://github.com/sindresorhus/macos-wallpaper) - macOS binary used in this module
- [win-wallpaper](https://github.com/sindresorhus/win-wallpaper) - Windows binary used in this module
- [trash](https://github.com/sindresorhus/trash) - Move files and directories to the trash


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
