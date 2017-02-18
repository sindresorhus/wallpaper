import path from 'path';
import test from 'ava';
import m from '.';

test(async t => {
	const orignalImagePath = await m.get();

	await m.set('fixture.jpg');
	t.is(await m.get(), path.resolve('fixture.jpg'));

	await m.set(orignalImagePath);
});
