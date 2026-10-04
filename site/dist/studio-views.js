import { KINDS, LABELS, durationLabel, impactLabel } from './logic.js';
import { interpretation, INTERPRETATION_VERSION, htpReview } from './interpretation-content.js';

const concerns = ['수면', '학교생활', '친구관계', '감정 변화', '가족과의 시간', '그 밖의 변화'];
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
const sel = (value, current) => value === current ? ' selected' : '';
const check = (value) => value ? ' checked' : '';
const dateLabel = (value) => new Date(value).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });
function interpretationCards(kind) {
  return interpretation[kind].cards.map((card) => `<article class="interpretation-card">
    <h4>${esc(card.title)}</h4>
    <p class="visible-feature">${esc(card.observation)}</p>
    <p class="plain-meaning">${esc(card.meaning)}</p>
  </article>`).join('');
}
function stepper(active) {
  return `<ol class="stepper" aria-label="진행 단계">
    <li class="${active === 1 ? 'current' : active > 1 ? 'completed' : ''}" ${active === 1 ? 'aria-current="step"' : ''}><span>01</span> 그림 등록</li>
    <li class="${active === 2 ? 'current' : active > 2 ? 'completed' : ''}" ${active === 2 ? 'aria-current="step"' : ''}><span>02</span> 시연 안내</li>
    <li class="${active === 3 ? 'current' : ''}" ${active === 3 ? 'aria-current="step"' : ''}><span>03</span> 그림의 의미</li>
  </ol>`;
}
const option = (value, label, current) => `<option value="${value}"${sel(value, current)}>${label}</option>`;
export function renderObservation(state) {
  const c = state.context;
  return `<section class="inner-page" aria-labelledby="page-title">
    <div class="inner-head"><p class="eyebrow"><span class="eyebrow-line"></span> 그림의 의미 보기</p><h1 id="page-title">시연 결과를 보기 전에</h1><p>결과에 나타나는 설명은 시연용 합성 그림에 미리 작성된 예시입니다.</p></div>
    <div class="work-card observation-card"><div class="work-heading"><div><p class="section-kicker">02 — DEMO</p><h2>시연 안내 확인</h2></div><span class="step-label">2 / 3 단계</span></div>
    ${stepper(2)}
    <label class="consent-box"><input type="checkbox" name="consent" data-field="consent"${check(state.consent)} /><span><strong>시연 결과임을 확인했어요</strong><small>등록한 그림은 미리보기로만 보여 주며 분석하지 않습니다. 아래 의미 설명은 합성 예시 그림에 고정된 내용입니다.</small></span></label>
    <details class="optional-context"><summary>기록할 메모가 있나요? <small>선택 사항</small></summary><p>메모는 그림 해석에 사용되지 않으며, 직접 저장할 때에만 이 기기의 기록에 남습니다.</p>
    <div class="form-grid"><label class="field"><span>아이를 부를 이름 <small>선택</small></span><input type="text" name="nickname" data-field="nickname" maxlength="20" autocomplete="off" placeholder="예: 우리 아이, 민이" value="${esc(c.nickname)}" /><small>실명 대신 별명이나 호칭을 사용해 주세요.</small></label>
    <label class="field"><span>나이 <small>선택 · 7–13세</small></span><select name="age" data-field="age"><option value="">선택하지 않음</option>${Array.from({length: 7}, (_, i) => option(String(i + 7), String(i + 7) + '세', c.age)).join('')}</select></label></div>
    <fieldset class="field-set"><legend>요즘 관심이 가는 변화 <small>선택</small></legend><div class="chip-row">${concerns.map((item) => `<button type="button" class="chip ${c.concerns.includes(item) ? 'selected' : ''}" data-action="concern" data-value="${item}" aria-pressed="${c.concerns.includes(item)}">${item}</button>`).join('')}</div></fieldset>
    <div class="form-grid"><label class="field"><span>변화가 이어진 기간 <small>선택</small></span><select name="duration" data-field="duration"><option value="">선택하지 않음</option>${option('recent', '최근 시작됨', c.duration)}${option('weeks', '몇 주 이상 이어짐', c.duration)}${option('unsure', '잘 모르겠음', c.duration)}</select></label>
    <label class="field"><span>가정·학교·친구 관계에서의 영향 <small>선택</small></span><select name="impact" data-field="impact"><option value="">선택하지 않음</option>${option('none', '아직 눈에 띄지 않음', c.impact)}${option('some', '조금 달라짐', c.impact)}${option('noticeable', '생활에 영향이 있음', c.impact)}${option('unsure', '잘 모르겠음', c.impact)}</select></label></div>
    <label class="field note-field"><span>추가로 기억하고 싶은 모습 <small>선택</small></span><textarea name="note" data-field="note" maxlength="500" rows="4" placeholder="예: 최근에 아이가 들려준 그림 이야기">${esc(c.note)}</textarea><small>민감한 정보나 실명은 적지 않는 편이 좋습니다. 최대 500자.</small></label></details>
    <div class="work-footer"><p>집·나무·사람 예시에서 보이는 모습과 전통적 의미를 살펴봅니다.</p><div class="footer-actions"><button class="ghost-button" type="button" data-action="back">그림 등록으로</button><button class="primary-button" type="button" data-action="submit">그림의 의미 보기</button></div></div>
    ${state.error ? `<p class="form-error" role="alert">${esc(state.error)}</p>` : ''}</div>
  </section>`;
}
export function renderPreparing() {
  return `<section class="inner-page preparing" aria-labelledby="page-title"><div class="preparing-mark" aria-hidden="true">✳</div><p class="section-kicker">DEMO PREVIEW</p><h1 id="page-title">그림 예시를 열고 있어요</h1><p>합성 그림에 미리 작성된 의미 설명을 불러오고 있습니다.</p><div class="preparing-bar" aria-hidden="true"><span></span></div></section>`;
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
  const image = !saved && !state.sample && state.uploads[kind];
  const hasContext = Boolean(record.context.nickname || record.context.age || record.context.concerns.length || record.context.duration || record.context.impact || record.context.note);
  return `<section class="inner-page report-page" aria-labelledby="page-title">
    <div class="report-top"><div><p class="eyebrow"><span class="eyebrow-line"></span> 그림의 의미</p><h1 id="page-title">이 그림에서 어떤 이야기를 읽을까요?</h1><p>집·나무·사람 예시의 모습과 그에 연결해 온 의미를 살펴보세요.</p></div><span class="report-date">${dateLabel(record.createdAt)}</span></div>
    <div class="demo-notice"><strong>시연용 합성 그림의 고정 설명입니다</strong><p>등록한 그림은 미리보기로만 표시하며 분석하지 않습니다. 이 설명으로 아이의 실제 성격이나 상태를 판단할 수 없습니다.${saved ? ' 저장 기록을 다시 열면 현재 버전의 설명이 표시됩니다.' : ''}</p></div>
    ${stepper(3)}
    <div class="meaning-overview" aria-label="그림별 의미 한눈에 보기">${KINDS.map((k) => `<button class="meaning-overview-item" type="button" data-action="tab" data-kind="${k}"><span>${LABELS[k]} 그림</span><strong>${esc(interpretation[k].headline)}</strong></button>`).join('')}</div>
    <div class="report-grid"><div class="report-main">
      <section class="report-panel"><div class="panel-title"><div><p class="section-kicker">DRAWING MEANINGS</p><h2>예시 그림에서 보이는 의미</h2></div><span class="small-tag">합성 그림 예시</span></div>
        <div class="tab-row" role="tablist" aria-label="그림 종류">${KINDS.map((k) => `<button type="button" role="tab" id="drawing-tab-${k}" aria-controls="drawing-panel" tabindex="${kind === k ? 0 : -1}" data-action="tab" data-kind="${k}" aria-selected="${kind === k}" class="${kind === k ? 'active' : ''}">${LABELS[k]} 그림</button>`).join('')}</div>
        <div class="example-layout" id="drawing-panel" role="tabpanel" aria-labelledby="drawing-tab-${kind}" tabindex="0">
          <div class="art-column ${image || (saved && record.mode === 'upload') ? 'with-upload' : 'sample-only'}">${image ? `<div class="real-preview"><img src="${image.url}" alt="등록한 ${LABELS[kind]} 그림 미리보기" /><span>등록한 그림 미리보기 · 분석되지 않음</span></div>` : (saved && record.mode === 'upload' ? `<div class="missing-preview">등록한 그림의 미리보기는 기록에 저장되지 않습니다.</div>` : '')}
            <div class="synthetic-preview"><div class="sample-slice ${kind}" role="img" aria-label="시연용 합성 ${LABELS[kind]} 그림"></div><span>시연용 합성 그림 · 실제 아이 그림 아님</span></div></div>
          <div class="example-copy"><h3 class="meaning-headline">${esc(interpretation[kind].headline)}</h3><p class="meaning-summary">${esc(interpretation[kind].summary)}</p>
            <div class="interpretation-list">${interpretationCards(kind)}</div></div>
        </div>
        <details class="source-details"><summary>근거 자세히 보기</summary><p>이 예시는 HTP 문헌에 소개된 상징 설명을 사람이 합성 그림에 맞춰 작성했습니다. 문헌의 집단별 특징이나 전통적 상징 설명은 개인의 상태를 검증한 측정값이 아닙니다.</p><ul>${interpretation[kind].cards.map((card) => `<li><strong>${esc(card.title)}:</strong> ${esc(card.alternatives)}${card.comparison ? ` ${esc(card.comparison)}` : ''}</li>`).join('')}</ul><p><a href="${esc(htpReview.url)}" target="_blank" rel="noopener noreferrer">${esc(htpReview.label)}</a> · 참고 설명 ${INTERPRETATION_VERSION}</p></details>
      </section>
      ${hasContext ? `<details class="source-details optional-context"><summary>저장한 메모 보기</summary>${contextList(record.context)}</details>` : ''}
    </div></div>
    <div class="report-actions"><div>${saved ? `<button class="ghost-button" type="button" data-action="records">기록 목록</button>` : `<button class="ghost-button" type="button" data-action="back">안내·메모 수정</button><button class="ghost-button" type="button" data-action="reset">처음부터</button>`}</div><div><button class="outline-button" type="button" data-action="export">텍스트로 내보내기</button><button class="outline-button" type="button" data-action="print">현재 그림 탭 인쇄</button></div></div>
    ${saved ? '' : `<div class="save-box"><div><strong>이 기기에 기록 저장</strong><p>보호자가 입력한 내용과 시연 결과 표시용 정보만 브라우저에 저장합니다. 그림 파일은 저장되지 않으며 다른 기기로 동기화되지 않습니다.</p></div><label><input type="checkbox" name="persistOptIn" data-field="persistOptIn"${check(state.persistOptIn)} /> 저장에 동의합니다</label><button class="primary-button" type="button" data-action="save">기록 저장</button></div>`}
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
