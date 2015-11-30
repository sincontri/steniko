// Classe per gestione giocatori
(function(){
  function Player(x, y, hp, name, race, gender , variant) {

    CanvasEngine._checkValue(x , 'int');
    CanvasEngine._checkValue(y , 'int');
    CanvasEngine._checkValue(hp , 'int');
    CanvasEngine._checkValue(name , 'string');
    CanvasEngine._checkValue(race , 'string');
    CanvasEngine._checkValue(gender , 'string');
    CanvasEngine._checkValue(variant , 'string');

    // ATTENTION:
    // It represents the player position on the world(room), not the canvas position
    this.x = x;
    this.y = y;

    //Status
    this.hp = hp;
    this.name = name;
    this.race = race;
    this.gender = gender;
    this.variant = variant;

    // Move speed in pixels per second
    this.speed = 250;


    //Immagine da caricare
    this.img = new Image();
    this.img.onload = function () {};
    this.path =  "icons/player/base/";
    
    this.img.src = this.path + WS_Race[this.race].toLowerCase() + '_' +
    WS_Variant[this.variant] + '_' +
    WS_Gender[this.gender] + '.png';

    //this.img.src = "icons/player/base/centaur_brown_m.png";

    // Grandezza Immagine
    this.width = 32;
    this.height = 32;
  }

  Player.prototype.update = function(step, worldWidth, worldHeight){
    // parameter step is the time between frames ( in seconds )

    // check controls and move the player accordingly
    if(Game.controls.left)
      this.x -= this.speed * step;
    if(Game.controls.up)
      this.y -= this.speed * step;
    if(Game.controls.right)
      this.x += this.speed * step;
    if(Game.controls.down)
      this.y += this.speed * step;

    // don't let player leaves the world's boundary
    if(this.x - this.width/2 < 0){
      this.x = this.width/2;
    }
    if(this.y - this.height/2 < 0){
      this.y = this.height/2;
    }
    if(this.x + this.width/2 > worldWidth){
      this.x = worldWidth - this.width/2;
    }
    if(this.y + this.height/2 > worldHeight){
      this.y = worldHeight - this.height/2;
    }
  }

  Player.prototype.draw = function(context, xView, yView){
    context.save();

    //RECTANGLE
    //context.fillStyle = "black";
    //context.fillRect((this.x-this.width/2) - xView, (this.y-this.height/2) - yView, this.width, this.height);

    //IMAGE
    context.drawImage(this.img, (this.x-this.width/2) - xView, (this.y-this.height/2) - yView);

    context.restore();
  }

  Player.prototype.changeImg = function(img) {
    this.img = this.path + img;
  }

  // add "class" Player to our Game object
  Game.Player = Player;

})();
