import test from 'node:test';
import assert from 'node:assert/strict';
import { renderObservation, renderReport } from '../dist/studio-views.js';
import { reportText } from '../dist/logic.js';

const emptyContext = { nickname: '', age: '', concerns: [], duration: '', impact: '', note: '' };
const olderRecord = { id: 'older', version: 1, createdAt: '2025-01-01T00:00:00Z', mode: 'upload', context: emptyContext };
const state = { activeKind: 'tree', sample: false, uploads: { tree: { url: 'blob:private-child-image' } }, persistOptIn: false, error: '' };

test('optional memo stays collapsed while demo acknowledgment is visible before results', () => {
  const html = renderObservation({ context: emptyContext, consent: false, error: '' });
  assert.match(html, /시연 안내 확인/);
  assert.match(html, /data-field="consent"/);
  assert.match(html, /<details class="optional-context"><summary>기록할 메모가 있나요\?/);
  assert.match(html, /data-action="submit">그림의 의미 보기/);
});

test('tree result explains positive vitality direction and keeps comparison in evidence details', () => {
  const html = renderReport(state, olderRecord);
  assert.match(html, /큰 나무는 활력이 넉넉하게 표현된 모습/);
  assert.match(html, /활력은 움직이고 활동할 때의 힘과 에너지/);
  assert.match(html, /큰 나무에 부여한 방향은 그 힘이 넉넉하게 표현됐다는 쪽/);
  assert.match(html, /활력을 더 바란다는 해석을 제시한 것은 아닙니다/);
  assert.match(html, /실제 아이가 왜 크게 그렸는지는 알 수 없습니다/);
  assert.match(html, /사교성, 성취, 실제 아이의 에너지 수준이나 자신감/);
  assert.match(html, /등록한 그림 미리보기 · 분석되지 않음/);
  assert.match(html, /시연용 합성 그림 · 실제 아이 그림 아님/);
  assert.match(html, /<details class="source-details"><summary>근거 자세히 보기/);
  assert.match(html, /아주 작은 나무를 외로움이나 자신감 부족에 연결/);
  assert.match(html, /frontiersin\.org\/journals\/psychiatry/);
  assert.doesNotMatch(html, /상담 준비하기|아이에게 물어볼 말/);
});

test('house and person explain their themes without inferring a real child trait', () => {
  const house = renderReport({ ...state, activeKind: 'house' }, olderRecord, true);
  const person = renderReport({ ...state, activeKind: 'person' }, olderRecord, true);
  assert.match(house, /집은 가족과 생활 공간/);
  assert.match(house, /주변 사람이나 바깥세상과 관계 맺는 주제/);
  assert.match(house, /사교적이라는 뜻은 아닙니다/);
  assert.match(person, /자신을 어떤 모습으로 떠올리는지/);
  assert.match(person, /이 미소는 그림 속 인물이 웃고 있다는 표현/);
  assert.match(person, /실제 아이가 행복하다는 증거/);
  assert.doesNotMatch(person, /blob:private-child-image/);
});

test('plain text export keeps three meanings and optional notes, without prompts or image data', () => {
  const record = { ...olderRecord, context: { ...emptyContext, note: '기억할 그림 이야기' } };
  const text = reportText(record);
  for (const kind of ['집 그림', '나무 그림', '사람 그림']) assert.ok(text.includes(kind));
  assert.match(text, /현재 버전의 문구/);
  assert.match(text, /기억할 그림 이야기/);
  assert.match(text, /아주 작은 나무를 외로움이나 자신감 부족/);
  assert.match(text, /frontiersin\.org\/journals\/psychiatry/);
  assert.doesNotMatch(text, /blob:private-child-image|아이에게 물어볼 말|상담기관 검색/);
  assert.doesNotMatch(reportText(olderRecord), /선택하여 남긴 메모/);
});
