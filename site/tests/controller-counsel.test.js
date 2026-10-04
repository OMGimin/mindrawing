import test from 'node:test';
import assert from 'node:assert/strict';
import { startController } from '../test-support/controller-harness.js';
import { STORAGE_KEY } from '../dist/logic.js';

const context = (nickname, note) => ({ nickname, age: '', concerns: [], duration: '', impact: '', note });
const record = (id, nickname, note) => ({ id, version: 1, createdAt: '2026-10-04T00:00:00Z', mode: 'upload', context: context(nickname, note) });

test('record counseling context survives unrelated navigation and changes on explicit selection', async () => {
  const app = await startController();
  try {
    app.store.set(STORAGE_KEY, JSON.stringify([record('A', '가', 'A의 민감 메모'), record('B', '나', 'B의 메모')]));
    app.navigate('records');
    app.action('open-record', { id: 'A' });
    app.action('counsel');
    assert.match(app.main.innerHTML, /A의 민감 메모/);
    app.navigate('evidence');
    app.navigate('counsel');
    assert.match(app.main.innerHTML, /A의 민감 메모/);
    app.navigate('records');
    app.action('open-record', { id: 'B' });
    app.action('counsel');
    assert.match(app.main.innerHTML, /B의 메모/);
    assert.doesNotMatch(app.main.innerHTML, /A의 민감 메모/);
    app.navigate('studio');
    app.action('sample');
    app.inputField('note', '현재 작성 중');
    app.navigate('counsel');
    assert.match(app.main.innerHTML, /현재 작성 중/);
    assert.doesNotMatch(app.main.innerHTML, /B의 메모/);
    app.navigate('studio');
    app.inputField('note', '수정된 작성 내용');
    app.navigate('counsel');
    assert.match(app.main.innerHTML, /수정된 작성 내용/);
  } finally { app.restore(); }
});

test('deleting a chosen record clears its note and leaves other saved records available', async () => {
  const app = await startController();
  try {
    app.store.set(STORAGE_KEY, JSON.stringify([record('A', '가', 'A의 민감 메모'), record('B', '나', 'B의 메모')]));
    app.navigate('records');
    app.action('open-record', { id: 'A' });
    app.action('counsel');
    app.navigate('records');
    app.action('open-record', { id: 'B' });
    app.action('delete-record', { id: 'B' });
    app.navigate('counsel');
    assert.doesNotMatch(app.main.innerHTML, /B의 메모/);
    app.navigate('records');
    app.action('open-record', { id: 'A' });
    app.action('counsel');
    assert.match(app.main.innerHTML, /A의 민감 메모/);
    app.navigate('records');
    app.action('open-record', { id: 'A' });
    app.action('delete-record', { id: 'A' });
    app.navigate('evidence');
    app.navigate('counsel');
    assert.doesNotMatch(app.main.innerHTML, /A의 민감 메모/);
  } finally { app.restore(); }
});

test('reset and delete-all prevent prior sensitive draft or saved notes from returning', async () => {
  const app = await startController();
  try {
    app.action('sample');
    app.inputField('note', '초기 민감 메모');
    app.navigate('counsel');
    assert.match(app.main.innerHTML, /초기 민감 메모/);
    app.navigate('studio');
    app.action('reset');
    app.navigate('evidence');
    app.navigate('counsel');
    assert.doesNotMatch(app.main.innerHTML, /초기 민감 메모/);

    app.store.set(STORAGE_KEY, JSON.stringify([record('A', '가', '저장 민감 메모')]));
    app.navigate('records');
    app.action('open-record', { id: 'A' });
    app.action('counsel');
    assert.match(app.main.innerHTML, /저장 민감 메모/);
    app.navigate('records');
    app.action('delete-all');
    app.navigate('evidence');
    app.navigate('counsel');
    assert.doesNotMatch(app.main.innerHTML, /저장 민감 메모/);
  } finally { app.restore(); }
});

test('deleting a record made in this session also clears its in-memory report and draft note', async () => {
  const app = await startController();
  try {
    app.action('sample');
    app.inputField('note', '이번 세션 민감 메모');
    app.changeField('consent', true);
    app.action('submit');
    app.runDelay(800);
    app.changeField('persistOptIn', true);
    app.action('save');
    const [saved] = JSON.parse(app.store.get(STORAGE_KEY));
    app.navigate('records');
    app.action('open-record', { id: saved.id });
    app.action('delete-record', { id: saved.id });
    app.navigate('counsel');
    assert.doesNotMatch(app.main.innerHTML, /이번 세션 민감 메모/);
    app.navigate('studio');
    app.navigate('counsel');
    assert.doesNotMatch(app.main.innerHTML, /이번 세션 민감 메모/);
  } finally { app.restore(); }
});

test('reset cancels a pending report so an old note cannot return afterward', async () => {
  const app = await startController();
  try {
    app.action('sample');
    app.inputField('note', '처리 중 민감 메모');
    app.changeField('consent', true);
    app.action('submit');
    app.navigate('evidence');
    app.navigate('studio');
    app.action('reset');
    app.runDelay(800);
    app.navigate('counsel');
    assert.doesNotMatch(app.main.innerHTML, /처리 중 민감 메모/);
    assert.equal((await app.state()).hasReport, false);
  } finally { app.restore(); }
});

test('deleting saved result A preserves a separately edited current draft B', async () => {
  const app = await startController();
  try {
    app.action('sample');
    app.inputField('nickname', '민이');
    app.changeField('age', '9');
    app.action('concern', { value: '수면' });
    app.inputField('note', 'A의 민감 메모');
    app.changeField('consent', true);
    app.action('submit');
    app.runDelay(800);
    app.changeField('persistOptIn', true);
    app.action('save');
    const [saved] = JSON.parse(app.store.get(STORAGE_KEY));
    app.action('back');
    app.inputField('note', 'B의 새 메모');
    app.navigate('records');
    app.action('open-record', { id: saved.id });
    app.action('delete-record', { id: saved.id });
    app.navigate('studio');
    app.navigate('counsel');
    assert.match(app.main.innerHTML, /B의 새 메모/);
    assert.match(app.main.innerHTML, /민이/);
    assert.match(app.main.innerHTML, /9세/);
    assert.match(app.main.innerHTML, /수면/);
    assert.doesNotMatch(app.main.innerHTML, /A의 민감 메모/);
    assert.equal((await app.state()).hasReport, false);
  } finally { app.restore(); }
});

test('explicitly emptying a saved note remains a distinct draft after deleting its record', async () => {
  const app = await startController();
  try {
    app.action('sample');
    app.inputField('nickname', '민이');
    app.inputField('note', '지울 민감 메모');
    app.changeField('consent', true);
    app.action('submit');
    app.runDelay(800);
    app.changeField('persistOptIn', true);
    app.action('save');
    const [saved] = JSON.parse(app.store.get(STORAGE_KEY));
    app.action('back');
    app.inputField('note', '');
    app.navigate('records');
    app.action('open-record', { id: saved.id });
    app.action('delete-record', { id: saved.id });
    app.navigate('studio');
    app.navigate('counsel');
    assert.match(app.main.innerHTML, /민이/);
    assert.doesNotMatch(app.main.innerHTML, /지울 민감 메모/);
  } finally { app.restore(); }
});

test('replacing a picture after result A keeps the new preview when A is deleted', async () => {
  const app = await startController();
  try {
    app.action('sample');
    app.inputField('note', 'A의 민감 메모');
    app.changeField('consent', true);
    app.action('submit');
    app.runDelay(800);
    app.changeField('persistOptIn', true);
    app.action('save');
    const [saved] = JSON.parse(app.store.get(STORAGE_KEY));
    app.action('back');
    app.action('back');
    app.changeFile('house', { name: 'new.png', type: 'image/png', size: 100 });
    app.images[0].resolve();
    await new Promise((resolve) => setImmediate(resolve));
    app.navigate('records');
    app.action('open-record', { id: saved.id });
    app.action('delete-record', { id: saved.id });
    app.navigate('counsel');
    assert.doesNotMatch(app.main.innerHTML, /A의 민감 메모/);
    app.navigate('studio');
    assert.equal(app.main.previews.house, 'blob:test-1');
    app.navigate('counsel');
    assert.match(app.main.innerHTML, /A의 민감 메모/);
  } finally { app.restore(); }
});
