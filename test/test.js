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
  });
});