'use strict';
const path = require('path');
const childProcess = require('child_process');
const pify = require('pify');
const execFile = pify(childProcess.execFile);
const exec = pify(childProcess.exec);

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

function setAvailableApps() {
	const availableAppsDict = {};

	availableApps = [];

	const names = appsList.map(el => {
		availableAppsDict[el.cmd] = el;
		return el.cmd;
	});

	// `which` all commands and expect stdout to return a positive
	const whichCmd = `which -a ${names.join('; which -a ')}`;

	return exec(whichCmd)
		.then(function (stdout) {
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
		});
}

exports.get = function get() {
	if (!availableApps) {
		return setAvailableApps().then(get);
	}

	const app = availableApps.find(app => {
		return app.get !== undefined;
	});

	return execFile(app.cmd, app.get)
		.then(stdout => {
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

	imagePath = path.resolve(imagePath);

	const app = availableApps.find(app => {
		return app.set !== undefined;
	});

	const params = JSON.parse(JSON.stringify(app.set));
	params[params.length - 1] = params[params.length - 1].replace('%s', imagePath);

	return execFile(app.cmd, params);
};
