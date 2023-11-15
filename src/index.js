const container = document.querySelector('.js-content');
let player = 'X';
let historyX = [];
let historyO = [];
const wins = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

function createMarkup() {
  let markup = '';
  for (let i = 1; i < 10; i += 1) {
    markup += `<div class="item js-item" data-id=${i}></div>`;
  }
  container.innerHTML = markup;
}
createMarkup();

container.addEventListener('click', onClickBtn);

function onClickBtn(e) {
  const target = e.target;
  if (!target.classList.contains('js-item') || target.textContent) {
    return;
  }

  const id = Number(target.dataset.id);
  let result = false;
  if (player === 'X') {
    historyX.push(id);
    result = isWinner(historyX);
  } else {
    historyO.push(id);
    result = isWinner(historyO);
  }
  target.textContent = player;
  if (result) {
    // console.log(`Winner ${player}`);
    alert(`Winner ${player}`);
    resetGame();
    return;
  } else if (historyO.length + historyX.length === 9) {
    // console.log(`You have drawn`);
    alert(`You have drawn`);
    resetGame();
    return;
  }
  player = player === 'X' ? 'O' : 'X';
}

function isWinner(array) {
  return wins.some(item => item.every(id => array.includes(id)));
}

function resetGame() {
  createMarkup();
  historyO = [];
  historyX = [];
  player = 'X';
}
