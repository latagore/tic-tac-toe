
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
  constructor(game) {
    this._game = game;
  }
  
  chooseBox(x, y){
    if ((typeof x !== "number") || (typeof y !== "number")) {
      throw new TypeError("x and y must be a number");
    }
    
    // checks whether this player is the active one
    this._checkTurn();
          
    if (Object.getPrototypeOf(this._boxValue) === XBoxState) {
      this._board.box(x, y).fillX();
    } else if (Object.getPrototypeOf(this._boxValue) === OBoxState) {
      this._board.box(x, y).fillO();
    } else {
      throw new Error("Unknown player box value");
    }
    this._game.nextTurn();
  }
  
  // throws Error if it's not this players turn
  _checkTurn(x, y){
    if (this._game.getActivePlayer() !== this){
      throw new Error("Not active player");
    }
  }
  
  set boxValue(boxValue) {
    this._boxValue = boxValue;
  }
  get boxValue() {
    return this._boxValue;
  }
  set game(game) {
    this._game = game;
  }
  get game() {
    return this._game;
  }
}

class Game {
  constructor() {
    this._board = new Board();
    this._judge = new Judge(this);
    // skip 0 because players are 1-based rather than 0-based
    this._players = [,new Player(1), new Player(2)];
    this._currentPlayer = this._players[1];
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
  get currentPlayer() {
    return this._currentPlayer;
  }
  set currentPlayer(playerID){
    if (playerID !== 1 && playerID !== 2) {
      throw new Error("PlayerID must be 1 or 2");
    }
    this._currentPlayer = players[playerID];
  }
  
  nextTurn() {
    if (this._currentPlayer === this._players[1]) {
      this._currentPlayer = this._players[2];
    } else if (this._currentPlayer === this._players[2]) {
      this._currentPlayer = this._players[1];
    } else {
      throw new Error("No current player");
    }
  }
}

class AI {
  // generateSequence()
}
class RandomAI extends AI {
  constructor(board, player){
    super();
    if (!(board instanceof Board)) {
      throw new TypeError("board must be a Board");
    }
    if (!(player instanceof Player)) {
      throw new TypeError("player must be a Player");
    }
    this._board = board;
    this._player = player;
  }
  get board(){
    return this._board;
  }
  set board(board) {
    this._board = board;
  }
  get player(){
    return this._player;
  }
  set player(player){
    this._player = player;
  }
  
  makeNextMove() {
    // check that the board isn't completely filled
    let hasEmpty = false;
    for (let i = 1; i <= 3; i++) {
      for (let j = 1; j <= 3; j++) {
        hasEmpty = hasEmpty || 
          Object.getPrototypeOf(this._board.box(i, j).state) === EmptyBoxState;
      }
    }
    // no more valid moves to make, so don't do anything
    if (!hasEmpty){
      return;
    }
    
    // if no more moves in the stack, regenerate the next moves
    if (!this._state){
      this.generate();
    }
    // get some index from the permutation
    let i = this._state.pop();
    // and convert it into a location on the board
    let x = i / 3;
    let y = i % 3;
    
    try {
      this._player.chooseBox(x, y);
    } catch (e) {
      if (e.message === "Box already filled") {
        // this box was already filled, so try making the next move
        makeNextMove();
      } else {
        throw e;
      }
    }
  }
  
  _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
 
  generate() {
    this._state = [];
    // initialize state
    for (var i = 0; i < 9; i++) {
      this._state[i] = i+1;
    }
    // shuffle state into a random permutation using
    // Fisher-Yates shuffle
    for (var i = 0; i < 9-1; i++) {
      var swap = this._state[i];
      var randomIndex = _getRandomInt(i, 8);
      this._state[i] = this._state[randomIndex];
      this._state[randomIndex] = swap;
    }
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
  Game,
  AI,
  RandomAI
}