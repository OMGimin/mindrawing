import test from 'node:test';
import assert from 'node:assert/strict';
import { validateImage, guidanceFor, recordFromState, readRecords, reportText, STORAGE_KEY } from '../dist/logic.js';
import { esc, renderReport } from '../dist/studio-views.js';

test('image gate rejects empty, oversized and unsupported files', () => {
  assert.match(validateImage({ type: 'image/png', size: 0 }), /빈 파일/);
  assert.match(validateImage({ type: 'image/jpeg', size: 8 * 1024 * 1024 + 1 }), /8MB/);
  assert.match(validateImage({ type: 'image/svg+xml', size: 100 }), /JPG/);
  assert.equal(validateImage({ type: 'image/webp', size: 1024 }), '');
});

test('guidance uses parent context and never a drawing-derived score', () => {
  assert.match(guidanceFor({ duration: 'weeks', impact: '' }).body, /그림으로 판단한 결과가 아닙니다/);
  assert.match(guidanceFor({ duration: '', impact: 'noticeable' }).title, /전문가/);
  assert.match(guidanceFor({ duration: '', impact: '' }).body, /판단을 보류/);
});

test('saved record excludes uploaded image material and report labels the demo', () => {
  const state = { sample: false, uploads: { house: { url: 'blob:private', name: 'child.png' } }, context: { nickname: '별명', age: '8', concerns: ['수면'], duration: 'recent', impact: 'some', note: '최근 변화' } };
  const record = recordFromState(state, new Date('2026-10-04T00:00:00Z'));
  assert.equal(JSON.stringify(record).includes('blob:private'), false);
  assert.equal(JSON.stringify(record).includes('child.png'), false);
  assert.match(reportText(record), /시연용 합성 그림의 고정 설명/);
  assert.match(reportText(record), /등록한 그림은 분석하거나 기록에 저장하지 않습니다/);
});

test('malformed saved data is rejected before reading or overwriting it', () => {
  const bad = { version: 1, id: 'a', createdAt: '2026-10-04T00:00:00Z', mode: 'sample', context: { nickname: '<script>', age: '', concerns: 'not-array', duration: '', impact: '', note: '' } };
  const storage = { getItem: (key) => key === STORAGE_KEY ? JSON.stringify([bad]) : null };
  assert.throws(() => readRecords(storage), /형식/);
  assert.equal(esc('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
});

test('uploaded preview and synthetic observations stay explicitly separate', () => {
  const context = { nickname: '아이', age: '9', concerns: [], duration: '', impact: '', note: '' };
  const record = { id: 'one', version: 1, createdAt: '2026-10-04T00:00:00Z', mode: 'upload', context };
  const state = { activeKind: 'house', sample: false, uploads: { house: { url: 'blob:preview' } }, persistOptIn: false, error: '' };
  const html = renderReport(state, record);
  assert.match(html, /등록한 그림 미리보기 · 분석되지 않음/);
  assert.match(html, /시연용 합성 그림 · 실제 아이 그림 아님/);
  assert.match(html, /시연용 합성 그림의 고정 설명/);
});
