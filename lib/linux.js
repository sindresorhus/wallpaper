'use strict';
const path = require('path');
const childProcess = require('child_process');
const pify = require('pify');

const cp = pify(childProcess);

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
		transform: imagePath => imagePath.slice(8, -1)
	},
	{
		cmd: 'setroot',
		set: ['%s']
	},
	{
		cmd: 'pcmanfm',
		set: ['-w %s']
	},
	{
		cmd: 'feh',
		set: ['--bg-scale', '%s']
	},
	{
		cmd: 'xfconf-query',
		set: ['-c xfce4-desktop',
			'-p /backdrop/screen0/monitor0/image-path',
			'-s %s'
		]
	},
	{
		cmd: 'gconftool-2',
		set: ['--set',
			'/desktop/gnome/background/picture_filename',
			'--type=string',
			'%s'
		]
	},
	{
		cmd: 'dcop',
		set: ['kdesktop',
			'KBackgroundIface',
			'setWallpaper',
			'%s 1'
		]
	},
	{
		cmd: 'dconf',
		set: ['write',
			'/org/mate/desktop/background/picture-filename',
			'"%s"'],
		get: ['read',
			'/org/mate/desktop/background/picture-filename'
		],
		transform: imagePath => imagePath.slice(1, -1)
	},
	{
		cmd: 'gsettings',
		set: ['set',
			'org.cinnamon.desktop.background',
			'picture-uri',
			'file://%s'
		],
		get: ['get',
			'org.cinnamon.desktop.background',
			'picture-uri'
		]
	}
];

let availableApps;

function setAvailableApps() {
	const availableAppsDict = {};

	availableApps = [];

	const names = appsList.map(el => {
		if(Array.isArray(availableAppsDict[el.cmd])) availableAppsDict[el.cmd].push(el);
		else availableAppsDict[el.cmd] = [el];
		return el.cmd;
	});

	// `which` all commands and expect stdout to return a positive
	const whichCmd = `which -a ${names.join('; which -a ')}`;

	return cp.exec(whichCmd).then(stdout => {
		stdout = stdout.trim();

		if (!stdout) {
			throw new Error('None of the apps were found');
		}

		// it may return aliases so we only want the real path
		// and only the executable name. i.e. 'foo' from /bin/foo
		stdout = stdout.split('\n');

		stdout.forEach(el => {
			// it's an alias
			if (el[0] !== path.sep) {
				return;
			}

			el = el.split(path.sep).pop();

			availableApps = availableApps.concat(availableAppsDict[el]);
		});
	});
}

exports.get = function get() {
	if (!availableApps) {
		return setAvailableApps().then(get);
	}

	const app = availableApps.find(app => app.get);

	const letsTry = (app) =>{
		if(!app.get)return false;
		return new Promise(resolve=>{
			cp.execFile(app.cmd,app.get).then(stdout => {
				stdout = stdout.trim();

				if (typeof app.transform === 'function') {
					resolve(app.transform(stdout));
				}else {
					resolve(stdout);
				}
			},()=>resolve(false))
		})
	}
	return Promise.all(availableApps.map(letsTry)).then(values=>{
		values = values.filter(v=>v);
		if(values.length === 0) return Promise.reject('No suitable way to get wallpaepr in your environment');
		//the longest one may be the correct one.
		return values.reduce((pre,cur)=>pre.length < cur.length?cur:pre,'');
	})
};

exports.set = function set(imagePath) {
	if (typeof imagePath !== 'string') {
		return Promise.reject(new TypeError('Expected a string'));
	}

	if (!availableApps) {
		return setAvailableApps().then(() => set(imagePath));
	}

	const letsTry= (app)=>{
		if(!app.set) return false;
		const params = app.set.slice();
		params[params.length - 1] = params[params.length - 1].replace('%s', path.resolve(imagePath));
		return new Promise((resolve)=>{
			cp.execFile(app.cmd,params)
			.then(()=>resolve(true))
			.catch(()=>resolve(false));
		});
	}
	return Promise.all(availableApps.map(letsTry))
		.then(values => {
			if(values.every(value=>!value)) return Promise.reject('No suitable way to set wallpaepr in your environment')
			return 'done';
		});
};
