import test from 'node:test';
import assert from 'node:assert/strict';
import { renderReport } from '../dist/studio-views.js';
import { reportText } from '../dist/logic.js';

const context = { nickname: '아이', age: '9', concerns: [], duration: '', impact: '', note: '' };
const savedRecord = { id: 'older', version: 1, createdAt: '2025-01-01T00:00:00Z', mode: 'upload', context };
const state = { activeKind: 'tree', sample: false, uploads: { tree: { url: 'blob:private-child-image' } }, persistOptIn: false, error: '' };

test('the tree tab explains the visible example and clearly separates a small-tree comparison', () => {
  const html = renderReport(state, savedRecord);
  assert.match(html, /등록한 그림 미리보기 · 분석되지 않음/);
  assert.match(html, /시연용 합성 그림 · 실제 아이 그림 아님/);
  assert.match(html, /나무가 그림 영역에서 비교적 크게 그려졌고/);
  assert.match(html, /큰 나무를 활력과 연결/);
  assert.match(html, /비교 설명 · 이 예시 해당 없음/);
  assert.match(html, /아주 작은 나무를 위축이나 자신감 부족과 연결/);
  assert.match(html, /종이 여백, 그림 과제 이해/);
  assert.match(html, /이 나무는 실제로 얼마나 클까/);
  assert.match(html, /frontiersin\.org\/journals\/psychiatry/);
  assert.match(html, /현재 그림 탭 인쇄/);
});

test('house and person tabs offer distinct literature context and open questions', () => {
  const house = renderReport({ ...state, activeKind: 'house' }, savedRecord, true);
  const person = renderReport({ ...state, activeKind: 'person' }, savedRecord, true);
  assert.match(house, /가족, 생활환경, 관계/);
  assert.match(house, /문·창문의 유무나 수에서 사교성/);
  assert.match(house, /이 집에는 누가 살고 있고/);
  assert.match(person, /자기상을 탐색하는 소재/);
  assert.match(person, /팔을 벌린 자세 하나로 성격/);
  assert.match(person, /이 사람은 지금 무엇을 하고 있니/);
});

test('plain text export includes the three reference interpretations while excluding image data', () => {
  const text = reportText(savedRecord);
  for (const kind of ['집 그림', '나무 그림', '사람 그림']) assert.ok(text.includes(kind));
  assert.match(text, /현재 버전\(2026-10-04\)/);
  assert.match(text, /작은 나무를 위축이나 자신감 부족/);
  assert.match(text, /frontiersin\.org\/journals\/psychiatry/);
  assert.doesNotMatch(text, /blob:private-child-image/);
  assert.match(text, /저장 당시 분석 결과가 아닌/);
});
