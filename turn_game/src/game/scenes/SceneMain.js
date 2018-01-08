

var SceneMain = function() {

  sjs.node.call(this);

  this.setSize(sjs.vs().w, sjs.vs().h);
  this.setAnchorPoint(0,0);

  this.background = null;
  this.ui_title = null;

  this.initDesign();

  this.initTest();
}

SceneMain.prototype.initDesign = function() {

  this.background = new sjs.layer();
  this.background.setColor(0.15,0.15,0.15);
  this.background.setSize(this.getSize().w, this.getSize().h);
  this.background.setPosition(this.getSize().w/2, this.getSize().h/2);
  this.addChild(this.background,0);


  this.ui_title = new sjs.sprite("res/design/logo.png");
  this.ui_title.setPosition(this.getSize().w/2, this.getSize().h*0.1);
  this.addChild(this.ui_title,1);
}

SceneMain.prototype.initTest = function() {


  var b = new sjs.layer();
  b.setColor(1,1,1);
  b.setSize(100,100);
  b.setPosition(this.getSize().w/2, this.getSize().h/2);

  b.update = function(dt) {

    this.setPositionY(this.getPositionY()+10*dt);
  }

  this.addChild(b);

  var bsmall = new sjs.layer();
  bsmall.setColor(1,0,0);
  bsmall.setSize(10,10);
  bsmall.setPosition(0,0);
  bsmall.update = function(dt) {
    this.setPosition(this.getPositionX() + 2*dt, this.getPositionY()+ 2*dt);
  }
  b.addChild(bsmall);
}