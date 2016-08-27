var expect    = require("chai").expect;
var app = require("../app");

describe("Tic Tac Toe", function() {
  describe("Boxes", function() {
    it("should transition to filled states", function() {
      var box = new app.Box(1, 1);
      expect(box.state).to.be.an.instanceof(app.EmptyBoxState);
      box.fillX();
      expect(box.state).to.be.an.instanceof(app.XBoxState);
      
      box = new app.Box(1,2);
      expect(box.state).to.be.an.instanceof(app.EmptyBoxState);
      box.fillO();
      expect(box.state).to.be.an.instanceof(app.OBoxState);
    });
    
    it("should not transition from filled to other states", function() {
      var box = new app.Box(1, 1);
      expect(box.state).to.be.an.instanceof(app.EmptyBoxState);
      box.fillX();
      expect(box.state).to.be.an.instanceof(app.XBoxState);
      expect(box.fillX).to.throw(Error);
      expect(box.fillO).to.throw(Error);
      expect(box.state).to.be.an.instanceof(app.XBoxState);
      
      box = new app.Box(1, 2);
      expect(box.state).to.be.an.instanceof(app.EmptyBoxState);
      box.fillO();
      expect(box.state).to.be.an.instanceof(app.OBoxState);
      expect(box.fillX).to.throw(Error);
      expect(box.fillO).to.throw(Error);
      expect(box.state).to.be.an.instanceof(app.OBoxState);
    });
    
    it("should show diagonal status when on diagonal", function () {
      var box = new app.Box(3, 3);
      expect(box.isOnDownwardDiagonal()).is.true;
      
      box = new app.Box(2, 2);
      expect(box.isOnUpwardDiagonal()).is.true;
    });
    
    it("should show not-diagonal status when not on diagonal", function () {
      var box = new app.Box(3, 1);
      expect(box.isOnDownwardDiagonal()).is.false;
      
      box = new app.Box(2, 1);
      expect(box.isOnUpwardDiagonal()).is.false;
    });
  });
  
  describe("Boards", function() {
    it("should have a 3 by 3 grid of boxes", function() {
      var board = new app.Board();
      
      // explicitly list all 3x3 grid positions
      // because a for loop isn't much simpler
      expect(board.box(1,1)).to.be.an.instanceof(app.Box);
      expect(board.box(1,2)).to.be.an.instanceof(app.Box);
      expect(board.box(1,3)).to.be.an.instanceof(app.Box);
      
      expect(board.box(2,1)).to.be.an.instanceof(app.Box);
      expect(board.box(2,2)).to.be.an.instanceof(app.Box);
      expect(board.box(2,3)).to.be.an.instanceof(app.Box);
      
      expect(board.box(3,1)).to.be.an.instanceof(app.Box);
      expect(board.box(3,2)).to.be.an.instanceof(app.Box);
      expect(board.box(3,3)).to.be.an.instanceof(app.Box);
    });
  });
  
  describe("Judges", function() {
    it("should not notify when there is no winner", function() {
      // set up board using: 
      // XOX
      // OOX
      // XXO
      // below is the transposed board, but doesn't matter because
      // tic tac toe doesn't judge on that
      var game = new app.Game();
      var board = game.board;
      var judge = game.judge;
      var victor = undefined;
      var testFunction = function(judge) {
        victor = judge.victor();
      };
      judge.subscribeVictorChanged(testFunction);
      // repeatedly check there is no winner after each transition
      expect(victor).to.not.be.defined;
      
      board.box(1,1).fillX();
      expect(victor).to.not.be.defined;
      board.box(1,2).fillO();
      expect(victor).to.not.be.defined;
      board.box(1,3).fillX();
      expect(victor).to.not.be.defined;
      
      board.box(2,1).fillO();
      expect(victor).to.not.be.defined;
      board.box(2,2).fillO();
      expect(victor).to.not.be.defined;
      board.box(2,3).fillX();
      expect(victor).to.not.be.defined;
      
      board.box(3,1).fillX();
      expect(victor).to.not.be.defined;
      board.box(3,2).fillX();
      expect(victor).to.not.be.defined;
      board.box(3,3).fillO();
      expect(victor).to.not.be.defined;
    });
    it("should notify when there is a row that wins", function() {
      // set up board using (where B is blank): 
      // XXX
      // BBB
      // BBB
      var game = new app.Game();
      // FIXME really weird that I have to create a new state + box
      game.getPlayerByID(1).useX();
      game.getPlayerByID(2).useO();
      var board = game.board;
      var judge = game.judge;
      var victor = undefined;
      var testFunction = function(judge) {
        victor = judge.victor;
      };
      judge.subscribeVictorChanged(testFunction);
      // repeatedly check there is no winner after each transition
      expect(victor).to.not.be.defined;
      
      board.box(1,1).fillX();
      expect(victor).to.not.be.defined;
      board.box(1,2).fillX();
      expect(victor).to.not.be.defined;
      board.box(1,3).fillX();
      expect(victor).to.equal(game.getPlayerByID(1));
    });
    
    it("should notify when there is a column that wins", function() {
      // set up board using (where B is blank): 
      // BXB
      // BXB
      // BXB
      var game = new app.Game();
      game.getPlayerByID(1).useX();
      game.getPlayerByID(2).useO();
      var board = game.board;
      var judge = game.judge;
      var victor = undefined;
      var testFunction = function(judge) {
        victor = judge.victor;
      };
      judge.subscribeVictorChanged(testFunction);
      // repeatedly check there is no winner after each transition
      expect(victor).to.not.be.defined;
      
      board.box(1,2).fillX();
      expect(victor).to.not.be.defined;
      board.box(2,2).fillX();
      expect(victor).to.not.be.defined;
      board.box(3,2).fillX();
      expect(victor).to.equal(game.getPlayerByID(1));
    });
    
    it("should notify when there is a downward diagonal that wins", function() {
      // set up board using (where B is blank): 
      // XBB
      // BXB
      // BBX
      var game = new app.Game();
      // FIXME really weird that I have to create a new state + box
      game.getPlayerByID(1).useX();
      game.getPlayerByID(2).useO();
      var board = game.board;
      var judge = game.judge;
      var victor = undefined;
      var testFunction = function(judge) {
        victor = judge.victor;
      };
      judge.subscribeVictorChanged(testFunction);
      // repeatedly check there is no winner after each transition
      expect(victor).to.not.be.defined;
      
      board.box(1,1).fillO();
      expect(victor).to.not.be.defined;
      board.box(2,2).fillO();
      expect(victor).to.not.be.defined;
      board.box(3,3).fillO();
      expect(victor).to.equal(game.getPlayerByID(2));
    });
    it("should notify when there is a upward diagonal that wins", function() {
      // set up board using (where B is blank): 
      // BBX
      // BXB
      // XBB
      var game = new app.Game();
      // FIXME really weird that I have to create a new state + box
      game.getPlayerByID(1).useX();
      game.getPlayerByID(2).useO();
      var board = game.board;
      var judge = game.judge;
      var victor = undefined;
      var testFunction = function(judge) {
        victor = judge.victor;
      };
      judge.subscribeVictorChanged(testFunction);
      // repeatedly check there is no winner after each transition
      expect(victor).to.not.be.defined;
      
      board.box(3,1).fillO();
      expect(victor).to.not.be.defined;
      board.box(2,2).fillO();
      expect(victor).to.not.be.defined;
      board.box(1,3).fillO();
      expect(victor).to.equal(game.getPlayerByID(2));
    });
  });
  
  describe("Random AIs", function() {
    it("should be able to fill a board", function() {
      var board = new app.Board();
      var player = new app.Player(board);
      player.useX();
      var ai = new app.RandomAI();
      ai.control(player);
      for (var i = 0; i < 9; i++){
        ai.makeNextMove();
      }
      
      // check that the board is completely filled
      let hasEmpty = false;
      for (var i = 1; i <= 3; i++) {
        for (var j = 1; j <= 3; j++) {
          hasEmpty = hasEmpty || 
            Object.getPrototypeOf(board.box(i, j).state) === app.EmptyBoxState;
        }
      }
      
      if (hasEmpty){
        throw new Error("Part of the board is empty");
      }
      
      // should be able to make the AI try and make another move without errors
      ai.makeNextMove();
    });
    
    it("should be able to fill a partially filled board", function() {
      var board = new app.Board();
      // fill random boxes
      board.box(1,1).fillO();
      board.box(2,1).fillX();
      board.box(3,1).fillO();
      
      var player = new app.Player(board);
      player.useX();
      var ai = new app.RandomAI();
      ai.control(player);
      // make 9 moves even though there's only 6 valid moves left
      for (var i = 0; i < 9; i++){
        ai.makeNextMove();
      }
      
      // check that the board is completely filled
      let hasEmpty = false;
      for (var i = 1; i <= 3; i++) {
        for (var j = 1; j <= 3; j++) {
          hasEmpty = hasEmpty ||
            Object.getPrototypeOf(board.box(i, j).state) === app.EmptyBoxState;
        }
      }
      
      if (hasEmpty){
        throw new Error("Part of the board is empty");
      }
    });
    
    it("should be able to be reused across boards", function() {
      var board1 = new app.Board();
      // fill left column of the board
      board1.box(1,1).fillX();
      board1.box(1,2).fillO();
      board1.box(1,3).fillX();
      
      var player = new app.Player(board1);
      player.useX();
      var ai = new app.RandomAI();
      ai.control(player);

      // make 9 moves even though there's only 6 valid moves left
      for (var i = 0; i < 9; i++){
        ai.makeNextMove();
      }
      // make sure the AI filled in the blank parts of the board
      var hasEmpty = false;
      for (var i = 2; i <= 3; i++) {
        for (var j = 1; j <= 3; j++) {
          hasEmpty = hasEmpty ||
            Object.getPrototypeOf(board1.box(i, j).state) === app.EmptyBoxState;
        }
      }
      if (hasEmpty){
        throw new Error("Part of the board was not filled correctly");
      }
      
      // create second board
      var board2 = new app.Board();
      var player2 = new app.Player(board2);
      player2.useX();
      ai.releaseControl();
      ai.control(player2);
      // make sure the AI can fill the entire board
      for (var i = 0; i < 9; i++){
        ai.makeNextMove();
      }
      // check that the board is completely filled
      hasEmpty = false;
      for (var i = 1; i <= 3; i++) {
        for (var j = 1; j <= 3; j++) {
          hasEmpty = hasEmpty ||
            Object.getPrototypeOf(board2.box(i, j).state) === app.EmptyBoxState;
        }
      }
      
      if (hasEmpty){
        throw new Error("Part of the board is empty");
      }
    });
  });
}); 