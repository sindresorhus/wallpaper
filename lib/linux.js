'use strict';
const util = require('util');
const path = require('path');
const homeDir = require('os').homedir();
const childProcess = require('child_process');
const fs = require('fs');

const execFile = util.promisify(childProcess.execFile);
const exec = util.promisify(childProcess.exec);
const readFile = util.promisify(fs.readFile);

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
			'--bg-fill',
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

async function setAvailableApps() {
	const availableAppsDict = {};

	availableApps = [];

	const names = appsList.map(el => {
		availableAppsDict[el.cmd] = el;
		return el.cmd;
	});

	// `which` all commands and expect stdout to return a positive
	const whichCmd = `which -a ${names.join('; which -a ')}`;

	let {stdout} = await exec(whichCmd);
	stdout = stdout.trim();

	if (!stdout) {
		throw new Error('None of the apps were found');
	}

	// It may return aliases so we only want the real path
	// and only the executable name. i.e. 'foo' from /bin/foo
	const lines = stdout.split('\n');

	for (let line of lines) {
		// It's an alias
		if (line[0] !== path.sep) {
			return;
		}

		line = line.split(path.sep).pop();

		availableApps.push(availableAppsDict[line]);
	}
}

async function isCinnamon() {
	const args = ['writable', 'org.cinnamon.desktop.background', 'picture-uri'];

	try {
		const {stdout} = await execFile('gsettings', args);
		return stdout.trim() === 'true';
	} catch (_) {}
}

async function isMATE() {
	const args = ['writable', 'org.mate.background', 'picture-filename'];

	try {
		const {stdout} = await execFile('gsettings', args);
		return stdout.trim() === 'true';
	} catch (_) {}
}

exports.get = async function get() {
	if (!availableApps) {
		await setAvailableApps();
		return get();
	}

	const app = availableApps.find(app => app.get);

	if (app.cmd === 'nitrogen') {
		const configFile = path.join(homeDir, '.config/nitrogen/bg-saved.cfg');
		const config = await readFile(configFile, 'utf8');
		return config.trim().split('\n').find(line => line.startsWith('file=')).replace('file=', '');
	}

	const getArgs = app.get.slice();

	if (app.cmd === 'gsettings') {
		if (await isCinnamon()) {
			getArgs[1] = 'org.cinnamon.desktop.background';
		}

		if (await isMATE()) {
			getArgs.splice(1, 2, 'org.mate.background', 'picture-filename');
		}
	}

	let {stdout} = await execFile(app.cmd, getArgs);
	stdout = stdout.trim();

	if (typeof app.transform === 'function') {
		return app.transform(stdout);
	}

	return stdout;
};

exports.set = async function set(imagePath) {
	if (typeof imagePath !== 'string') {
		throw new TypeError('Expected a string');
	}

	if (!availableApps) {
		await setAvailableApps();
		await set(imagePath);
		return;
	}

	const app = availableApps.find(app => app.set);
	const params = app.set.slice();

	params[params.length - 1] = params[params.length - 1].replace('%s', path.resolve(imagePath));

	if (app.cmd === 'gsettings') {
		if (await isCinnamon()) {
			params[1] = 'org.cinnamon.desktop.background';
		}

		if (await isMATE()) {
			params.splice(1, 3, 'org.mate.background', 'picture-filename', params[3].replace(/^file:\/\//, ''));
		}
	}

	await execFile(app.cmd, params);
};
