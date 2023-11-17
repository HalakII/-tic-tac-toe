import Notiflix from 'notiflix';

Notiflix.Notify.init({
  width: '600px',
  position: 'center',
  closeButton: true,
  backOverlay: true,
});

const container = document.querySelector('.js-content');
const btnRestart = document.querySelector('.btnrestart');
const currentPlayer = document.querySelector('#curPlyr');
console.log(currentPlayer);

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

container.addEventListener('click', onCellClick);

function onCellClick(e) {
  const target = e.target;
  if (!target.classList.contains('js-item') || target.textContent) {
    return;
  }

  const id = Number(target.dataset.id);
  let result = false;
  let winRow = [];
  if (player === 'X') {
    historyX.push(id);
    result = isWinner(historyX);
    winRow = result;
  } else {
    historyO.push(id);
    result = isWinner(historyO);
    winRow = result;
  }
  target.textContent = player;
  if (result) {
    colorWinRow(winRow);
    Notiflix.Notify.success(`Winner ${player}`);

    return;
  } else if (historyO.length + historyX.length === 9) {
    Notiflix.Notify.info(`You have drawn`);
    return;
  }
  player = player === 'X' ? 'O' : 'X';
  currentPlayer.innerHTML = player;
}
function colorWinRow(winRow) {
  if (!winRow) {
    return;
  }
  for (const id of winRow) {
    const winCell = document.querySelector(`.js-item[data-id="${id}"]`);
    winCell.classList.add('winning-cell');
    console.log(winCell);
  }
}
function isWinner(array) {
  const winRow = wins.find(item => item.every(id => array.includes(id)));
  //   console.log(winRow);
  return winRow;
}

btnRestart.addEventListener('click', onBtnclick);
function onBtnclick() {
  createMarkup();
  historyO = [];
  historyX = [];
  player = 'X';
}
