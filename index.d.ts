export interface GetOptions {
	/**
	 * **macOS only.**
	 *
	 * The screen to get the wallpaper from. Values: `all` `main` or the index of a screen from `.screens()`.
	 *
	 * @default 'main'
	 */
	readonly screen?: 'all' | 'main' | number;
}

export interface SetOptions {
	/**
	 * **macOS only.**
	 *
	 * The screen to set the wallpaper on. Values: `all` `main` or the index of a screen from `.screens()`.
	 *
	 * *On Linux and Windows it's hard-coded to `main`.*
	 *
	 * @default 'all'
	 */
	readonly screen?: 'all' | 'main' | number;

	/**
	 * **macOS only.**
	 *
	 * Scaling method. Values: `auto` `fill` `fit` `stretch` `center`.
	 *
	 * @default 'auto'
	 */
	readonly scale?: 'auto' | 'fill' | 'fit' | 'stretch' | 'center';
}

declare const wallpaper: {
	/**
	 * Get the path to the wallpaper image currently set.
	 *
	 * @returns A promise for the path of the current desktop wallpaper.
	 */
	get(options?: GetOptions): Promise<string>;

	/**
	 * Set a new wallpaper.
	 *
	 * @param imagePath - Path to the image to set as the desktop wallpaper.
	 */
	set(imagePath: string, options?: SetOptions): Promise<void>;

	/**
	 * **macOS only.**
	 *
	 * @returns A promise for an array of screens.
	 *
	 * @example
	 *
	 * (async () => {
	 * 	await wallpaper.screens();
	 * 	//=> ['Color LCD']
	 * })();
	 */
	screens?(): Promise<string[]>;
};

export default wallpaper;
