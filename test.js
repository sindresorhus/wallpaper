import path from 'path';
import test from 'ava';
import fn from '.';

test(async t => {
	const orignalImagePath = await fn.get();

	await fn.set('fixture.jpg');
	t.is(await fn.get(), path.resolve('fixture.jpg'));

	await fn.set(orignalImagePath);
});
