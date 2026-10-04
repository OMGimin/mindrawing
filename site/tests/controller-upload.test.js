import test from 'node:test';
import assert from 'node:assert/strict';
import { startController, imageFile } from '../test-support/controller-harness.js';

const settle = () => new Promise((resolve) => setImmediate(resolve));

test('newer upload wins even when older decode finishes last', async () => {
  const app = await startController();
  try {
    app.changeFile('house', imageFile('A.png'));
    app.changeFile('house', imageFile('B.png'));
    app.images[1].resolve();
    await settle();
    app.images[0].resolve();
    await settle();
    assert.equal(app.revoked.includes('blob:test-1'), true);
    assert.equal(app.main.previews.house, 'blob:test-2');
  } finally { app.restore(); }
});

test('remove and reset invalidate pending previews without an announcement', async () => {
  const app = await startController();
  try {
    app.changeFile('house', imageFile('removed.png'));
    app.action('remove-file', { kind: 'house' });
    app.images[0].resolve();
    await settle();
    assert.equal(app.main.previews.house, undefined);
    assert.deepEqual(app.revoked, ['blob:test-1']);

    app.changeFile('tree', imageFile('reset.png'));
    app.action('reset');
    app.images[1].resolve();
    await settle();
    assert.equal(app.main.previews.tree, undefined);
    assert.deepEqual(app.revoked, ['blob:test-1', 'blob:test-2']);
  } finally { app.restore(); }
});

test('navigation and sample selection invalidate a pending decode or error', async () => {
  const app = await startController();
  try {
    app.changeFile('person', imageFile('late.png'));
    app.navigate('evidence');
    app.images[0].resolve();
    await settle();
    app.navigate('studio');
    assert.equal(app.main.previews.person, undefined);
    assert.deepEqual(app.revoked, ['blob:test-1']);

    app.changeFile('house', imageFile('broken.png'));
    app.action('sample');
    app.images[1].reject(new Error('broken'));
    await settle();
    assert.equal((await app.state()).sample, true);
    assert.equal(app.status.textContent.includes('이미지를 열 수 없습니다'), false);
    assert.deepEqual(app.revoked, ['blob:test-1', 'blob:test-2']);
  } finally { app.restore(); }
});

test('hash navigation away and back cannot revive an older upload', async () => {
  const app = await startController();
  try {
    app.changeFile('house', imageFile('old.png'));
    app.hashNavigate('evidence');
    app.hashNavigate('studio');
    app.images[0].resolve();
    await settle();
    assert.equal(app.main.previews.house, undefined);
    assert.deepEqual(app.revoked, ['blob:test-1']);
  } finally { app.restore(); }
});
