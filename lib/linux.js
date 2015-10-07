'use strict';
const path = require('path');
const childProcess = require('child_process');

const appsList = [
	{
		cmd: 'gsettings',
		set: ['set',
			'org.gnome.desktop.background',
			'picture-uri',
			'file://%s'
		],
		get: ['get',
			'org.gnome.desktop.background',
			'picture-uri'
		],
		transform: imagePath => imagePath.trim().slice(8, -1)
	},
	{
		cmd: 'setroot',
		set: ['%s'],
		get: null
	},
	{
		cmd: 'pcmanfm',
		set: ['-w %s'],
		get: null
	},
	{
		cmd: 'feh',
		set: ['--bg-scale', '%s'],
		get: null
	},
	{
		cmd: 'xfconf-query',
		set: ['-c xfce4-desktop',
			'-p /backdrop/screen0/monitor0/image-path',
			'-s %s'
		],
		get: null
	},
	{
		cmd: 'gconftool-2',
		set: ['--set',
			'/desktop/gnome/background/picture_filename',
			'--type=string',
			'%s'
		],
		get: null
	},
	{
		cmd: 'dcop',
		set: ['kdesktop',
			'KBackgroundIface',
			'setWallpaper',
			'%s 1'
		],
		get: null
	},
	{
		cmd: 'dconf',
		set: ['write',
			'/org/mate/desktop/background/picture-filename',
			'"%s"'],
		get: ['read',
			'/org/mate/desktop/background/picture-filename'
		],
		transform: imagePath => imagePath.trim().slice(1, -1)
	}
];

let availableApps;

function setAvailableApps(cb) {
	const availableAppsDict = {};
	availableApps = [];

	const names = appsList.map(el => {
		availableAppsDict[el.cmd] = el;
		return el.cmd;
	});

	// `which` all commands and expect stdout to return a positive
	const whichCmd = `which -a ${names.join('; which -a ')}`;

	childProcess.exec(whichCmd, (err, stdout) => {
		if (!stdout) {
			throw new Error('None of the apps were found');
		}

		// it may return aliases so we only want the real path
		// and only the executable name. i.e. 'foo' from /bin/foo
		stdout = stdout.trim().split('\n');

		stdout.forEach(el => {
			// it's an alias
			if (el[0] !== path.sep) {
				return;
			}

			el = el.split(path.sep).pop();

			availableApps.push(availableAppsDict[el]);
		});

		cb(availableApps);
	});
}

exports.get = function get(cb) {
	if (!availableApps) {
		return setAvailableApps(() => {
			get(cb);
		});
	}

	cb = cb || function () {};

	let found = false;

	availableApps.forEach(app => {
		if (!app.get || found) {
			return;
		}

		childProcess.execFile(app.cmd, app.get, (err, stdout) => {
			if (err || !stdout || found) {
				return;
			}

			found = true;

			if (typeof app.transform === 'function') {
				stdout = app.transform(stdout);
			}

			cb(null, stdout);
		});
	});
};

exports.set = function set(imagePath, cb) {
	if (typeof imagePath !== 'string') {
		throw new TypeError('Expected a string');
	}

	if (!availableApps) {
		return setAvailableApps(() => set(imagePath, cb));
	}

	cb = cb || function () {};

	imagePath = path.resolve(imagePath);

	availableApps.forEach(app => {
		if (!app.set) {
			return;
		}

		const params = JSON.parse(JSON.stringify(app.set));
		params[params.length - 1] = params[params.length - 1].replace('%s', imagePath);

		childProcess.execFile(app.cmd, params, err => cb(err));
	});
};
