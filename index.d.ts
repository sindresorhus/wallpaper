declare namespace wallpaper {
	interface GetOptions {
		/**
		__macOS only.__

		The screen to get the wallpaper from.

		Values: `all`, `main`, or the index of a screen from `.screens()`.

		@default 'main'
		*/
		readonly screen?: 'all' | 'main' | number;
	}

	interface SetOptions {
		/**
		__macOS only.__

		The screen to set the wallpaper on.

		Values: `all`, `main`, or the index of a screen from `.screens()`.

		*On Linux and Windows it's hard-coded to `main`.*

		@default 'all'
		*/
		readonly screen?: 'all' | 'main' | number;

		/**
		__macOS only.__

		Scaling method. Values: `auto` `fill` `fit` `stretch` `center`.

		@default 'auto'
		*/
		readonly scale?: 'auto' | 'fill' | 'fit' | 'stretch' | 'center';
	}
}

declare const wallpaper: {
	/**
	Get the path to the wallpaper image currently set.

	@returns The path of the current desktop wallpaper.

	@example
	```
	import wallpaper = require('wallpaper');

	(async () => {
		await wallpaper.get();
		//=> '/Users/sindresorhus/unicorn.jpg'
	})();
	```
	*/
	get(options?: wallpaper.GetOptions): Promise<string>;

	/**
	Set a new wallpaper.

	@param imagePath - The path to the image to set as the desktop wallpaper.

	@example
	```
	import wallpaper = require('wallpaper');

	(async () => {
		await wallpaper.set('unicorn.jpg');
	})();
	```
	*/
	set(imagePath: string, options?: wallpaper.SetOptions): Promise<void>;

	/**
	__macOS only.__

	@returns The available screens.

	@example
	```
	import wallpaper from 'wallpaper';

	(async () => {
		await wallpaper.screens();
		//=> ['Color LCD']
	})();
	```
	*/
	screens?(): Promise<string[]>;

	// TODO: remove this in the next major version
	// when removed, each of the methods in this interface can be refactored to an explicit function export
	// and `wallpaper` namespace may be removed completely along with the `export = wallpaper` export.
	default: typeof wallpaper;
};

export = wallpaper;
