class Box {
  constructor(x, y) {
    this._x = x;
    this._y = y;
    this._state = EmptyBoxState.instance();
  }
  get x() {
    return this._x;
  }
  set x(x) {
    this._x = x;
  }
  get y() {
    return this._y;
  }
  set y(y) {
    this._y = y;
  }
  get state() {
    return this._state;
  }
  set state(state) {
    this._state = state;
  }
  fillX() {
    this._state.fillX();
  }
  fill0() {
    this._state.fillO();
  }
}

class BoxState {
}
class EmptyBoxState extends BoxState {
  constructor(box) {
    super();
    if (box == null) {
      throw new Error("box cannot be undefined");
    }
    this._box = box;
  }
  static instance() {
    if (this._inst == null) {
      this._inst = new EmptyBoxState();
    }
    return this._inst;
  }
  fillX() {
    this._box.state(XBoxState.instance());
  }
  fill0() {
    this._box.state(OBoxState.instance());
  }
}
class XBoxState extends BoxState {
  constructor(box) {
    super();
    if (box == null) {
      throw new Error("box cannot be undefined");
    }
    this._box = box;
  }
  static instance() {
    if (this._inst == null) {
      this._inst = new XBoxState();
    }
    return this._inst;
  }
  fillX() {
    throw new Error("Box already filled");
  }
  fill0() {
    throw new Error("Box already filled");
  }
}
class OBoxState extends BoxState {
  constructor(box) {
    super();
    if (box == null) {
      throw new Error("box cannot be undefined");
    }
    this._box = box;
  }
  static instance() {
    if (this._inst == null) {
      this._inst = new OBoxState();
    }
    return this._inst;
  }
  fillX() {
    throw new Error("Box already filled");
  }
  fill0() {
    throw new Error("Box already filled");
  }
}

class Board {
  constructor() {
    let boxes = new Array(3); // boxes is a 3 by 3 grid
    for (let i = 1; i <= 3; i++) {
      boxes[i] = new Array(3);
      for (let j = 1; j <= 3; j++) {
        let box = new Box(i, j);
        boxes[i][j] = box;
      }
    }
    this._boxes = boxes;
  }
  
  getBoxByPosition(x, y){
    return this._boxes[x][y];
  }
}

class Judge {
  // updates the victor status
  update(box) {
    if (!(box instanceof Box)) {
      throw new Error("Argument must be a box.");
    }
    if (!this.victor) { // if victor is undefined means there is no victor yet
      if (box.isOnDownwardDiagonal()) {
      }
      if (box.isOnUpwardDiagonal()) {
      }
      _checkColumn(box.x());
      _checkRow(box.y());
    }
  }
  _checkRow(row) {
    let b = this._game.board;
    if (
        b.box(1, row).state() === b.box(2, row).state()
        && b.box(1, row).state() === b.box(3,row).state()
    ) {
      this._victor = this._game.playerByBoxValue(b.box(1, row).state());
      notifyVictorChanged();
    }
  }
  _checkColumn(col) {
    let b = this._game.board;
    if (
        b.box(col, 1).state() === b.box(col, 2).state()
        && b.box(col, 1).state() === b.box(col,3).state()
    ) {
      this._victor = this._game.playerByBoxValue(b.box(col, 1).state());
      notifyVictorChanged();
    }
  }
  get victor() {
    return this._victor;
  }
  subscribeVictorChanged(cb) {
    if (typeof cb !== "function") {
      throw new Error("cb must be a Function object");
    }
    this._victorChangedSubscribers.push(cb);
  }
  unsubscribeVictorChanged(cb) {
    let array = this._victorChangedSubscribers;
    for (var i = array.length-1; i >= 0; i--) {
      if (array[i] === search_term) {
          array.splice(i, 1);
      }
    }
    this._victorChangedSubscribers = array;
  }
  notifyVictorChanged(cb) {
    this._victorChangedSubscribers.forEach(cb => {
      cb(this);
    });
  }
  
  constructor(game) {
    if (!(game instanceof Game)) {
      throw new Error("game must be a Game object");
    }
    this._game = game;
    this._victor = undefined;
    
  }
}

class Player {
  constructor() {
  }
  set boxValue(boxValue) {
    this._boxValue = boxValue;
  }
  get boxValue() {
    return this._boxValue;
  }
}

class Game {
  constructor() {
    this._board = new Board();
    this._judge = new Judge(this._board);
    this._players = [new Player(1), new Player(2)];
  }
  get board() {
    return this._board;
  }
  set board(board) {
    this._board = board;
  }
  get judge() {
    return this._judge;
  }
  set judge(judge) {
    this._judge = judge;
  }
  getPlayerByID(id){
    return this._player[id];
  }
  getPlayerByBoxValue(boxValue){
    let p = undefined;
    this._players.forEach((el, i) => {
      if (this._player[i].boxValue === boxValue) {
          p = this._player[i];
      }
    });
    return p;
  }
}
