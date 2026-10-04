import test from 'node:test';
import assert from 'node:assert/strict';
import { startController, imageFile } from '../test-support/controller-harness.js';
import { STORAGE_KEY } from '../dist/logic.js';

const settle = () => new Promise((resolve) => setImmediate(resolve));

test('sample then back then next with all pictures enters upload mode and retains parent input', async () => {
  const app = await startController();
  try {
    for (const kind of ['house', 'tree', 'person']) {
      app.changeFile(kind, imageFile(`${kind}.png`));
      app.images.at(-1).resolve();
      await settle();
    }
    app.action('sample');
    app.inputField('nickname', '민이');
    app.inputField('note', '최근의 관찰');
    app.action('back');
    app.action('next');
    assert.equal((await app.state()).sample, false);
    assert.match(app.main.innerHTML, /최근의 관찰/);
    app.changeField('consent', true);
    app.action('submit');
    app.runDelay(800);
    assert.match(app.main.innerHTML, /등록한 그림 미리보기 · 분석되지 않음/);
    app.changeField('persistOptIn', true);
    app.action('save');
    const [record] = JSON.parse(app.store.get(STORAGE_KEY));
    assert.equal(record.mode, 'upload');
    assert.equal(record.context.note, '최근의 관찰');
  } finally { app.restore(); }
});
