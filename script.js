const gameContainer = document.querySelector('.game-container');
const gameCardsContainer = document.querySelector('.game-cards');
const currentScoreElement = document.querySelector('.current-score');
const highestScoreElement = document.querySelector('.highest-score');
const resetButtonelement = document.querySelector('.reset-button');
const completeTextElement = document.querySelector('.congrats-text');

const defaultBackgroundColor = '#5D5A58';
const gameCompletedText = 'CONGRATULATIONS, YOU HAVE FINISHED THE GAME!!';
const reachedHigestScoreText = 'CONGRATULATIONS, NEW BEST SCORE!! '
const minimumMoves = 9;
let currentScore, completedColors, randomColors, shuffledColors, firstColor, secondColor, firstElement;

let highestScore = parseInt(localStorage.getItem('highestScore'));
let highestScoreText = `Highest Score: ${highestScore}`

//when DOM loads
loadGame();

resetButtonelement.addEventListener('click', () => {
  resetGame();
  loadGame();
});

function loadGame() {
  completedColors = 0;
  currentScore = 0;
  firstColor = '';
  secondColor = '';
  randomColors = [];
  shuffledColors = [];

  for (let i = 0; i < minimumMoves;) {
    const newRandomColor = genarateRandomColors();
    if (randomColors.indexOf(newRandomColor) === -1) {
      randomColors[i] = randomColors[minimumMoves * 2 - (i + 1)] = newRandomColor;
      i++;
    }
  }
  shuffledColors = shuffle(randomColors);
  createDivsForColors(shuffledColors);
  highestScoreElement.innerText = highestScoreText;
  currentScoreElement.innerText = `Current Score: ${currentScore}`;
}

function resetGame() {
  let existingCards = gameCardsContainer.children;
  for (let i = existingCards.length - 1; i >= 0; i--) {
    existingCards[i].remove();
  }
  completeTextElement.innerText = '';
}

function genarateRandomColors() {
  return '#' + Math.random().toString(16).substr(2, 6);
}

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement('div');
    newDiv.style.backgroundColor = defaultBackgroundColor;
    newDiv.dataset.color = color;
    newDiv.dataset.clicked = 'false';
    newDiv.dataset.matched = 'false';

    newDiv.addEventListener('click', onClickEvent);
    newDiv.addEventListener('mouseleave', onMouseleaveEvent);

    gameCardsContainer.append(newDiv);
  }
}

function onClickEvent(event) {
  const clickedElement = event.target;

  if (clickedElement.dataset.clicked === 'false') {
    flipElement(clickedElement);
    clickedElement.style.backgroundColor = clickedElement.dataset.color;
    currentScore++;
    currentScoreElement.innerText = `Current Score: ${currentScore}`;
    clickedElement.dataset.clicked = 'true';

    if (!firstColor) {
      firstColor = clickedElement.dataset.color;
      firstElement = clickedElement;
    }
    else if (!secondColor) {
      secondColor = clickedElement.dataset.color;
    }

    if (firstColor && secondColor) {
      if (firstColor === secondColor) {
        firstElement.dataset.matched = 'true';
        clickedElement.dataset.matched = 'true';
        firstColor = secondColor = '';
        completedColors++;

        if (completedColors === minimumMoves) {
          highestScore = !!highestScore ? ((highestScore > currentScore) ? currentScore : highestScore) : currentScore;
          completeTextElement.innerText = highestScore == currentScore ? reachedHigestScoreText : gameCompletedText;
          highestScoreText = `Highest Score: ${highestScore}`;
          highestScoreElement.innerText = highestScoreText;
          localStorage.setItem('highestScore', highestScore);
        }
      }
      else {
        clickedElement.dataset.clicked = 'false';
        firstElement.dataset.clicked = 'false';
      }
    }
  }
}

function onMouseleaveEvent(event) {
  const eventElement = event.target;

  if (!!secondColor && eventElement.dataset.matched === 'false') {
    firstColor = secondColor = '';
    firstElement.style.backgroundColor = defaultBackgroundColor;
    eventElement.style.backgroundColor = defaultBackgroundColor;
  }
}

function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

function flipElement(element) {
  element.classList.toggle('rotate');
  setTimeout(() => {
    element.classList.toggle('rotate')
  }, 500);
}


