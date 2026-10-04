import { KINDS, LABELS, guidanceFor, durationLabel, impactLabel } from './logic.js';

export const examples = {
  house: {
    lines: ['파란색 지붕과 빨간색 문이 보입니다.', '창문 두 개가 그려져 있습니다.', '집 아래에 초록색 선이 이어집니다.'],
    questions: ['이 집에는 누가 살고 있니?', '이 그림에서 가장 마음에 드는 부분은 뭐야?']
  },
  tree: {
    lines: ['초록색으로 칠한 넓은 나무 윗부분이 보입니다.', '갈색 줄기와 여러 갈래의 가지가 그려져 있습니다.', '나무 아래에 초록색 풀이 보입니다.'],
    questions: ['이 나무는 어디에 있을까?', '이 나무 옆에는 무엇이 있으면 좋을까?']
  },
  person: {
    lines: ['파란색 상의와 빨간색 하의를 입은 사람이 보입니다.', '두 팔이 양옆으로 펼쳐져 있습니다.', '얼굴에 눈과 입이 그려져 있습니다.'],
    questions: ['이 사람은 지금 무엇을 하고 있을까?', '이 사람에게 하고 싶은 말이 있니?']
  }
};
const concerns = ['수면', '학교생활', '친구관계', '감정 변화', '가족과의 시간', '그 밖의 변화'];
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
const sel = (value, current) => value === current ? ' selected' : '';
const check = (value) => value ? ' checked' : '';
const dateLabel = (value) => new Date(value).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });
function stepper(active) {
  return `<ol class="stepper" aria-label="진행 단계">
    <li class="${active === 1 ? 'current' : active > 1 ? 'completed' : ''}" ${active === 1 ? 'aria-current="step"' : ''}><span>01</span> 그림 등록</li>
    <li class="${active === 2 ? 'current' : active > 2 ? 'completed' : ''}" ${active === 2 ? 'aria-current="step"' : ''}><span>02</span> 보호자 관찰</li>
    <li class="${active === 3 ? 'current' : ''}" ${active === 3 ? 'aria-current="step"' : ''}><span>03</span> 결과 살펴보기</li>
  </ol>`;
}
const option = (value, label, current) => `<option value="${value}"${sel(value, current)}>${label}</option>`;
export function renderObservation(state) {
  const c = state.context;
  return `<section class="inner-page" aria-labelledby="page-title">
    <div class="inner-head"><p class="eyebrow"><span class="eyebrow-line"></span> 관찰을 함께 정리해요</p><h1 id="page-title">보호자가 본 아이의 일상</h1><p>그림만으로는 알 수 없는 최근의 변화를 적어 주세요. 답하지 않아도 되는 항목은 비워두셔도 됩니다.</p></div>
    <div class="work-card observation-card"><div class="work-heading"><div><p class="section-kicker">02 — CONTEXT</p><h2>아이를 더 잘 이해하기 위한 질문</h2></div><span class="step-label">2 / 3 단계</span></div>
    ${stepper(2)}
    <div class="form-grid"><label class="field"><span>아이를 부를 이름 <small>선택</small></span><input type="text" data-field="nickname" maxlength="20" autocomplete="off" placeholder="예: 우리 아이, 민이" value="${esc(c.nickname)}" /><small>실명 대신 별명이나 호칭을 사용해 주세요.</small></label>
    <label class="field"><span>나이 <small>선택 · 7–13세</small></span><select data-field="age"><option value="">선택하지 않음</option>${Array.from({length: 7}, (_, i) => option(String(i + 7), String(i + 7) + '세', c.age)).join('')}</select></label></div>
    <fieldset class="field-set"><legend>요즘 관심이 가는 변화 <small>선택</small></legend><div class="chip-row">${concerns.map((item) => `<button type="button" class="chip ${c.concerns.includes(item) ? 'selected' : ''}" data-action="concern" data-value="${item}" aria-pressed="${c.concerns.includes(item)}">${item}</button>`).join('')}</div></fieldset>
    <div class="form-grid"><label class="field"><span>변화가 이어진 기간 <small>선택</small></span><select data-field="duration"><option value="">선택하지 않음</option>${option('recent', '최근 시작됨', c.duration)}${option('weeks', '몇 주 이상 이어짐', c.duration)}${option('unsure', '잘 모르겠음', c.duration)}</select></label>
    <label class="field"><span>가정·학교·친구 관계에서의 영향 <small>선택</small></span><select data-field="impact"><option value="">선택하지 않음</option>${option('none', '아직 눈에 띄지 않음', c.impact)}${option('some', '조금 달라짐', c.impact)}${option('noticeable', '생활에 영향이 있음', c.impact)}${option('unsure', '잘 모르겠음', c.impact)}</select></label></div>
    <label class="field note-field"><span>추가로 기억하고 싶은 모습 <small>선택</small></span><textarea data-field="note" maxlength="500" rows="4" placeholder="예: 최근 등교 전 힘들어하는 날이 있었어요.">${esc(c.note)}</textarea><small>민감한 정보나 실명은 적지 않는 편이 좋습니다. 최대 500자.</small></label>
    <label class="consent-box"><input type="checkbox" data-field="consent"${check(state.consent)} /><span><strong>시연 결과 안내를 확인했어요</strong><small>다음 화면은 실제 AI 분석이 아닌 고정 예시 관찰과 입력한 내용의 정리입니다. 등록한 그림은 서버로 전송되지 않으며, 기록 저장을 선택하지 않으면 새로고침 후 사라집니다.</small></span></label>
    <div class="work-footer"><p>결과는 진단이나 상담 대체가 아닌 상담 준비용 참고 자료입니다.</p><div class="footer-actions"><button class="ghost-button" type="button" data-action="reset">처음부터</button><button class="ghost-button" type="button" data-action="back">그림 등록으로</button><button class="primary-button" type="button" data-action="submit">시연 결과 보기</button></div></div>
    ${state.error ? `<p class="form-error" role="alert">${esc(state.error)}</p>` : ''}</div>
  </section>`;
}
export function renderPreparing() {
  return `<section class="inner-page preparing" aria-labelledby="page-title"><div class="preparing-mark" aria-hidden="true">✳</div><p class="section-kicker">DEMO PREVIEW</p><h1 id="page-title">시연 결과를 준비해요</h1><p>그림을 분석하고 있지 않습니다. 예시 관찰과 보호자가 입력한 내용을 정리하고 있어요.</p><div class="preparing-bar" aria-hidden="true"><span></span></div></section>`;
}
export function contextList(c) {
  return `<dl class="context-list">
    <div><dt>아이를 부를 이름</dt><dd>${esc(c.nickname || '입력하지 않음')}</dd></div>
    <div><dt>나이</dt><dd>${c.age ? esc(c.age) + '세' : '입력하지 않음'}</dd></div>
    <div><dt>관심 주제</dt><dd>${c.concerns.length ? c.concerns.map(esc).join(' · ') : '선택하지 않음'}</dd></div>
    <div><dt>변화 기간</dt><dd>${durationLabel(c.duration)}</dd></div>
    <div><dt>일상 영향</dt><dd>${impactLabel(c.impact)}</dd></div>
    <div class="wide"><dt>보호자 메모</dt><dd>${esc(c.note || '입력하지 않음')}</dd></div>
  </dl>`;
}
export function renderReport(state, record, saved = false) {
  const kind = state.activeKind;
  const guidance = guidanceFor(record.context);
  const image = !saved && !state.sample && state.uploads[kind];
  return `<section class="inner-page report-page" aria-labelledby="page-title">
    <div class="report-top"><div><p class="eyebrow"><span class="eyebrow-line"></span> FIRST LOOK</p><h1 id="page-title">${esc(record.context.nickname || '아이')}의 그림을 살펴볼 시간</h1><p>그림 예시와 보호자 관찰을 나란히 확인하고, 도움이 필요할 때 다음 단계를 선택해 보세요.</p></div><span class="report-date">${dateLabel(record.createdAt)}</span></div>
    <div class="demo-notice"><strong>시연 결과 · 실제 AI 분석 아님</strong><p>아래 '그림에서 보이는 것'은 시연용 합성 그림에 미리 작성한 예시입니다. 등록한 아이의 그림을 분석하거나 심리 상태를 추정하지 않았습니다.</p></div>
    ${stepper(3)}
    <div class="report-grid"><div class="report-main">
      <section class="report-panel"><div class="panel-title"><div><p class="section-kicker">01 — EXAMPLE</p><h2>그림 예시 살펴보기</h2></div><span class="small-tag">합성 그림 예시</span></div>
        <div class="tab-row" role="tablist" aria-label="그림 종류">${KINDS.map((k) => `<button type="button" role="tab" data-action="tab" data-kind="${k}" aria-selected="${kind === k}" class="${kind === k ? 'active' : ''}">${LABELS[k]} 그림</button>`).join('')}</div>
        <div class="example-layout" role="tabpanel">
          <div class="art-column">${image ? `<div class="real-preview"><img src="${image.url}" alt="등록한 ${LABELS[kind]} 그림 미리보기" /><span>등록한 그림 미리보기 · 분석되지 않음</span></div>` : (!saved && state.sample ? '' : `<div class="missing-preview">등록한 그림의 미리보기는 기록에 저장되지 않습니다.</div>`)}
            <div class="synthetic-preview"><div class="sample-slice ${kind}" role="img" aria-label="시연용 합성 ${LABELS[kind]} 그림"></div><span>시연용 합성 그림 · 실제 아이 그림 아님</span></div></div>
          <div class="example-copy"><h3>예시 그림에서 보이는 것</h3><p class="explain">이 문장은 합성 그림에 관한 관찰 예시이며, 등록한 그림에 대한 분석이 아닙니다.</p><ul class="observation-list">${examples[kind].lines.map((line) => `<li>${line}</li>`).join('')}</ul>
            <div class="question-box"><strong>아이에게 물어볼 수 있는 말 <small>선택 사항</small></strong><ul>${examples[kind].questions.map((question) => `<li>“${question}”</li>`).join('')}</ul></div></div>
        </div>
      </section>
      <section class="report-panel"><div class="panel-title"><div><p class="section-kicker">02 — PARENT NOTES</p><h2>보호자가 입력한 내용</h2></div></div>${contextList(record.context)}</section>
      <details class="source-details"><summary>이 결과는 어떻게 만들어졌나요?</summary><p>합성 그림에 대한 예시 관찰문은 사람이 미리 작성했습니다. 도움 안내는 보호자가 선택한 변화 기간과 일상 영향에 따라 정해진 문구를 보여줍니다. 그림 특징에서 심리 상태를 계산하거나 진단하지 않습니다. 실제 분석 모델이나 상담사가 개입하지 않았습니다.</p></details>
    </div><aside class="report-side"><div class="guidance-card"><span class="guidance-icon" aria-hidden="true">✳</span><p class="section-kicker">03 — NEXT STEP</p><h2>${guidance.title}</h2><p>${guidance.body}</p><button class="primary-button" type="button" data-action="counsel">상담 준비하기</button></div>
    <div class="side-small"><strong>그림으로 알 수 없는 것</strong><p>감정이나 어려움의 원인은 그림만으로 확인할 수 없습니다. 아이의 말과 생활 모습, 필요할 때 전문가의 평가가 중요합니다.</p></div></aside></div>
    <div class="report-actions"><div>${saved ? `<button class="ghost-button" type="button" data-action="records">기록 목록</button>` : `<button class="ghost-button" type="button" data-action="back">입력 수정</button><button class="ghost-button" type="button" data-action="reset">처음부터</button>`}</div><div><button class="outline-button" type="button" data-action="export">텍스트로 내보내기</button><button class="outline-button" type="button" data-action="print">인쇄하기</button></div></div>
    ${saved ? '' : `<div class="save-box"><div><strong>이 기기에 기록 저장</strong><p>보호자가 입력한 내용과 시연 결과 표시용 정보만 브라우저에 저장합니다. 그림 파일은 저장되지 않으며 다른 기기로 동기화되지 않습니다.</p></div><label><input type="checkbox" data-field="persistOptIn"${check(state.persistOptIn)} /> 저장에 동의합니다</label><button class="primary-button" type="button" data-action="save">기록 저장</button></div>`}
    ${state.error ? `<p class="form-error" role="alert">${esc(state.error)}</p>` : ''}
  </section>`;
}
export function renderRecordList(records, storageError) {
  return `<section class="inner-page list-page" aria-labelledby="page-title"><div class="inner-head"><p class="eyebrow"><span class="eyebrow-line"></span> MY RECORDS</p><h1 id="page-title">내 기록</h1><p>직접 저장을 선택한 시연 결과만 이 기기에 남습니다. 그림 파일은 저장되지 않습니다.</p></div>
    ${storageError ? `<div class="inline-warning" role="alert">${esc(storageError)}<br /><button class="danger-button" type="button" data-action="clear-corrupt">저장 데이터 삭제</button></div>` : ''}
    ${records.length ? `<div class="list-heading"><span>저장된 기록 ${records.length}건</span><button class="danger-button" type="button" data-action="delete-all">모든 기록 삭제</button></div><div class="record-list">${records.map((item) => `<article class="record-item"><div><span class="record-icon" aria-hidden="true">▤</span><div><strong>${esc(item.context.nickname || '이름 없는 기록')}</strong><small>${dateLabel(item.createdAt)} · ${item.mode === 'sample' ? '예시 체험' : '그림 등록'} · 그림 파일 미저장</small></div></div><button class="outline-button" type="button" data-action="open-record" data-id="${esc(item.id)}">살펴보기</button></article>`).join('')}</div>` :
    `<div class="empty-state"><span aria-hidden="true">▤</span><h2>아직 저장된 기록이 없어요</h2><p>시연 결과를 본 뒤 저장을 직접 선택하면 이 기기에서 다시 열 수 있어요.</p><button class="primary-button" type="button" data-action="studio">그림 살펴보기</button></div>`}
  </section>`;
}
