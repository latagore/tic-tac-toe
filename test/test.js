var expect    = require("chai").expect;
var app = require("../app");
var Box = app.Box;

describe("Tic Tac Toe", function() {

describe("Unit tests", function() {
  describe("Boxes", function() {
    it("should transition to filled states", function() {
      var box = new Box(1, 1);
      expect(box.state).to.be.an.instanceof(app.EmptyBoxState);
      box.fillX();
      expect(box.state).to.be.an.instanceof(app.XBoxState);
      
      box = new Box(1,2);
      expect(box.state).to.be.an.instanceof(app.EmptyBoxState);
      box.fillO();
      expect(box.state).to.be.an.instanceof(app.OBoxState);
    });
    
    it("should not transition from filled to other states", function() {
      var box = new Box(1, 1);
      expect(box.state).to.be.an.instanceof(app.EmptyBoxState);
      box.fillX();
      expect(box.state).to.be.an.instanceof(app.XBoxState);
      expect(box.fillX).to.throw(Error);
      expect(box.fillO).to.throw(Error);
      expect(box.state).to.be.an.instanceof(app.XBoxState);
      
      box = new Box(1, 2);
      expect(box.state).to.be.an.instanceof(app.EmptyBoxState);
      box.fillO();
      expect(box.state).to.be.an.instanceof(app.OBoxState);
      expect(box.fillX).to.throw(Error);
      expect(box.fillO).to.throw(Error);
      expect(box.state).to.be.an.instanceof(app.OBoxState);
    });
  });
});

});