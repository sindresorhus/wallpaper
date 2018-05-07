'use strict';
const path = require('path');
const homeDir = require('os').homedir();
const childProcess = require('child_process');
const fileSystem = require('fs');
const pify = require('pify');

const cp = pify(childProcess);
const fs = pify(fileSystem);

const appsList = [
	{
		cmd: 'gsettings',
		set: [
			'set',
			'org.gnome.desktop.background',
			'picture-uri',
			'file://%s'
		],
		get: [
			'get',
			'org.gnome.desktop.background',
			'picture-uri'
		],
		transform: imagePath => imagePath.slice(8, -1)
	},
	{
		cmd: 'setroot',
		set: [
			'%s'
		]
	},
	{
		cmd: 'pcmanfm',
		set: [
			'-w %s'
		]
	},
	{
		cmd: 'feh',
		set: [
			'--bg-scale',
			'%s'
		]
	},
	{
		cmd: 'nitrogen',
		set: [
			'--set-zoom-fill',
			'--save',
			'%s'
		],
		get: [],
		transform: imagePath => imagePath.trim().split('\n').slice(-1)[0]
	},
	{
		cmd: 'xfconf-query',
		set: [
			'-c xfce4-desktop',
			'-p /backdrop/screen0/monitor0/image-path',
			'-s %s'
		]
	},
	{
		cmd: 'gconftool-2',
		set: [
			'--set',
			'/desktop/gnome/background/picture_filename',
			'--type=string',
			'%s'
		]
	},
	{
		cmd: 'dcop',
		set: [
			'kdesktop',
			'KBackgroundIface',
			'setWallpaper',
			'%s 1'
		]
	},
	{
		cmd: 'dconf',
		set: [
			'write',
			'/org/mate/desktop/background/picture-filename',
			'"%s"'
		],
		get: [
			'read',
			'/org/mate/desktop/background/picture-filename'
		],
		transform: imagePath => imagePath.slice(1, -1)
	},
	{
		cmd: 'qdbus',
		set: ['org.kde.plasmashell',
			'/PlasmaShell',
			'org.kde.PlasmaShell.evaluateScript',
			`
				var allDesktops = desktops();
				for (var i = 0; i < allDesktops.length; i++) {
					var desktop = allDesktops[i];
					desktop.wallpaperPlugin = 'org.kde.image';
					desktop.currentConfigGroup = ['Wallpaper', 'org.kde.image', 'General'];
					desktop.writeConfig('Image', 'file://%s');
				}
			`]
	}
];

let availableApps;

function setAvailableApps() {
	const availableAppsDict = {};

	availableApps = [];

	const names = appsList.map(el => {
		availableAppsDict[el.cmd] = el;
		return el.cmd;
	});

	// `which` all commands and expect stdout to return a positive
	const whichCmd = `which -a ${names.join('; which -a ')}`;

	return cp.exec(`echo $(${whichCmd})`).then(stdout => {
		stdout = stdout.trim();

		if (!stdout) {
			throw new Error('None of the apps were found');
		}

		// It may return aliases so we only want the real path
		// and only the executable name. i.e. 'foo' from /bin/foo
		stdout = stdout.split('\n');

		stdout.forEach(el => {
			// It's an alias
			if (el[0] !== path.sep) {
				return;
			}

			el = el.split(path.sep).pop();

			availableApps.push(availableAppsDict[el]);
		});
	});
}

function isCinnamon() {
	const args = ['writable', 'org.cinnamon.desktop.background', 'picture-uri'];

	return cp.execFile('gsettings', args)
		.then(out => out.trim() === 'true')
		.catch(() => {});
}

function isMATE() {
	const args = ['writable', 'org.mate.background', 'picture-filename'];

	return cp.execFile('gsettings', args)
		.then(out => out.trim() === 'true')
		.catch(() => {});
}

exports.get = function get() {
	if (!availableApps) {
		return setAvailableApps().then(get);
	}

	const app = availableApps.find(app => app.get);

	if (app.cmd === 'nitrogen') {
		const configFile = path.join(homeDir, '.config/nitrogen/bg-saved.cfg');
		return fs.readFile(configFile, 'utf8').then(config =>
			config.trim().split('\n').find(line => line.startsWith('file=')).replace('file=', '')
		);
	}

	if (app.cmd === 'gsettings') {
		const getArgs = app.get.slice();
		return isCinnamon()
			.then(cinnamon => {
				if (cinnamon) {
					getArgs[1] = 'org.cinnamon.desktop.background';
				}
			})
			.then(() => isMATE())
			.then(mate => {
				if (mate) {
					getArgs.splice(1, 2, 'org.mate.background', 'picture-filename');
				}
			})
			.then(() => cp.execFile(app.cmd, getArgs))
			.then(stdout => {
				stdout = stdout.trim();

				if (typeof app.transform === 'function') {
					return app.transform(stdout);
				}

				return stdout;
			});
	}

	return cp.execFile(app.cmd, app.get).then(stdout => {
		stdout = stdout.trim();

		if (typeof app.transform === 'function') {
			return app.transform(stdout);
		}

		return stdout;
	});
};

exports.set = function set(imagePath) {
	if (typeof imagePath !== 'string') {
		return Promise.reject(new TypeError('Expected a string'));
	}

	if (!availableApps) {
		return setAvailableApps().then(() => set(imagePath));
	}

	const app = availableApps.find(app => app.set);
	const params = app.set.slice();

	params[params.length - 1] = params[params.length - 1].replace('%s', path.resolve(imagePath));

	if (app.cmd === 'gsettings') {
		return isCinnamon()
			.then(cinnamon => {
				if (cinnamon) {
					params[1] = 'org.cinnamon.desktop.background';
				}
			})
			.then(() => isMATE())
			.then(mate => {
				if (mate) {
					params.splice(1, 3, 'org.mate.background', 'picture-filename', params[3].replace(/^file:\/\//, ''));
				}
			})
			.then(() => cp.execFile(app.cmd, params));
	}

	return cp.execFile(app.cmd, params);
};
