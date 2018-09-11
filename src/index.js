const defaultSettings = {
  boardSize: {
    horizontal: 10,
    vertical: 10
  },
  tileSize: {
    horizontal: 40,
    vertical: 40
  }
};

let state = {
  board: [],
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

const setState = newState => {
  state = { ...state, ...newState };
  render(state.board, defaultSettings);
};

const createGameBoard = settings => {
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

const render = (board, settings) => {
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
  let newLocation = [];
  switch (direction) {
    case "up":
      newLocation = [x - 1, y];
      break;
    case "down":
      newLocation = [x + 1, y];
      break;
    case "left":
      newLocation = [x, y - 1];
      break;
    case "right":
      newLocation = [x, y + 1];
      break;
    default:
      newLocation = [0, 0];
      break;
  }

  const isOff = isOutOfBounds(newLocation);
  if (isOff) {
    console.log("out of bounds");
    return false;
  }

  setState({
    [actor]: {
      tile: {
        x: newLocation[0],
        y: newLocation[1]
      }
    }
  });
};

/**
 *
 */
const main = (customSettings = {}) => {
  const settings = { ...defaultSettings, ...customSettings };
  state.board = createGameBoard(settings);
  render(state.board, settings);
  move("right", "hero");
};

main();
