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
	 * @returns The path of the current desktop wallpaper.
	 */
	get(options?: GetOptions): Promise<string>;

	/**
	 * Set a new wallpaper.
	 *
	 * @param imagePath - The path to the image to set as the desktop wallpaper.
	 */
	set(imagePath: string, options?: SetOptions): Promise<void>;

	/**
	 * **macOS only.**
	 *
	 * @returns The available screens.
	 *
	 * @example
	 *
	 * import wallpaper from 'wallpaper'l
	 *
	 * (async () => {
	 * 	await wallpaper.screens();
	 * 	//=> ['Color LCD']
	 * })();
	 */
	screens?(): Promise<string[]>;
};

export default wallpaper;
