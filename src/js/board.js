// 카드판 만들기 (카드 HTML 생성 + 섞어서 배치)
window.MG = window.MG || {};

MG.createBoard = function ({ root, pairs, cols, rand }) {
  // 1,1,2,2,3,3 ... 이렇게 값을 두 개씩 만들고
  const values = [];
  for (let v = 1; v <= pairs; v++) {
    values.push(v);
    values.push(v);
  }

  // 섞는다
  const order = MG.shuffle(values, rand);

  // 열 개수는 카드판을 감싸는 .board-area 에 적어야 너비 계산이 맞음
  (root.parentElement || root).style.setProperty('--cols', cols);
  root.style.setProperty('--cols', cols);
  root.innerHTML = '';

  const backImage = MG.cardBackImage();

  const cards = order.map((value) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'card';
    card.dataset.value = String(value);   // ★ 짝 비교는 이 value 로 함

    const inner = document.createElement('span');
    inner.className = 'card-inner';

    const back = document.createElement('span');
    back.className = 'card-face card-back';
    if (backImage) {
      const backImg = document.createElement('img');
      backImg.src = backImage;
      backImg.alt = '';
      backImg.onerror = () => backImg.remove();   // 뒷면 이미지 없으면 CSS 기본 뒷면
      back.appendChild(backImg);
    }

    const front = document.createElement('span');
    front.className = 'card-face card-front';
    const img = document.createElement('img');
    img.src = MG.cardImage(value);
    img.alt = '카드 ' + value;
    img.onerror = () => {                          // 이미지가 아직 없으면 숫자로 보여줌
      img.remove();
      front.textContent = value;
      front.classList.add('no-image');
    };
    front.appendChild(img);

    inner.appendChild(back);
    inner.appendChild(front);
    card.appendChild(inner);
    root.appendChild(card);
    return card;
  });

  return { cards };
};
