
class Box {
  constructor(x, y) {
    this._x = x;
    this._y = y;
    this._state = new EmptyBoxState(this);
    this._stateChangedSubscribers = [];
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
    this.notifyStateChanged();
  }
  fillO() {
    this._state.fillO();
    this.notifyStateChanged();
  }
  // x and y are increasing towards downright
  // so when x = y, it's on the downward diagonal
  isOnDownwardDiagonal(){
    return this.x === this.y;
  }
  isOnUpwardDiagonal(){
    return (4 - this.x) === this.y;
  }
  subscribeStateChanged(cb) {
    if (typeof cb !== "function") {
      throw new Error("cb must be a Function object");
    }
    this._stateChangedSubscribers.push(cb);
  }
  unsubscribeStateChanged(cb) {
    let array = this._stateChangedSubscribers;
    for (var i = array.length - 1; i >= 0; i--) {
      if (array[i] === cb) {
        array.splice(i, 1);
      }
    }
    this._stateChangedSubscribers = array;
  }
  notifyStateChanged() {
    this._stateChangedSubscribers.forEach(cb => {
      cb(this);
    });
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
  fillX() {
    this._box.state = new XBoxState(this._box);
  }
  fillO() {
    this._box.state = new OBoxState(this._box);
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
  fillX() {
    throw new Error("Box already filled");
  }
  fillO() {
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
  fillX() {
    throw new Error("Box already filled");
  }
  fillO() {
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

  box(x, y) {
    return this._boxes[x][y];
  }
}

class Judge {
  constructor(game) {
    if (!(game instanceof Game)) {
      throw new Error("game must be a Game object");
    }
    this._game = game;
    this._victor = undefined;
    this._victorChangedSubscribers = [];
    for (var i = 1; i <= 3; i++) {
      for (var j = 1; j <= 3; j++) {
        this._game.board.box(i, j)
            .subscribeStateChanged(this.update.bind(this));
      }
    }
  }
  get victor() {
    return this._victor;
  }
  // updates the victor status
  update(box) {
    if (!(box instanceof Box)) {
      throw new Error("Argument must be a box.");
    }
    if (!(this.victor)) { // if victor is undefined means there is no victor yet
      if (box.isOnDownwardDiagonal()) {
        this._checkDownwardDiagonal();
      }
      if (box.isOnUpwardDiagonal()) {
        this._checkUpwardDiagonal();
      }
      this._checkColumn(box.x);
      this._checkRow(box.y);
    }
  }
  _checkRow(row) {
    let b = this._game.board;
    let proto1 = Object.getPrototypeOf(b.box(1, row).state);
    let proto2 = Object.getPrototypeOf(b.box(2, row).state);
    let proto3 = Object.getPrototypeOf(b.box(3, row).state);
    if (
        proto1 === proto2
        && proto1 === proto3
    ) {
      this._victor = this._game.getPlayerByBoxValue(b.box(1, row).state);
      this.notifyVictorChanged();
    }
  }
  _checkColumn(col) {
    let b = this._game.board;
    let proto1 = Object.getPrototypeOf(b.box(col, 1).state);
    let proto2 = Object.getPrototypeOf(b.box(col, 2).state);
    let proto3 = Object.getPrototypeOf(b.box(col, 3).state);
    if (
        proto1 === proto2
        && proto1 === proto3
    ) {
      this._victor = this._game.getPlayerByBoxValue(b.box(col, 1).state);
      this.notifyVictorChanged();
    }
  }
  _checkDownwardDiagonal() {
    let b = this._game.board;
    let proto1 = Object.getPrototypeOf(b.box(1, 1).state);
    let proto2 = Object.getPrototypeOf(b.box(2, 2).state);
    let proto3 = Object.getPrototypeOf(b.box(3, 3).state);
    if (
        proto1 === proto2
        && proto1 === proto3
    ) {
      this._victor = this._game.getPlayerByBoxValue(b.box(1, 1).state);
      this.notifyVictorChanged();
    }
  }
  _checkUpwardDiagonal() {
    let b = this._game.board;
    let proto1 = Object.getPrototypeOf(b.box(3, 1).state);
    let proto2 = Object.getPrototypeOf(b.box(2, 2).state);
    let proto3 = Object.getPrototypeOf(b.box(1, 3).state);
    if (
        proto1 === proto2
        && proto1 === proto3
    ) {
      this._victor = this._game.getPlayerByBoxValue(b.box(3, 1).state);
      this.notifyVictorChanged();
    }
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
  notifyVictorChanged() {
    this._victorChangedSubscribers.forEach(cb => {
      cb(this);
    });
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
    this._judge = new Judge(this);
    // skip 0 because players are 1-based rather than 0-based
    this._players = [,new Player(1), new Player(2)];
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
    return this._players[id];
  }
  getPlayerByBoxValue(boxValue){
    let p = undefined;
    this._players.forEach((el, i) => {
      if (
        Object.getPrototypeOf(this._players[i].boxValue)
        === Object.getPrototypeOf(boxValue)
      ) {
        p = this._players[i];
      }
    });
    return p;
  }
}


module.exports = {
  Box,
  EmptyBoxState,
  XBoxState,
  OBoxState,
  Board,
  Judge,
  Player,
  Game
}