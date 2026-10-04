// Evidence and help resources for the local Mindrawing prototype.
// These views do not interpret an individual child's drawing.

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

const outerStyle = 'padding:24px;font-size:16px;line-height:1.75';
const cardStyle = 'padding:18px;border:1px solid #e7ebf3;border-radius:12px;background:#fff';
const gridStyle = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:14px;margin:18px 0';
const linkStyle = 'color:#244bd5;text-decoration:underline;text-underline-offset:3px';

function externalLink(url, label) {
  return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="${linkStyle}">${label}</a>`;
}

export function renderEvidenceView() {
  return `
    <section class="work-card" style="${outerStyle}" aria-labelledby="evidence-title">
      <p style="font-size:14px;font-weight:700;color:#315bed;margin:0 0 8px">근거와 한계</p>
      <h2 id="evidence-title" style="font-size:26px;line-height:1.35;margin:0 0 12px">그림으로 무엇을 확인할 수 있나요?</h2>
      <p>집·나무·사람 그림은 아이와 보호자가 첫 확인을 시작할 계기가 될 수 있습니다. 현재 연구만으로 한 장의 그림에서 아이의 우울, 불안, 가족관계나 상담 필요성을 판정할 수는 없습니다. 이 목업은 의학적 검사나 진단 결과를 제공하지 않습니다.</p>
      <div style="${gridStyle}">
        <article style="${cardStyle}">
          <h3 style="font-size:18px;line-height:1.45">그림 특징과 심리 상태는 다릅니다</h3>
          <p>2022년 중국 아동·청소년 4,196명 연구에서 AI는 그림의 집·나무·사람은 분류했지만 우울 집단은 구별하지 못했습니다.</p>
          <p style="margin-bottom:0">${externalLink('https://www.sciencedirect.com/science/article/pii/S0001691822002499', 'Lin 등, Acta Psychologica (2022)')}</p>
        </article>
        <article style="${cardStyle}">
          <h3 style="font-size:18px;line-height:1.45">집단 연관성은 개인 진단이 아닙니다</h3>
          <p>2023년 HTP 종합 연구와 2026년 나무 그림 종합 연구는 일부 그림 특징과 임상 집단의 통계적 연관성을 보고했습니다. 연구진도 특징 정의, 문화적 차이, 추가 임상 검증의 필요성을 밝힙니다.</p>
          <p style="margin-bottom:0">${externalLink('https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2022.1041770/full', 'Guo 등, Frontiers in Psychiatry (2023)')}<br>${externalLink('https://onlinelibrary.wiley.com/doi/10.1155/da/9571222', 'Guo 등, Depression and Anxiety (2026)')}</p>
        </article>
        <article style="${cardStyle}">
          <h3 style="font-size:18px;line-height:1.45">그림 데이터의 용도</h3>
          <p>국내 AI-Hub의 7–13세 그림 56,000장은 그림 속 객체 위치를 표시한 학습 자료입니다. 공개 설명은 심리 해석이 포함된 의료 데이터가 아니라고 명시합니다.</p>
          <p style="margin-bottom:0">${externalLink('https://www.aihub.or.kr/aihubdata/data/view.do?aihubDataSe=data&currMenu=&dataSetSn=71399&topMenu=', '고양시·AI-Hub 데이터셋 설명')}</p>
        </article>
        <article style="${cardStyle}">
          <h3 style="font-size:18px;line-height:1.45">AI 설명과 실제 상태는 다릅니다</h3>
          <p>2025년 공개 연구의 AI 결과는 전문가 서술과의 의미 유사도로 평가됐습니다. 아이의 실제 정신건강 상태를 맞히는 정확도로 읽을 수 없습니다.</p>
          <p style="margin-bottom:0">${externalLink('https://arxiv.org/abs/2512.21360', 'Wen 등, arXiv 사전공개 (2025)')}</p>
        </article>
      </div>
      <section style="border-top:1px solid #e7ebf3;padding-top:20px" aria-labelledby="evidence-status">
        <h3 id="evidence-status" style="font-size:18px">이 사이트의 현재 상태</h3>
        <p>지금은 유료 AI API를 연결하지 않은 목업입니다. 이미지 분석, HTP 심리 판독, 의학적 선별을 실행하지 않습니다. 향후 이미지 이해 모델이나 객체 탐지 모델을 검토하더라도, 먼저 실제 아동 그림에서 관찰 정확성을 따로 평가해야 합니다.</p>
        <p style="margin-bottom:0">출처와 상세 검토 내용은 프로젝트의 근거 문서에 기록했습니다. 실제 걱정되는 행동이 몇 주 이상 이어지거나 일상생활에 영향을 주면 전문가와 상의해 주세요. ${externalLink('https://www.nimh.nih.gov/health/topics/child-and-adolescent-mental-health', '미국 국립정신건강연구소의 보호자 안내')}</p>
      </section>
    </section>`;
}

function extractAge(value) {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 7 && value <= 13) return value;
  if (typeof value === 'string' && /^\d{1,3}$/.test(value.trim())) {
    const parsed = Number(value.trim());
    return parsed >= 7 && parsed <= 13 ? parsed : null;
  }
  return null;
}

const regions = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
];

export function renderCounselView(context = {}) {
  const age = extractAge(context && typeof context === 'object' ? context.age : null);
  const show1388 = age === null || age >= 9;
  const ageLabel = age === null
    ? '연령을 확인하지 못했습니다. 1388은 9–24세 청소년과 그 보호자 대상입니다.'
    : `입력한 자녀 나이: ${escapeHtml(age)}세. ${age < 9 ? '7–8세에는 지역 정신건강복지센터와 재학 중인 학교 상담 경로를 먼저 확인해 주세요.' : '9세 이상은 청소년1388도 이용 대상을 확인할 수 있습니다.'}`;
  const regionOptions = regions.map((region) => {
    const query = `${region} 아동 심리 상담`;
    return `<option value="${escapeHtml(query)}">${escapeHtml(region)}</option>`;
  }).join('');

  return `
    <section class="work-card" style="${outerStyle}" aria-labelledby="counsel-title">
      <p style="font-size:14px;font-weight:700;color:#315bed;margin:0 0 8px">전문가 도움 찾기</p>
      <h2 id="counsel-title" style="font-size:26px;line-height:1.35;margin:0 0 12px">보호자가 다음 단계를 선택할 수 있습니다</h2>
      <p>그림 한 장만으로 상담 필요성을 결정하지 마세요. 최근의 행동·기분 변화가 얼마나 이어졌고 가정, 학교, 친구 관계에 어떤 영향을 주는지 함께 살펴보세요. 걱정이 지속되면 아래 공식 경로에서 상담을 요청할 수 있습니다.</p>
      <p style="padding:12px 14px;background:#f1f5ff;border-radius:10px">${ageLabel}</p>
      <div style="${gridStyle}">
        <article style="${cardStyle}">
          <h3 style="font-size:18px;line-height:1.45">지역 정신건강복지센터 찾기</h3>
          <p>국가정신건강정보포털에서 지역과 기관 종류를 선택해 가까운 기관을 찾을 수 있습니다. 아동·청소년 정신건강 지원은 기초센터 사업에 포함됩니다.</p>
          <p style="margin-bottom:0">${externalLink('https://www.mentalhealth.go.kr/portal/health/fac/PotalHealthFacListTab2.do', '공식 기관 검색 열기')}</p>
        </article>
        <article style="${cardStyle}">
          <h3 style="font-size:18px;line-height:1.45">학교 상담과 Wee센터</h3>
          <p>재학 중이라면 학교 상담실이나 교육지원청 Wee센터에 상담 경로를 문의할 수 있습니다.</p>
          <p style="margin-bottom:0">${externalLink('https://wee.go.kr/board?bbsId=BOARD00009&menuId=MENU002060200000000', '위(Wee) 프로젝트 안내 열기')}</p>
        </article>
        ${show1388 ? `<article style="${cardStyle}">
          <h3 style="font-size:18px;line-height:1.45">청소년1388</h3>
          <p>9–24세 청소년과 그 보호자에게 제공되는 상담 채널입니다. 전화 1388과 온라인 상담 안내를 확인할 수 있습니다.</p>
          <p style="margin-bottom:0">${externalLink('https://www.1388.go.kr/occ/YTOSP_SC_OCC_01', '청소년1388 공식 안내 열기')}</p>
        </article>` : ''}
      </div>
      <section style="border-top:1px solid #e7ebf3;padding-top:20px" aria-labelledby="counsel-prep-title">
        <h3 id="counsel-prep-title" style="font-size:18px">상담 전에 정리하면 좋은 것</h3>
        <ul style="padding-left:22px">
          <li>걱정되는 변화가 언제부터, 얼마나 자주 나타났는지</li>
          <li>학교생활·수면·식사·친구 관계 등 일상에서 겪는 어려움</li>
          <li>아이의 말과 보호자가 실제로 본 일을 구분한 메모</li>
        </ul>
        <p>그림은 아이가 원할 때 대화를 시작하는 참고 자료로 가져갈 수 있습니다. 이 목업은 상담을 예약하거나 입력 내용을 기관에 보내지 않습니다.</p>
      </section>
      <section style="border-top:1px solid #e7ebf3;padding-top:20px" aria-labelledby="nearby-title">
        <h3 id="nearby-title" style="font-size:18px">지역 검색</h3>
        <p>공식 기관 검색에서 찾기 어려울 때 참고용으로 사용하세요. 아래 검색은 선택한 지역명과 “아동 심리 상담”이라는 고정 문구만 전송합니다.</p>
        <form action="https://search.naver.com/search.naver" method="get" target="_blank" rel="noopener noreferrer" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
          <label for="counsel-region">지역</label>
          <select id="counsel-region" name="query" style="min-height:44px;padding:8px 12px;border:1px solid #cbd5e5;border-radius:8px;font-size:16px">${regionOptions}</select>
          <button type="submit" style="min-height:44px;padding:8px 16px;border:0;border-radius:8px;background:#315bed;color:#fff;font-size:16px;font-weight:700">네이버에서 검색</button>
        </form>
      </section>
    </section>`;
}
