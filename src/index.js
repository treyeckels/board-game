const defaultSettings = {
  boardSize: {
    horizontal: 10,
    vertical: 10
  },
  tileSize: {
    horizontal: 50,
    vertical: 50
  }
};

let settings = {};

let state = {
  board: [],
  hasWon: false,
  hasLost: false,
  actors: {
    hero: {
      tile: {
        x: 0,
        y: 0
      }
    },
    monster: {
      tile: {
        x: 2,
        y: 2
      }
    },
    treasure: {
      tile: {
        x: 5,
        y: 5
      }
    }
  }
};

const setStateLocation = (location, actor) => {
  state.actors[actor].tile.x = location[0];
  state.actors[actor].tile.y = location[1];
  render(state.board, defaultSettings);
};

const createGameBoard = () => {
  const board = [];
  let i = 0;

  while (i < settings.boardSize.horizontal) {
    const row = [];
    let j = 0;
    while (j < settings.boardSize.vertical) {
      row.push(j);
      j++;
    }
    board.push(row);
    i++;
  }
  return board;
};

const getActiveTiles = (rowIndex, columnIndex) => {
  let classList = "";
  Object.keys(state.actors).forEach(key => {
    if (
      state.actors[key].tile.x === rowIndex &&
      state.actors[key].tile.y === columnIndex
    ) {
      classList = `${classList} ${key}-active`;
    }
  });

  return classList;
};

const isOutOfBounds = newLocation => {
  const board = state.board;
  const row = newLocation[0];
  const column = newLocation[1];
  if (board[row] === void 0) {
    return true;
  }

  if (board[row][column] === void 0) {
    return true;
  }

  return false;
};

const move = (direction, actor) => {
  const x = state.actors[actor].tile.x;
  const y = state.actors[actor].tile.y;
  console.log(x, y);
  let newLocation = [];
  switch (direction) {
    case "ArrowUp":
      newLocation = [x - 1, y];
      break;
    case "ArrowDown":
      newLocation = [x + 1, y];
      break;
    case "ArrowLeft":
      newLocation = [x, y - 1];
      break;
    case "ArrowRight":
      newLocation = [x, y + 1];
      break;
    default:
      newLocation = [0, 0];
      break;
  }

  const isOff = isOutOfBounds(newLocation);
  if (!isOff) {
    setStateLocation(newLocation, actor);
  }
};

const render = () => {
  const board = state.board;
  const width = settings.boardSize.horizontal * settings.tileSize.horizontal;
  const height = settings.boardSize.vertical * settings.tileSize.vertical;
  const boardMarkup = `
    <div style="width: ${width}; height: ${height}" id="board"></div>
  `;
  document.body.innerHTML = boardMarkup;
  const boardEle = document.querySelector("#board");

  board.forEach((row, rowIndex) => {
    const rowEle = document.createElement("div");
    rowEle.className = "row";
    const isInRow = state.actors.hero.tile.x === rowIndex;
    row.forEach((column, columnIndex) => {
      const activeTiles = getActiveTiles(rowIndex, columnIndex);
      const boardtile = document.createElement("div");
      boardtile.style.width = settings.tileSize.horizontal;
      boardtile.style.height = settings.tileSize.vertical;
      boardtile.className = `tile ${activeTiles}`;
      rowEle.appendChild(boardtile);
    });
    boardEle.append(rowEle);
  });
};

const endGame = () => {
  const endScreen = document.createElement("div");
  endScreen.className = "cover";
  document.body.appendChild(endScreen);
  document.body.removeEventListener("keydown", handleKeyboardInteraction);
  const context = state.hasWon ? "won" : "lost";
  const endText = `You ${context}!`;
  const textColor = state.hasWon ? "green" : "red";
  const graphEleMarkup = `<p style="color: ${textColor};">${endText}</p>`;
  endScreen.innerHTML = graphEleMarkup;
};

const handleKeyboardInteraction = evt => {
  if (state.hasWon || state.hasLost) {
    endGame();
  } else {
    move(evt.key, "hero");
  }
};

/**
 *
 */
const main = (customSettings = {}) => {
  settings = { ...defaultSettings, ...customSettings };
  state.board = createGameBoard();
  render();
  document.body.addEventListener("keydown", handleKeyboardInteraction);
};

main();
