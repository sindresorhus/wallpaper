import {commandExists} from '../util.js';
import { spawn } from 'node:child_process'

export async function isAvailable() {
	return commandExists('swaybg');
}

export async function set(imagePath) {
	let swaybg = spawn('swaybg', ['-i', imagePath, '-m', 'fill']);

	swaybg.stderr.on('data', (data) => {
		console.error(`${data}`);
	});

	swaybg.on('close', (code) => {
		console.log(`swaybg exited with code ${code}`);
	}); 

}
