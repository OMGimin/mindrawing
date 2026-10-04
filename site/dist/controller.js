import { KINDS, LABELS, validateImage, recordFromState, readRecords, writeRecords, reportText, durationLabel, impactLabel, STORAGE_KEY } from './logic.js';
import { esc, renderObservation, renderPreparing, renderReport, renderRecordList, contextList } from './studio-views.js';
import { renderEvidenceView, renderCounselView } from './reference-views.js';

const main = document.querySelector('#main-content');
const initialStudio = main.innerHTML;
const navLabels = { studio: '그림 살펴보기', records: '내 기록', counsel: '상담 연결', evidence: '근거와 한계' };
const state = {
  view: 'studio', step: 1, sample: false,
  uploads: { house: null, tree: null, person: null },
  context: { nickname: '', age: '', concerns: [], duration: '', impact: '', note: '' },
  consent: false, persistOptIn: false, record: null, selectedRecordId: null,
  activeKind: 'house', error: '', preparing: false, storageError: '', counselContext: null
};
let statusTimer;
const uploadRequests = { house: 0, tree: 0, person: 0 };
function invalidateUploads() {
  for (const kind of KINDS) uploadRequests[kind]++;
}
function announce(message) {
  const target = document.querySelector('#app-status');
  clearTimeout(statusTimer);
  target.textContent = message;
  target.hidden = false;
  statusTimer = setTimeout(() => { target.hidden = true; }, 5000);
}
function focusHeading() {
  requestAnimationFrame(() => {
    const heading = main.querySelector('#page-title, h1, h2');
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    window.scrollTo(0, 0);
  });
}
function getRecords() {
  try { state.storageError = ''; return readRecords(localStorage); }
  catch { state.storageError = '저장된 기록을 읽을 수 없습니다. 저장 공간 설정이나 데이터 형식을 확인해 주세요. 기존 데이터는 변경하지 않았습니다.'; return []; }
}
function syncUploads() {
  for (const kind of KINDS) {
    const item = state.uploads[kind];
    if (!item) continue;
    const card = main.querySelector('.upload-card[data-kind="' + kind + '"]');
    if (!card) continue;
    const target = card.querySelector('.drop-target');
    target.textContent = '';
    card.classList.add('has-image');
    const image = document.createElement('img');
    image.className = 'upload-preview';
    image.src = item.url;
    image.alt = LABELS[kind] + ' 그림 미리보기';
    target.append(image);
    const tools = document.createElement('div');
    tools.className = 'preview-tools';
    const filename = document.createElement('span');
    filename.className = 'preview-name';
    filename.textContent = item.name;
    tools.append(filename);
    const replace = document.createElement('label');
    replace.className = 'replace-button';
    replace.textContent = '교체';
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg,image/png,image/webp';
    fileInput.dataset.file = kind;
    replace.append(fileInput);
    tools.append(replace);
    const remove = document.createElement('button');
    remove.className = 'remove-button';
    remove.type = 'button';
    remove.dataset.action = 'remove-file';
    remove.dataset.kind = kind;
    remove.textContent = '삭제';
    tools.append(remove);
    target.append(tools);
  }
}
function render() {
  if (state.view === 'studio') {
    main.innerHTML = state.preparing ? renderPreparing() : state.step === 1 ? initialStudio : state.step === 2 ? renderObservation(state) : renderReport(state, state.record);
    if (state.step === 1 && !state.preparing) {
      syncUploads();
      const error = main.querySelector('#upload-error');
      error.textContent = state.error;
      error.hidden = !state.error;
    }
  } else if (state.view === 'records') {
    const records = getRecords();
    const chosen = records.find((item) => item.id === state.selectedRecordId);
    main.innerHTML = chosen
      ? renderReport(state, chosen, true) + '<div class="record-delete"><button class="danger-button" type="button" data-action="delete-record" data-id="' + esc(chosen.id) + '">이 기록 삭제</button></div>'
      : renderRecordList(records, state.storageError);
  } else if (state.view === 'counsel') {
    main.innerHTML = renderCounselView(state.counselContext || state.record?.context || state.context) + renderConsultSummary();
  } else {
    main.innerHTML = renderEvidenceView();
  }
  document.querySelectorAll('.nav-link').forEach((button) => {
    const active = button.dataset.view === state.view;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  document.querySelector('.breadcrumbs strong').textContent = navLabels[state.view];
  document.title = navLabels[state.view] + ' · 마인드로잉';
}
function navigate(view) {
  if (view !== 'studio' || state.step !== 1) invalidateUploads();
  state.view = view;
  if (view !== 'records') state.selectedRecordId = null;
  state.error = '';
  history.replaceState(null, '', '#' + view);
  render();
  focusHeading();
}
function showError(message) {
  state.error = message;
  render();
  announce(message);
}
async function decodeFile(file) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight) throw new Error('invalid image');
    return url;
  } catch {
    URL.revokeObjectURL(url);
    throw new Error('이미지를 열 수 없습니다. 다른 JPG, PNG, WEBP 파일을 선택해 주세요.');
  }
}
async function setFile(kind, file) {
  if (!KINDS.includes(kind) || state.view !== 'studio' || state.step !== 1) return;
  const request = ++uploadRequests[kind];
  const problem = validateImage(file);
  if (problem) return showError(problem);
  let url;
  try { url = await decodeFile(file); }
  catch (error) {
    if (request === uploadRequests[kind] && state.view === 'studio' && state.step === 1) showError(error.message);
    return;
  }
  if (request !== uploadRequests[kind] || state.view !== 'studio' || state.step !== 1) {
    URL.revokeObjectURL(url);
    return;
  }
  if (state.uploads[kind]?.url) URL.revokeObjectURL(state.uploads[kind].url);
  state.uploads[kind] = { url, name: file.name };
  state.sample = false;
  state.error = '';
  render();
  announce(LABELS[kind] + ' 그림을 등록했습니다.');
}
function openDemoSample() {
  invalidateUploads();
  state.sample = true;
  state.step = 2;
  state.error = '';
  navigate('studio');
}
function resetDraft() {
  invalidateUploads();
  for (const kind of KINDS) {
    if (state.uploads[kind]?.url) URL.revokeObjectURL(state.uploads[kind].url);
    state.uploads[kind] = null;
  }
  state.sample = false;
  state.step = 1;
  state.context = { nickname: '', age: '', concerns: [], duration: '', impact: '', note: '' };
  state.consent = false;
  state.persistOptIn = false;
  state.record = null;
  state.counselContext = null;
  state.error = '';
  navigate('studio');
}
function renderConsultSummary() {
  const c = state.counselContext || state.record?.context || state.context;
  return `<section class="work-card consult-summary" aria-labelledby="summary-title" style="margin-top:16px"><p class="section-kicker">CONSULTATION NOTES</p><h2 id="summary-title">상담 전에 가져갈 메모</h2><p style="font-size:12px;color:#7c89a0">아래에는 보호자가 직접 입력한 내용만 표시됩니다. 상담기관에 자동으로 전송되지 않습니다.</p>${contextList(c)}<button class="outline-button" type="button" data-action="copy-summary" style="margin-top:16px">요약 복사하기</button></section>`;
}
function persist(action, message) {
  try {
    action();
    state.error = '';
    render();
    announce(message);
  } catch {
    showError('이 기기의 기록을 저장하거나 삭제할 수 없습니다. 기존 기록은 변경하지 않았습니다. 브라우저 저장 공간을 확인해 주세요.');
  }
}
function selectedRecord() {
  if (state.view !== 'records') return state.record;
  return getRecords().find((record) => record.id === state.selectedRecordId);
}
function prepareCounselContext() {
  if (state.view === 'records' && state.selectedRecordId) {
    state.counselContext = selectedRecord()?.context || null;
  } else if (state.view === 'studio' && state.step === 3 && state.record) {
    state.counselContext = state.record.context;
  } else {
    state.counselContext = state.context;
  }
}
function exportRecord(record) {
  const blob = new Blob([reportText(record)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'mindrawing-demo-' + record.createdAt.slice(0, 10) + '.txt';
  anchor.style.display = 'none';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
async function copySummary() {
  const c = state.counselContext || state.record?.context || state.context;
  const content = [
    '상담 준비 메모 · 마인드로잉 시연',
    '아이 호칭: ' + (c.nickname || '미입력'),
    '나이: ' + (c.age ? c.age + '세' : '미입력'),
    '관심 주제: ' + (c.concerns.join(', ') || '미선택'),
    '변화 기간: ' + durationLabel(c.duration),
    '일상 영향: ' + impactLabel(c.impact),
    '보호자 메모: ' + (c.note || '미입력'),
    '시연용 예시 관찰은 실제 아이 그림 분석이 아닙니다.'
  ].join('\n');
  try { await navigator.clipboard.writeText(content); announce('상담 준비 메모를 복사했습니다.'); }
  catch { announce('복사할 수 없습니다. 브라우저의 클립보드 권한을 확인해 주세요.'); }
}
function handleAction(button) {
  const action = button.dataset.action;
  if (action === 'sample') return openDemoSample();
  if (action === 'next') {
    if (!KINDS.every((kind) => state.uploads[kind])) return showError('집, 나무, 사람 그림을 모두 등록하거나 예시로 체험해 주세요.');
    invalidateUploads();
    state.step = 2; state.error = ''; render(); focusHeading(); return;
  }
  if (action === 'remove-file') {
    const kind = button.dataset.kind;
    if (!KINDS.includes(kind)) return;
    uploadRequests[kind]++;
    if (state.uploads[kind]?.url) URL.revokeObjectURL(state.uploads[kind].url);
    state.uploads[kind] = null;
    state.error = '';
    render();
    announce(LABELS[kind] + ' 그림을 삭제했습니다.');
    return;
  }
  if (action === 'back') {
    state.step = state.step === 3 ? 2 : 1;
    state.error = ''; render(); focusHeading(); return;
  }
  if (action === 'concern') {
    const value = button.dataset.value;
    const items = state.context.concerns;
    state.context.concerns = items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
    render();
    const next = [...main.querySelectorAll('[data-action="concern"]')].find((item) => item.dataset.value === value);
    next?.focus();
    return;
  }
  if (action === 'submit') {
    if (!state.consent) return showError('시연 결과 안내를 확인해 주세요.');
    state.error = ''; state.preparing = true; render(); focusHeading();
    setTimeout(() => {
      if (!state.preparing) return;
      state.record = recordFromState(state);
      state.preparing = false; state.step = 3; state.activeKind = 'house';
      render(); focusHeading();
    }, 800);
    return;
  }
  if (action === 'tab') {
    state.activeKind = button.dataset.kind;
    render();
    main.querySelector('[data-action="tab"][data-kind="' + state.activeKind + '"]')?.focus();
    return;
  }
  if (action === 'counsel') { prepareCounselContext(); return navigate('counsel'); }
  if (action === 'studio') return navigate('studio');
  if (action === 'records') { state.selectedRecordId = null; return navigate('records'); }
  if (action === 'reset') {
    if (window.confirm('현재 입력과 그림 미리보기를 지우고 처음부터 시작할까요?')) resetDraft();
    return;
  }
  if (action === 'save') {
    if (!state.persistOptIn) return showError('이 기기에 기록 저장 동의를 선택해 주세요.');
    persist(() => {
      const records = readRecords(localStorage);
      if (!records.some((record) => record.id === state.record.id)) {
        records.unshift(state.record);
        writeRecords(localStorage, records);
      }
    }, '이 기기에 기록을 저장했습니다.');
    return;
  }
  if (action === 'open-record') {
    state.selectedRecordId = button.dataset.id;
    state.activeKind = 'house'; state.error = ''; render(); focusHeading(); return;
  }
  if (action === 'delete-record') {
    if (!window.confirm('이 기록을 이 기기에서 삭제할까요? 삭제 후 복원할 수 없습니다.')) return;
    persist(() => {
      writeRecords(localStorage, readRecords(localStorage).filter((record) => record.id !== button.dataset.id));
      state.selectedRecordId = null;
      state.counselContext = null;
    }, '기록을 삭제했습니다.');
    return;
  }
  if (action === 'delete-all') {
    if (!window.confirm('저장된 모든 마인드로잉 기록을 이 기기에서 삭제할까요? 삭제 후 복원할 수 없습니다.')) return;
    persist(() => { localStorage.removeItem(STORAGE_KEY); state.counselContext = null; }, '모든 기록을 삭제했습니다.');
    return;
  }
  if (action === 'clear-corrupt') {
    if (!window.confirm('읽을 수 없는 저장 데이터를 삭제할까요? 삭제 후 복원할 수 없습니다.')) return;
    persist(() => { localStorage.removeItem(STORAGE_KEY); state.counselContext = null; }, '저장 데이터를 삭제했습니다.');
    return;
  }
  if (action === 'export') {
    const record = selectedRecord();
    if (record) exportRecord(record);
    return;
  }
  if (action === 'print') { window.print(); return; }
  if (action === 'copy-summary') { copySummary(); return; }
}
main.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (button) handleAction(button);
});
main.addEventListener('keydown', (event) => {
  const tab = event.target.closest('[data-action="tab"]');
  if (!tab || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const index = KINDS.indexOf(tab.dataset.kind);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? KINDS.length - 1
    : (index + (event.key === 'ArrowRight' ? 1 : -1) + KINDS.length) % KINDS.length;
  main.querySelector('[data-action="tab"][data-kind="' + KINDS[next] + '"]')?.click();
});
main.addEventListener('change', (event) => {
  const input = event.target;
  if (input.matches('[data-file]')) {
    if (input.files[0]) setFile(input.dataset.file, input.files[0]);
    return;
  }
  if (!input.matches('[data-field]')) return;
  const field = input.dataset.field;
  if (field === 'consent') state.consent = input.checked;
  else if (field === 'persistOptIn') state.persistOptIn = input.checked;
  else state.context[field] = input.value;
  state.error = '';
});
main.addEventListener('input', (event) => {
  const field = event.target.dataset.field;
  if (field === 'nickname' || field === 'note') state.context[field] = event.target.value;
});
main.addEventListener('dragover', (event) => {
  const card = event.target.closest('.upload-card');
  if (!card) return;
  event.preventDefault();
  card.classList.add('dragging');
});
main.addEventListener('dragleave', (event) => {
  const card = event.target.closest('.upload-card');
  if (card && !card.contains(event.relatedTarget)) card.classList.remove('dragging');
});
main.addEventListener('drop', (event) => {
  const card = event.target.closest('.upload-card');
  if (!card) return;
  event.preventDefault();
  card.classList.remove('dragging');
  setFile(card.dataset.kind, event.dataTransfer.files[0]);
});
document.querySelectorAll('.nav-link').forEach((button) => button.addEventListener('click', () => {
  if (button.dataset.view === 'counsel') prepareCounselContext();
  navigate(button.dataset.view);
}));
document.querySelector('.brand').addEventListener('click', (event) => { event.preventDefault(); navigate('studio'); });
window.addEventListener('hashchange', () => {
  const target = location.hash.slice(1);
  if (navLabels[target]) {
    if (target === 'counsel') prepareCounselContext();
    navigate(target);
  }
});
const privacy = document.querySelector('#privacy-dialog');
document.querySelector('#privacy-open').addEventListener('click', () => privacy.showModal());
document.querySelector('#privacy-close').addEventListener('click', () => privacy.close());
document.querySelector('#privacy-done').addEventListener('click', () => privacy.close());
privacy.addEventListener('click', (event) => { if (event.target === privacy) privacy.close(); });
if (navLabels[location.hash.slice(1)]) state.view = location.hash.slice(1);
render();

// Optional browser agent tools operate on the same visible state and do not expose child images or notes.
if (document.modelContext?.registerTool) {
  const registrations = [];
  const inputSchema = { type: 'object', properties: {}, additionalProperties: false };
  function validateInput(input) {
    if (input != null && (typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length)) {
      throw new TypeError('This tool accepts no arguments.');
    }
  }
  try {
    registrations.push(document.modelContext.registerTool({
      name: 'read_demo_state',
      description: 'Read the current Mindrawing demo view and progress without accessing drawings or private notes.',
      inputSchema,
      execute: async (input, { signal } = {}) => {
        validateInput(input);
        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
        return { content: [{ type: 'text', text: JSON.stringify({ view: state.view, step: state.step, sample: state.sample, hasReport: Boolean(state.record) }) }] };
      }
    }));
    registrations.push(document.modelContext.registerTool({
      name: 'open_demo_sample',
      description: 'Open the visible synthetic sample flow in the Mindrawing demo.',
      inputSchema,
      execute: async (input, { signal } = {}) => {
        validateInput(input);
        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
        openDemoSample();
        return { content: [{ type: 'text', text: 'Synthetic sample opened at the parent observation step.' }] };
      }
    }));
    window.addEventListener('pagehide', () => registrations.forEach((registration) => registration?.unregister?.()), { once: true });
  } catch (error) {
    console.info('Optional browser tools unavailable:', error);
  }
}
