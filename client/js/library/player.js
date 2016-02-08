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

    this.path = PATH.PLAYERS;

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
    this.width = this.img.width;
    this.height = this.img.height;
    this.width_half = this.img.width/2;
    this.height_half = this.img.height/2;

    // Gestione giocatore
    this.destination = false; //Se true segue una coordinata, viene messa a false se viene premuto un tasto di movimento dalla tastiera
    this.status = false; //Se a valore serve per capire l'azione richiesta da eseguire (DROP,ATTACK, ecc)
    this.inventory = [] //Inventario giocatore organizzato in array
    //Equipaggiamento
    this.wear = {
      'HEAD':null,
      'ARMOUR':null,
      'LEFT_HAND':null,
      'RIGHT_HAND':null,
      'BOOTS':null,
      'GLOVES':null,
      'CLOAK':null,
      'RING_1':null,
      'RING_2':null
    };

    this.equip_item = {
      'HEAD':null,
      'ARMOUR':null,
      'LEFT_HAND':null,
      'RIGHT_HAND':null,
      'BOOTS':null,
      'GLOVES':null,
      'CLOAK':null,
      'RING_1':null,
      'RING_2':null
    };
  }

  Player.prototype.update = function(step){

    //=========================================================
    //======================= KEYBOARD ========================
    //=========================================================

    if(Game.controls.left || Game.controls.right || Game.controls.up || Game.controls.down) {
      this.destination = { x:0 , y:0 };
      this.status = false;
    }
    if(Game.controls.left) { this.destination.x = 0 - this.speed * step; }
    if(Game.controls.right) { this.destination.x = 0 + this.speed * step; }
    if(Game.controls.up) { this.destination.y = 0 - this.speed * step; }
    if(Game.controls.down) { this.destination.y = 0 + this.speed * step; }

    //=========================================================
    //======================== MOUSE ==========================
    //=========================================================
    if(this.destination) {
      //Distruggi il possibile context menu aperto
      destroyWindow('contextMenu');

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

        if( Math.round(this.destination.x) < (this.speed * step) &&
            Math.round(this.destination.x) > -(this.speed * step) &&
            Math.round(this.destination.y) > -(this.speed * step) &&
            Math.round(this.destination.y) < (this.speed * step)) {
        this.destination = false;

        this.executeStatus();
      }
    }

  }

//===========================================================
//========================= DRAW ============================
//===========================================================
  //Se passati dei parametri disegna il personaggio in quelle coordinate, altrimenti lo disegna al centro
  Player.prototype.draw = function() {
    //Image player
    context.drawImage(this.img, this.x - GAME.CAMERA.xView, this.y - GAME.CAMERA.yView);
    for(var i in this.wear) {
      if(this.wear[i]) { context.drawImage(this.wear[i], this.x - GAME.CAMERA.xView, this.y - GAME.CAMERA.yView); }
    }

    //Name Player
    context.font="12px sans-serif";
    context.fillStyle="white";
    context.fillText(this.name, (this.x + (context.measureText(this.name).width/2)) - GAME.CAMERA.xView, this.y - GAME.CAMERA.yView);
  }

//===========================================================
//======================== EQUIP ============================
//===========================================================
  //Equipaggia gli oggetti in base al tipo
  Player.prototype.equip = function(item) {
    if(this.inventory[item]) {
      var obj = GAME.INFO.OBJECTS[ this.inventory[item] ];
      var type = Object_Types[ this.inventory[item] ];

      //Creazione immagine
      this.wear[type];
      this.wear[type] = new Image();
      this.wear[type].onload = function () {};
      this.wear[type].src = PATH.EQUIPS + obj.wear + '.png';

      //Segno l'oggetto come equipaggiato
      this.equip_item[type] = item;

      //Aggiornamento dell'inventario se aperto
      if(WINDOWS['INVENTORY']) {
        Interface.createInventory(WINDOWS['INVENTORY'].id , player.inventory , 2);
      }
      //Aggiornamento della scheda se aperta
      if(WINDOWS['CHARACTER']) {
        Interface.createCharacter(WINDOWS['CHARACTER'].id);
      }

      GAME.DRAW = 60;
    }
  }

//===========================================================
//======================= UNEQUIP ===========================
//===========================================================
  //Equipaggia gli oggetti in base al tipo
  Player.prototype.unequip = function(item) {
    if(this.inventory[item]) {
      var obj = GAME.INFO.OBJECTS[ this.inventory[item] ];
      var type = Object_Types[ this.inventory[item] ];

      //Distruzione immagine
      this.wear[type] = null;

      //Segno l'oggetto come disequipaggiato
      this.equip_item[type] = null;

      //Aggiornamento dell'inventario se aperto
      if(WINDOWS['INVENTORY']) {
        Interface.createInventory(WINDOWS['INVENTORY'].id , player.inventory , 2);
      }
      //Aggiornamento della scheda se aperta
      if(WINDOWS['CHARACTER']) {
        Interface.createCharacter(WINDOWS['CHARACTER'].id);
      }

      GAME.DRAW = 60;
    }
  }

//===========================================================
//===================== CHANGE IMG ==========================
//===========================================================

  Player.prototype.changeImg = function(img) {
    this.img = this.path + img;
  }

//===========================================================
//==================== SEND POSITION ========================
//===========================================================

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

//===========================================================
//=================== CHANGE POSITION =======================
//===========================================================

  Player.prototype.changePosition = function(x , y) {
  	this.x = x;
  	this.y = y;
  }

//===========================================================
//=================== GO TO POSITION ========================
//===========================================================

  Player.prototype.goToPosition = function (x , y) {
    //Setto la destinazione da raggiungere
    this.destination = {
      'x': GAME.CAMERA.xView + (x - this.x),
      'y': GAME.CAMERA.yView + (y - this.y)
    }
  }

//===========================================================
//=================== CHECK COLLISION =======================
//===========================================================

  Player.prototype.CheckCollision = function() {
    var keys = Object.keys(GAME.ITEMS);
    for(var j = 0 ; j < keys.length ; j++) {
      var i = keys[j];
      if(GAME.ITEMS[i].land_id) {
        var item = GAME.INFO.LANDS[GAME.ITEMS[i].land_id];
        var pathImage = PATH.ITEMS + GAME.INFO.LANDS[ GAME.ITEMS[i].land_id ].icon + '.png';
    		if(item.obstacle && GAME.LOADED_IMAGES[pathImage]) {

          if (this.x < GAME.ITEMS[i].x + (GAME.LOADED_IMAGES[pathImage].width - COLLISION_TOLLERANCE) &&
    				this.x + (this.width - COLLISION_TOLLERANCE) > GAME.ITEMS[i].x &&
    				this.y < GAME.ITEMS[i].y + (GAME.LOADED_IMAGES[pathImage].height - COLLISION_TOLLERANCE) &&
    				this.y + (this.height - COLLISION_TOLLERANCE) > GAME.ITEMS[i].y) {
    				return !COLLISION_FLAG;
    			}

    		}

      }
  	}
  	return true;
  }

//===========================================================
//=================== CHECK ELEMENT  ========================
//===========================================================

  Player.prototype.checkElementPosition = function(x, y) {
    x = GAME.CAMERA.xView + x;
    y = GAME.CAMERA.yView + y;

    var keys = Object.keys(GAME.ITEMS);
    for(var j = 0 ; j < keys.length ; j++) {
      var i = keys[j];

      if(GAME.ITEMS[i].object_id) {
        var item = GAME.ITEMS[i].object_id;
        for(var z in item) {
          var info = GAME.INFO.OBJECTS[item[z]];

          var pathImage = PATH.OBJECTS + info.icon + '.png';
      		if(GAME.LOADED_IMAGES[pathImage]) {
            if (x < GAME.ITEMS[i].x + GAME.LOADED_IMAGES[pathImage].width &&
      				x > GAME.ITEMS[i].x &&
      				y < GAME.ITEMS[i].y + GAME.LOADED_IMAGES[pathImage].height &&
      				y > GAME.ITEMS[i].y) {

              selectionItem(pathImage , info , item , i);
              return true;

      			}
          }

        }
      }
    }
    return false;
  }

//===========================================================
//==================== CHECK PLAYERS ========================
//===========================================================

  Player.prototype.checkPlayersPosition = function(x, y) {
    x = GAME.CAMERA.xView + x;
    y = GAME.CAMERA.yView + y;

    var keys = Object.keys(GAME.OTHER_PLAYERS);
    for(var j = 0 ; j < keys.length ; j++) {
      var players = GAME.OTHER_PLAYERS[keys[j]];

      if (x < players.x + players.img.width &&
				x > players.x &&
				y < players.y + players.img.height &&
				y > players.y) {

        selectionPlayer(players);
        return true;
			}
    }
    return false;
  }

//===========================================================
//===================== CONTEXT MENU ========================
//===========================================================

  Player.prototype.showContextMenu = function(x, y , mode) {
    if(WINDOWS['CONTEXT_MENU']) {
      destroyWindow('contextMenu');
    }
    WINDOWS['CONTEXT_MENU'] = Interface.createContextMenu('contextMenu' , 100 , x , y, mode);
  }

  Player.prototype.executeStatus = function() {
    if(this.status) {
      switch(this.status) {

        //=========================================================
        //======================= DROP ITEM =======================
        //=========================================================
        case StatusPlayer.DROP :
          if(SELECTION_MOUSE) {
            if(SELECTION_MOUSE.items) {

              if(SELECTION_MOUSE.items.length > 1) {
                //==================================
                //========== MULTI ITEM ============
                //==================================
                //Lock
                connection.send(JSON.stringify({
              		mt : ClientMessageTypes.LOCK_DROP_ITEM,
              		m : GAME.MAP_INFO.id
              	}));
              } else {
                //==================================
                //========== SINGLE ITEM ===========
                //==================================
                //Get Item
                connection.send(JSON.stringify({
              		mt : ClientMessageTypes.GET_DROP_ITEM,
              		k : [SELECTION_MOUSE.items[0]],
                  i : SELECTION_MOUSE.item_id
              	}));
              }

            }
          }
          break;
      }
      this.status = false;
    }
  }

  // add "class" Player to our Game object
  Game.Player = Player;

})();

//===========================================================
//===================== BUILD IMAGE  ========================
//===========================================================

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
