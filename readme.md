# wallpaper [![Build Status](https://travis-ci.org/sindresorhus/wallpaper.svg?branch=master)](https://travis-ci.org/sindresorhus/wallpaper)

> Get or set the desktop wallpaper

Works on OS X, Linux and Windows.


## CLI

### Install

```
$ npm install --global wallpaper
```

### Usage

```
$ wallpaper --help

  Usage
    $ wallpaper [file]

  Example
    $ wallpaper unicorn.jpg
    $ wallpaper
    /Users/sindresorhus/unicorn.jpg
```


## Programmatic

### Install

```
$ npm install --save wallpaper
```

### Usage

```js
var wallpaper = require('wallpaper');

wallpaper.set('unicorn.jpg', function (err) {
	console.log('done');
});

wallpaper.get(function (err, imagePath) {
	console.log(imagePath);
	//=> '/Users/sindresorhus/unicorn.jpg'
});
```

### API

#### .get(callback)

##### callback(error, imagePath)

*Required*  
Type: `function`

###### imagePath

Type: `string`

Path to the current desktop wallpaper image.

#### .set(imagePath, [callback])

###### imagePath

*Required*  
Type: `string`

Path to the image to set as the desktop wallpaper.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
