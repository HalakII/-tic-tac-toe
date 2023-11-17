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
const currentPlayer = document.querySelector('#curPlyr');
const playerXName = document.querySelector('#playerXName');
const playerOName = document.querySelector('#playerOName');

let player = 'X';
let historyX = [];
let historyO = [];
let stat = JSON.parse(localStorage.getItem('gameStat')) || { x: 0, o: 0, d: 0 };

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
playerXName.addEventListener('input', debounce(handleInputChange, 1000));
playerOName.addEventListener('input', debounce(handleInputChange, 1000));

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
    stat.x += 1;
  } else {
    historyO.push(id);
    result = isWinner(historyO);
    winRow = result;
    stat.o += 1;
  }
  target.textContent = player;
  if (result) {
    colorWinRow(winRow);

    // const winPlayer = playerXName.player || playerOName.player;
    Notiflix.Notify.success(`Winner ${player}`);

    saveStatToLocalStorage();
    return;
  } else if (historyO.length + historyX.length === 9) {
    stat.d += 1;
    Notiflix.Notify.info(`You have drawn`);
    saveStatToLocalStorage();
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
}
function handleInputChange() {
  const playerNameX = playerXName.value || 'Player X';
  const playerNameO = playerOName.value || 'Player O';
  console.log('Player X:', playerNameX);
  console.log('Player O:', playerNameO);
}

handleInputChange();

function updateStat() {
  const countX = document.querySelector('#sX');
  const countO = document.querySelector('#sO');
  const countD = document.querySelector('#sD');
  countX.textContent = stat.x;
  countO.textContent = stat.o;
  countD.textContent = stat.d;
}
function saveStatToLocalStorage() {
  localStorage.setItem('gameStat', JSON.stringify(stat));
  updateStat();
}
