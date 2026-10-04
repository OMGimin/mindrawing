// Fixed teaching copy for the synthetic sample. Uploaded drawings are never interpreted.
export const INTERPRETATION_VERSION = '2026-10-04';
export const htpReview = {
  label: 'Guo 등, Frontiers in Psychiatry (2023) — HTP 종합 연구',
  url: 'https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2022.1041770/full'
};

export const interpretation = {
  house: {
    label: '집',
    headline: '집은 가족과 생활 공간을 떠올리게 해요',
    summary: 'HTP 해석에서 집은 가족, 집에서의 생활, 가까운 관계를 이야기할 때 쓰입니다. 이 예시의 문과 창문은 주변 사람이나 바깥세상과 관계 맺는 주제를 떠올리게 해요.',
    cards: [
      {
        title: '집이 나타내는 이야기',
        observation: '지붕이 있는 집 한 채가 그려져 있습니다.',
        meaning: '집은 아이가 사는 공간과 가족 관계를 떠올리는 소재로 해석해 왔어요.',
        alternatives: '익숙한 집 모양이나 그리기 과제를 따라 표현했을 수도 있습니다.'
      },
      {
        title: '문과 창문',
        observation: '빨간 문 하나와 파란 창문 두 개가 보입니다.',
        meaning: '문과 창문은 집 안과 밖이 만나는 곳이라, 주변 사람이나 바깥세상과 관계 맺는 주제로 설명해 왔어요. 문이나 창문이 있다고 아이가 사교적이라는 뜻은 아닙니다.',
        alternatives: '문과 창문의 수나 색은 실제로 본 집, 좋아하는 색, 그림 도구에 따라 달라질 수 있습니다.'
      }
    ]
  },
  tree: {
    label: '나무',
    headline: '큰 나무는 활력이 넉넉하게 표현된 모습으로 읽어 왔어요',
    summary: 'HTP 해석에서 나무는 성장과 활력을 떠올리는 소재예요. 활력은 움직이고 활동할 때의 힘과 에너지를 말합니다. 문헌에서 큰 나무에 부여한 방향은 그 힘이 넉넉하게 표현됐다는 쪽입니다. 활력을 더 바란다는 해석을 제시한 것은 아닙니다. 실제 아이가 왜 크게 그렸는지는 알 수 없습니다.',
    cards: [
      {
        title: '크게 펼쳐진 나무',
        observation: '나무가 그림 영역에서 비교적 크고, 윗부분이 넓게 펼쳐져 있습니다.',
        meaning: '전통적인 HTP 해석은 큰 나무를 성장하는 힘과 풍부한 활력의 표현에 연결합니다. 이 표현에서 사교성, 성취, 실제 아이의 에너지 수준이나 자신감을 알아낼 수는 없습니다.',
        alternatives: '종이 여백을 채우거나 평소 좋아하는 나무 모습을 그렸을 수도 있습니다.',
        comparison: '문헌에는 아주 작은 나무를 외로움이나 자신감 부족에 연결한 설명도 있습니다. 이 예시의 나무에는 해당하지 않으며, 작은 나무를 그린 개인에게 그대로 적용할 수 없습니다.'
      }
    ]
  },
  person: {
    label: '사람',
    headline: '사람 그림은 자기 모습을 이야기하는 소재예요',
    summary: 'HTP에서 사람 그림은 자신을 어떤 모습으로 떠올리는지 이야기하는 소재입니다. 이 예시 인물이 아이 자신인지는 알 수 없고, 웃는 표정은 그려진 인물의 표정이에요.',
    cards: [
      {
        title: '그려진 인물',
        observation: '사람 한 명이 두 팔을 양옆으로 펼치고 있습니다.',
        meaning: '사람 그림은 자신을 어떤 모습으로 떠올리는지 이야기할 단서가 될 수 있어요.',
        alternatives: '인사하거나 움직이는 장면을 그렸을 수도 있습니다.'
      },
      {
        title: '웃는 얼굴',
        observation: '눈과 웃는 모양의 입이 보입니다.',
        meaning: '이 미소는 그림 속 인물이 웃고 있다는 표현입니다. 실제 아이가 행복하다는 증거로 옮겨 읽을 수는 없습니다.',
        alternatives: '익숙한 캐릭터 표정이나 사람을 그리는 습관일 수 있습니다.'
      }
    ]
  }
};

export function interpretationText(kind) {
  const entry = interpretation[kind];
  return [
    `${entry.label} 그림 — 시연용 합성 그림의 고정 예시 (설명 ${INTERPRETATION_VERSION})`,
    entry.headline,
    entry.summary,
    ...entry.cards.flatMap((card) => [
      `• ${card.title}`,
      `  보이는 모습: ${card.observation}`,
      `  전통적 의미와 범위: ${card.meaning}`,
      `  다른 설명: ${card.alternatives}`,
      ...(card.comparison ? [`  비교 설명(이 예시에 해당 없음): ${card.comparison}`] : [])
    ]),
    `근거: ${htpReview.label} — ${htpReview.url}`
  ].join('\n');
}
