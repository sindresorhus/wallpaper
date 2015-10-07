'use strict';
var path = require('path');
var childProcess = require('child_process');

var appsList = [
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
		transform: function (imagePath) {
			return imagePath.trim().slice(8, -1);
		}
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
			'--type string',
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
		transform: function (imagePath) {
			return imagePath.trim().slice(1, -1);
		}
	}
];

var availableApps;

function setAvailableApps(cb) {
	var availableAppsDict = {};
	availableApps = [];

	var names = appsList.map(function (el) {
		availableAppsDict[el.cmd] = el;
		return el.cmd;
	});

	// `which` all commands and expect stdout to return a positive
	var whichCmd = 'which -a ' + names.join('; which -a ');

	childProcess.exec(whichCmd, function (err, stdout) {
		if (!stdout) {
			throw new Error('none of the apps were found');
		}

		// it may return aliases so we only want the real path
		// and only the executable name. i.e. 'foo' from /bin/foo
		stdout = stdout.trim().split('\n');

		stdout.forEach(function (el) {
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
		return setAvailableApps(function () {
			get(cb);
		});
	}

	cb = cb || function () {};

	var found = false;

	availableApps.forEach(function (app) {
		if (!app.get || found) {
			return;
		}

		childProcess.execFile(app.cmd, app.get, function (err, stdout) {
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
		throw new Error('imagePath required');
	}

	if (!availableApps) {
		return setAvailableApps(function () {
			set(imagePath, cb);
		});
	}

	cb = cb || function () {};

	imagePath = path.resolve(imagePath);

	availableApps.forEach(function (app) {
		if (!app.set) {
			return;
		}

		var params = JSON.parse(JSON.stringify(app.set));
		params[params.length - 1] = params[params.length - 1].replace('%s', imagePath);

		childProcess.execFile(app.cmd, params, function (err) {
			cb(err);
		});
	});
};
