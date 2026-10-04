// This fixed teaching example is never derived from a visitor's uploaded image.
// A saved record stores context only; opening it shows this current reference copy.
export const INTERPRETATION_VERSION = '2026-10-04';
const htpReview = {
  label: 'Guo 등, Frontiers in Psychiatry (2023) — HTP 종합 연구',
  url: 'https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2022.1041770/full'
};

export const interpretation = {
  house: {
    label: '집',
    summary: '이 예시에서는 문과 창문이 있는 집을 볼 수 있습니다. 집을 가족·생활환경 이야기의 출발점으로 삼는 전통은 있지만, 이 특징만으로 실제 아이의 가족관계나 대인관계를 판단할 수 없습니다.',
    cards: [
      {
        title: '문과 창문',
        observation: '빨간 문 하나와 파란 창문 두 개가 보입니다.',
        reading: 'HTP 문헌에서는 문과 창문을 바깥과의 접촉을 떠올리게 하는 상징으로 다뤄 왔습니다. 문·창문의 유무나 수에서 사교성 또는 관계 상태를 거꾸로 추론할 수는 없습니다.',
        alternatives: '색이나 수는 좋아하는 색, 그림 도구, 따라 그린 집의 모습에서 나왔을 수도 있습니다.',
        question: '이 집에는 누가 살고 있고, 문을 열면 무엇이 보일까?',
        sources: [htpReview]
      },
      {
        title: '지붕과 아래 선',
        observation: '지붕이 넓게 그려졌고 집 아래에는 초록색 선이 있습니다.',
        reading: 'HTP에서 집은 가족, 생활환경, 관계를 이야기할 때 쓰이는 소재입니다. 이 집의 지붕 크기나 밑선에 고정된 심리적 의미가 있다고 볼 근거는 없습니다.',
        alternatives: '화면을 채우는 방식은 종이 모양이나 그리기 순서에 따라서도 달라집니다.',
        question: '이 집은 어떤 곳에 있니?',
        sources: [htpReview]
      }
    ]
  },
  tree: {
    label: '나무',
    summary: '이 예시 나무의 넓은 수관은 HTP의 성장·활력 상징을 설명하기 좋은 관찰점입니다. 큰 나무를 활력과 연결하는 전통적 해석은 참고 이야기일 뿐, 그림 크기만으로 실제 아이의 활력이나 자신감을 판단할 수 없습니다.',
    cards: [
      {
        title: '나무의 크기와 자리',
        observation: '나무가 그림 영역에서 비교적 크게 그려졌고, 윗부분이 넓게 펼쳐져 있습니다.',
        reading: 'HTP 문헌은 나무를 성장 경험과 활력을 떠올리는 상징으로, 큰 나무를 활력과 연결해 설명해 왔습니다. 이 합성 예시의 수관은 넓게 표현되어 있지만 아이의 심리 상태를 뜻하지 않습니다.',
        comparison: '아주 작은 나무를 위축이나 자신감 부족과 연결하는 설명도 있습니다. 비교용 일반 설명이며, 이 합성 예시에는 해당하지 않습니다.',
        alternatives: '나무를 크게 또는 작게 그리는 이유에는 종이 여백, 그림 과제 이해, 손의 움직임, 좋아하는 나무의 모습이 모두 있을 수 있습니다.',
        question: '이 나무는 실제로 얼마나 클까? 옆에는 무엇이 있을까?',
        sources: [htpReview]
      },
      {
        title: '줄기와 가지',
        observation: '갈색 줄기에서 가지가 여러 갈래로 갈라지고, 아래에 풀이 보입니다.',
        reading: 'HTP 문헌에서는 나무가 성장 경험을 떠올리는 소재입니다. 이 예시에서 보이는 줄기의 갈래와 풀만으로 특정 심리적 의미를 정할 수 없습니다.',
        alternatives: '가지와 풀은 관찰한 자연 풍경이나 미술 시간에 익힌 표현일 수도 있습니다.',
        question: '이 나무는 어디에서 자라고 있니?',
        sources: [htpReview]
      }
    ]
  },
  person: {
    label: '사람',
    summary: '사람 그림은 자기상에 관해 대화할 출발점이 될 수 있습니다. 이 예시 인물이 실제 아이 자신인지도 정해져 있지 않으므로, 웃는 얼굴이나 팔 자세를 아이의 기분으로 옮겨 읽지 않습니다.',
    cards: [
      {
        title: '팔과 자세',
        observation: '두 팔이 양옆으로 펼쳐져 있습니다.',
        reading: 'HTP에서는 사람 그림을 자기상을 탐색하는 소재로 사용해 왔습니다. 팔을 벌린 자세 하나로 성격이나 현재 기분을 결정할 수는 없습니다.',
        alternatives: '자세는 달리기, 인사하기, 사람을 그리는 습관처럼 여러 이야기를 나타낼 수 있습니다.',
        question: '이 사람은 지금 무엇을 하고 있니?',
        sources: [htpReview]
      },
      {
        title: '얼굴과 옷',
        observation: '눈과 웃는 모양의 입, 파란 상의와 빨간 하의가 보입니다.',
        reading: 'HTP에서는 사람 그림으로 자기상에 관한 이야기를 시작하기도 합니다. 이 예시의 미소는 그려진 인물의 표현이며 실제 아이의 기분과 같다고 볼 수 없습니다.',
        alternatives: '표정과 옷 색은 캐릭터, 좋아하는 옷, 손에 잡힌 색연필의 영향일 수 있습니다.',
        question: '이 사람은 누구이고, 지금 어떤 말을 하고 싶을까?',
        sources: [htpReview]
      }
    ]
  }
};

export function interpretationText(kind) {
  const entry = interpretation[kind];
  return [
    `${entry.label} 그림 — 시연용 합성 그림에 대한 고정 예시 (해석 문구 ${INTERPRETATION_VERSION})`,
    ...entry.cards.flatMap((card) => [
      `• ${card.title}`,
      `  관찰: ${card.observation}`,
      ...(card.reading ? [`  문헌 속 해석: ${card.reading}`] : []),
      ...(card.comparison ? [`  비교 설명: ${card.comparison}`] : []),
      `  다른 설명: ${card.alternatives}`,
      `  아이에게 물어볼 말: ${card.question}`,
      ...card.sources.map((source) => `  출처: ${source.label} — ${source.url}`)
    ]),
    `함께 정리하면: ${entry.summary}`
  ].join('\n');
}
