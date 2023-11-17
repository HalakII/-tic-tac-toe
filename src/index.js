import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

Notiflix.Notify.init({
  width: '600px',
  position: 'center',
  closeButton: false,
  backOverlay: true,
  cssAnimationDuration: 1000,
});

const container = document.querySelector('.js-content');
const btnRestart = document.querySelector('.btnrestart');
const btnUpdate = document.querySelector('.btnreload');
const currentPlayer = document.querySelector('#curPlyr');
const playerXName = document.querySelector('#playerXName');
const playerOName = document.querySelector('#playerOName');

let player = 'X';
let historyX = [];
let historyO = [];
let gameActive = true;
let stat = {
  X: 0,
  O: 0,
  D: 0,
};
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
playerXName.addEventListener(
  'input',
  debounce(() => console.log(playerXName.value), 1000)
);

playerOName.addEventListener(
  'input',
  debounce(() => console.log(playerOName.value), 1000)
);

function onCellClick(e) {
  if (!gameActive) {
    return;
  }

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
    stat[player] += 1;
    Notiflix.Notify.success(
      `Winner ${player === 'X' ? playerXName.value : playerOName.value}`
    );
    updateStat();
    gameActive = false;
    return;
  } else if (historyO.length + historyX.length === 9) {
    stat.D += 1;
    Notiflix.Notify.info(`You have drawn`);
    updateStat();
    gameActive = false;
    return;
  }
  player = player === 'X' ? 'O' : 'X';
  currentPlayer.innerHTML = player;
  updateStat();
}
function colorWinRow(winRow) {
  if (!winRow) {
    return;
  }
  for (const id of winRow) {
    const winCell = document.querySelector(`.js-item[data-id="${id}"]`);
    winCell.classList.add('winning-cell');
  }
}
function isWinner(array) {
  const winRow = wins.find(item => item.every(id => array.includes(id)));
  return winRow;
}

btnRestart.addEventListener('click', onBtnclick);
function onBtnclick() {
  createMarkup();
  historyO = [];
  historyX = [];
  player = 'X';
  currentPlayer.innerHTML = player;
  gameActive = true;
}

function updateStat() {
  document.querySelector('#sX').innerHTML = stat.X;
  document.querySelector('#sO').innerHTML = stat.O;
  document.querySelector('#sD').innerHTML = stat.D;
}
btnUpdate.addEventListener('click', onBtnUpclick);
function onBtnUpclick() {
  onBtnclick();
  playerXName.value = '';
  playerOName.value = '';
  stat = { X: 0, O: 0, D: 0 };
  updateStat();
}
