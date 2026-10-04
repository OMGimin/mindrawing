export const KINDS = ['house', 'tree', 'person'];
export const LABELS = { house: '집', tree: '나무', person: '사람' };
export const MAX_FILE_SIZE = 8 * 1024 * 1024;
export const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
export const STORAGE_KEY = 'mindrawing-demo-records-v1';

export function validateImage(file) {
  if (!file) return '파일을 선택해 주세요.';
  if (!ACCEPTED_TYPES.has(file.type)) return 'JPG, PNG, WEBP 이미지 파일을 선택해 주세요.';
  if (!Number.isFinite(file.size) || file.size <= 0) return '빈 파일은 등록할 수 없습니다. 다른 이미지를 선택해 주세요.';
  if (file.size > MAX_FILE_SIZE) return '그림 한 장은 8MB 이하여야 합니다.';
  return '';
}

export function guidanceFor({ duration, impact }) {
  if (duration === 'weeks' || impact === 'noticeable') {
    return {
      title: '전문가와 함께 살펴볼 때일 수 있어요',
      body: '보호자가 적은 변화의 지속 기간이나 일상 영향을 바탕으로 드리는 일반적인 안내입니다. 그림으로 판단한 결과가 아닙니다. 지역 정신건강복지센터나 학교 상담 경로에 현재 관찰한 상황을 문의해 보세요.'
    };
  }
  if (duration === 'recent' || impact === 'some') {
    return {
      title: '며칠간의 변화를 함께 살펴보세요',
      body: '보호자가 적은 내용을 날짜와 상황 중심으로 간단히 기록하면 상담할 때 도움이 됩니다. 걱정이 이어지거나 일상에 영향을 준다면 전문가에게 문의해 보세요.'
    };
  }
  return {
    title: '아이의 일상을 조금 더 살펴보세요',
    body: '아직 지속 기간과 일상 영향을 알 수 없어 판단을 보류합니다. 아이가 말하는 어려움과 보호자가 보는 변화를 함께 확인하고, 걱정이 계속된다면 전문가와 상의해 보세요.'
  };
}

export function recordFromState(state, now = new Date()) {
  return {
    id: globalThis.crypto?.randomUUID?.() || `${now.getTime()}-${Math.random().toString(36).slice(2)}`,
    version: 1,
    createdAt: now.toISOString(),
    mode: state.sample ? 'sample' : 'upload',
    context: {
      nickname: String(state.context.nickname || '').slice(0, 20),
      age: String(state.context.age || ''),
      concerns: [...state.context.concerns],
      duration: state.context.duration || '',
      impact: state.context.impact || '',
      note: String(state.context.note || '').slice(0, 500)
    }
  };
}

export function readRecords(storage) {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error('저장된 기록의 형식을 읽을 수 없습니다.');
  for (const record of parsed) {
    const c = record?.context;
    const valid = record?.version === 1 && typeof record.id === 'string' && record.id.length > 0
      && typeof record.createdAt === 'string' && Number.isFinite(Date.parse(record.createdAt))
      && (record.mode === 'sample' || record.mode === 'upload')
      && c && typeof c === 'object' && !Array.isArray(c)
      && typeof c.nickname === 'string' && c.nickname.length <= 20
      && typeof c.note === 'string' && c.note.length <= 500
      && (c.age === '' || (typeof c.age === 'string' && /^(7|8|9|10|11|12|13)$/.test(c.age)))
      && Array.isArray(c.concerns) && c.concerns.every((item) => typeof item === 'string' && item.length <= 30)
      && ['', 'recent', 'weeks', 'unsure'].includes(c.duration)
      && ['', 'none', 'some', 'noticeable', 'unsure'].includes(c.impact);
    if (!valid) throw new Error('저장된 기록의 형식을 읽을 수 없습니다.');
  }
  return parsed;
}

export function writeRecords(storage, records) {
  storage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function reportText(record) {
  const c = record.context;
  const guidance = guidanceFor(c);
  const lines = [
    '마인드로잉 시연 결과 · 실제 AI 분석 아님',
    `작성일: ${new Date(record.createdAt).toLocaleString('ko-KR')}`,
    '그림: 시연용 예시 관찰만 제공. 등록한 그림 파일은 분석하거나 기록에 저장하지 않음.',
    `호칭: ${c.nickname || '입력하지 않음'}`,
    `나이: ${c.age ? `${c.age}세` : '입력하지 않음'}`,
    `관심 주제: ${c.concerns.length ? c.concerns.join(', ') : '선택하지 않음'}`,
    `변화 기간: ${durationLabel(c.duration)}`,
    `일상 영향: ${impactLabel(c.impact)}`,
    `보호자 메모: ${c.note || '입력하지 않음'}`,
    '',
    `${guidance.title}: ${guidance.body}`,
    '상담기관 검색: https://www.mentalhealth.go.kr/portal/health/fac/PotalHealthFacListTab2.do',
    '이 문서는 진단서가 아니며, 상담기관 이용 가능 여부를 보장하지 않습니다.'
  ];
  return lines.join('\n');
}

export function durationLabel(value) {
  return ({ recent: '최근 시작됨', weeks: '몇 주 이상 이어짐', unsure: '잘 모르겠음' })[value] || '선택하지 않음';
}

export function impactLabel(value) {
  return ({ none: '아직 눈에 띄지 않음', some: '조금 달라짐', noticeable: '생활에 영향이 있음', unsure: '잘 모르겠음' })[value] || '선택하지 않음';
}
