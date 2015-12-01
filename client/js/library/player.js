// Classe per gestione giocatori
(function(){
  function Player(x, y, hp, max_hp, energy, max_energy, name, race, gender , variant , speed , max_speed , vision , player_id , unit_id) {

    CanvasEngine._checkValue(x , 'int');
    CanvasEngine._checkValue(y , 'int');
    CanvasEngine._checkValue(hp , 'int');
    CanvasEngine._checkValue(name , 'string');
    CanvasEngine._checkValue(race , 'int');
    CanvasEngine._checkValue(gender , 'int');
    CanvasEngine._checkValue(variant , 'int');
    CanvasEngine._checkValue(speed , 'int');
    CanvasEngine._checkValue(max_speed , 'int');
    CanvasEngine._checkValue(vision , 'int');
    CanvasEngine._checkValue(player_id , 'int');
    CanvasEngine._checkValue(unit_id , 'int');


    //id
    this.player_id = player_id;
    this.unit_id = unit_id;

    this.path =  PATH.PLAYERS;

    // ATTENTION:
    // It represents the player position on the world(room), not the canvas position
    this.x = x;
    this.y = y;

    //Status
    this.hp = max_hp;
    this.current_hp = hp;
    this.energy = max_energy;
    this.current_energy = energy;

    //Description
    this.name = name;
    this.race = race;
    this.gender = gender;
    this.variant = variant;

    // Move speed in pixels per second
    this.speed = speed;
    this.max_speed = max_speed;
    this.vision = vision;

    //Caricamento immagine
    this.img = new Image();
    this.img.onload = function () {};
    this.img.src = buildImage(this.race , this.variant , this.gender);

    // Grandezza Immagine
    this.width = 32;
    this.height = 32;

    // Gestione giocatore
    this.destination = false; //Se true segue una coordinata, viene messa a false se viene premuto un tasto di movimento dalla tastiera
  }

  Player.prototype.update = function(step){

    //=========================================================
    //======================= KEYBOARD ========================
    //=========================================================

    if(Game.controls.left || Game.controls.right || Game.controls.up || Game.controls.down) {
      this.destination = { x:0 , y:0 };
    }
    if(Game.controls.left) { this.destination.x = 0 - this.speed * step; }
    if(Game.controls.right) { this.destination.x = 0 + this.speed * step; }
    if(Game.controls.up) { this.destination.y = 0 - this.speed * step; }
    if(Game.controls.down) { this.destination.y = 0 + this.speed * step; }

    //=========================================================
    //======================== MOUSE ==========================
    //=========================================================
    if(this.destination) {
      if(Math.round(this.destination.x) < 0) {
        this.x -= this.speed * step;
        this.destination.x += this.speed * step;
        if(!this.CheckCollision()) {
          this.x += this.speed * step;
          this.destination.x -= this.speed * step;
        }
      }

      if(Math.round(this.destination.y) < 0) {
        this.y -= this.speed * step;
        this.destination.y += this.speed * step;
        if(!this.CheckCollision()) {
          this.y += this.speed * step;
          this.destination.y -= this.speed * step;
        }
      }

      if(Math.round(this.destination.x) > 0) {
        this.x += this.speed * step;
        this.destination.x -= this.speed * step;
        if(!this.CheckCollision()) {
          this.x -= this.speed * step;
          this.destination.x += this.speed * step;
        }
      }

      if(Math.round(this.destination.y) > 0) {
        this.y += this.speed * step;
        this.destination.y -= this.speed * step;
        if(!this.CheckCollision()) {
          this.y -= this.speed * step;
          this.destination.y += this.speed * step;
        }
      }

      if(Math.round(this.destination.x) === 0 && Math.round(this.destination.y) === 0) {
        this.destination = false;
      }
    }

  }

  //Se passati dei parametri disegna il personaggio in quelle coordinate, altrimenti lo disegna al centro
  Player.prototype.draw = function(x, y) {
    if(!x && !y) {
      x = (canvas.width/2);
      y = (canvas.height/2);
    }

    context.save();

    //Image player
    context.drawImage(this.img, (x - (this.width/2)), (y - (this.height/2)));

    //Name Player
    context.font="12px sans-serif";
    context.fillStyle="white";
    context.fillText(this.name, (x - (context.measureText(this.name).width/2)), (y - (this.height/2)));

    context.restore();
  }

  Player.prototype.changeImg = function(img) {
    this.img = this.path + img;
  }

  Player.prototype.sendPosition = function() {

	//Se non si muove dovrebbe non mandare il messaggio
	if(this.last_x_send && this.last_y_send) {
		if(this.last_x_send === this.x && this.last_y_send === this.y) {
			return false;
		}
	}
	this.last_x_send = this.x;
	this.last_y_send = this.y;

	//Mando le coordinate
	connection.send(JSON.stringify({
		mt : ClientMessageTypes.MOVE,
		x : Math.round(this.x),
		y : Math.round(this.y)
	}));
	//console.log('SEND' , ClientMessageTypes.MOVE, Math.round(this.x), Math.round(this.y));
  }

  Player.prototype.changePosition = function(x , y) {
  	this.x = x;
  	this.y = y;
  }

  Player.prototype.goToPosition = function (x , y) {
    //Setto la destinazione da raggiungere
    this.destination = {
      'x': x - (canvas.width/2),
      'y': y - (canvas.height/2)
    }
  }

  Player.prototype.CheckCollision = function() {
    var keys = Object.keys(GAME.ITEMS);
    for(var j = 0 ; j < keys.length ; j++) {
      var i = keys[j];
      if(GAME.ITEMS[i].land_id) {
        var item = GAME.INFO.LANDS[GAME.ITEMS[i].land_id];
        var pathImage = CanvasEngine.buildPathImage(PATH.ITEMS , GAME.ITEMS[i].land_id);
    		if(item.obstacle && GAME.LOADED_IMAGES[pathImage]) {

          if (this.x < GAME.ITEMS[i].x + GAME.LOADED_IMAGES[pathImage].width &&
    				this.x + this.width > GAME.ITEMS[i].x &&
    				this.y < GAME.ITEMS[i].y + GAME.LOADED_IMAGES[pathImage].height &&
    				this.y + this.height > GAME.ITEMS[i].y) {
    				return !COLLISION_FLAG;
    			}

    		}

      }
  	}
  	return true;
  }

  Player.prototype.checkElementPosition = function(x, y) {
    var keys = Object.keys(GAME.ITEMS);
    for(var j = 0 ; j < keys.length ; j++) {
      var i = keys[j];

      if(GAME.ITEMS[i].object_id) {
        var item = GAME.INFO.OBJECTS[GAME.ITEMS[i].object_id];
        //console.log(item , GAME.ITEMS[i].x , GAME.ITEMS[i].y);
        var pathImage = CanvasEngine.buildPathImage(PATH.OBJECTS , GAME.ITEMS[i].object_id);
    		if(GAME.LOADED_IMAGES[pathImage]) {
          if (x < GAME.ITEMS[i].x + GAME.LOADED_IMAGES[pathImage].width &&
    				x > GAME.ITEMS[i].x &&
    				y < GAME.ITEMS[i].y + GAME.LOADED_IMAGES[pathImage].height &&
    				y > GAME.ITEMS[i].y) {
    				//return GAME.INFO.OBJECTS[GAME.ITEMS[i].object_id];
            console.log(item);
            Interface.selectionUnit(item);
    			}
        }
      }
    }
  }

  // add "class" Player to our Game object
  Game.Player = Player;

})();


//Costruisce l'src per le immagini dei giocatori
buildImage = function(race , variant , gender) {

  var src = PATH.PLAYERS + WS_Race[race].toLowerCase();

  if(WS_Variant[variant] !== 'NEUTER') {
    src += '_' + WS_Variant[variant].toLowerCase();
  }

  if(WS_Gender[gender] !== 'NEUTER') {
    src += '_' + WS_Gender[gender].toLowerCase().charAt(0);
  }

  src += '.png';

  return src;
}
