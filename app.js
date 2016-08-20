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
}

class Judge {
  // updates the victor status
  update(box) {
    if (!this.victor) { // if victor is undefined means there is no victor yet
      if (box.isOnDownwardDiagonal()) {
      }
      if (box.isOnUpwardDiagonal()) {
      }
      if (box.x === 1) {
      } else if (box.x === 2) {
      } else if (box.x === 3) {
      }
      if (box.x === 1) {
      } else if (box.x === 2) {
      } else if (box.x === 3) {
      }
    }
  }
  
  get victor() {
    return this._victor;
  }
  
  constructor(board) {
    if (!(board instanceof Board)){
      throw new Error("board must be a Board object");
    }
    this._board = board;
    this._victor = undefined;
    
  }
}

class Game {
  constructor() {
    this._board = new Board();
    this._judge = new Judge(this._board);
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
}
