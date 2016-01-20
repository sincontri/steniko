var CanvasEngine = {

  //Variables
  _typeof : Object.prototype.toString,
  _caller : null,
  _name : null,

  _rules : {
    'string' : {
      'TYPE' : '[object String]',
      'MIN_LENGTH' : 1,
      'MAX_LENGTH' : 255,
      //'REGEX' : '';
    },
    'int' : {
      'TYPE' : '[object Number]',
      'MIN_VALUE' : 0,
      //'MAX_VALUE' : 255
    },
    'size' : {
      'TYPE' : '[object Number]',
      'MIN_VALUE' : 200,
      'MAX_VALUE' : 1920,
    }
  },

  /**
   * Crea la stringa da inserire nell'exception in caso di errore
   * @method writeError
   * @param {string} msg
   *
   * @return string
   */
  writeError :  function(msg) {
    return this._caller + '|' + this._name + '|' + msg;
  },

  /**
   * Crea l'oggetto immagine per la canvas
   * @method createImage
   * @param {string} path
   *
   * @return Image
   */
  createImage : function(path , room) {
    this._checkValue(path , 'string');
    var img = new Image();

    if(room) {
      img.onload = function() {
        GAME.ROOM.map.generate();
        Console.Log('TERRAIN LOADED', 'map');
        Interface.removeBroadcast();
        Game.play();
      }
    }

    img.src = path + '.png';
    return img;
  },

  /**
   * Controlla il valore scelto provandolo sotto diverse regole
   * @method _checkValue
   * @param {string} value
   * @param {string} type
   *
   * @return boolean
   */
  _checkValue : function(value, type) {

    this._name = arguments.callee.name;
    this._caller = arguments.callee.caller.name;
    //===========================================================
    //====================== CHECK PARAMS =======================
    //===========================================================

    try {
      var typeValue = this._typeof.call(value);
    } catch(error) {
      throw new Error( this.writeError("This value is undefined") );
    }

    try {
      var typeType = this._typeof.call(type);
    } catch(error) {
      throw new Error( this.writeError("This type is undefined") );
    }

    if(typeType !== '[object String]') {
      throw new Error( this.writeError("This type isn't String but is " + typeType) );
    }

    if(!this._rules[type]) {
      throw new Error( this.writeError("This type not exist in the rules list") );
    }

    if(this._rules[type].length === 0) {
      throw new Error( this.writeError("This type not contain anything") );
    }

    //===========================================================
    //====================== CHECK VALUE ========================
    //===========================================================

    if(this._rules[type]['TYPE']) {
      if(this._rules[type]['TYPE'] !== typeValue) {
        throw new Error(
          this.writeError("This value has wrong type. Expect " +
          this._rules[type]['TYPE'] + " but it is " + typeValue)
        );
      }
    }

    if(this._rules[type]['MIN_LENGTH']) {
      if(this._rules[type]['MIN_LENGTH'] > value.length) {
        throw new Error(
          this.writeError("This value not valid. min-length is "
          + this._rules[type]['MIN_LENGTH'] + " but it is " + value.length
        ));
      }
    }

    if(this._rules[type]['MAX_LENGTH']) {
      if(this._rules[type]['MAX_LENGTH'] < value.length) {
        throw new Error(
          this.writeError("This value not valid. max-length is "
          + this._rules[type]['MAX_LENGTH'] + " but it is " + value.length
        ));
      }
    }


    if(this._rules[type]['MIN_VALUE']) {
      if(this._rules[type]['MIN_VALUE'] > value) {
        throw new Error(
          this.writeError("This value not valid. min-value is "
          + this._rules[type]['MIN_VALUE'] + " but it is " + value
        ));
      }
    }

    if(this._rules[type]['MAX_VALUE']) {
      if(this._rules[type]['MAX_VALUE'] < value) {
        throw new Error(
          this.writeError("This value not valid. max-value is "
          + this._rules[type]['MAX_VALUE'] + " but it is " + value
        ));
      }
    }

    if(this._rules[type]['REGEX']) {
      if(!this._rules[type]['REGEX'].test(value)) {
        throw new Error( this.writeError("This value not respect the regex") );
      }
    }

    return true;
  },

//===========================================================
//====================== ON MESSAGE =========================
//===========================================================

  onMessage : function(message) {

    var data = JSON.parse(message);

	  console.log('risposta WSS' , data);
    if(data.pid) { this._checkValue(data.pid, 'int'); }
	  if(data.uid) { this._checkValue(data.uid, 'int'); }
	  if(data.mt) { this._checkValue(data.mt, 'int'); }
    if(data.n) { this._checkValue(data.n, 'string'); }
    if(data.x) { this._checkValue(data.x, 'int'); }
    if(data.y) { this._checkValue(data.y, 'int'); }
    if(data.h) { this._checkValue(data.h, 'int'); }
    if(data.r) { this._checkValue(data.r, 'int'); }
    if(data.g) { this._checkValue(data.g, 'int'); }
    if(data.v) { this._checkValue(data.v, 'int'); }
	  if(data.s) { this._checkValue(data.s, 'int'); }
	  if(data.b) { this._checkValue(data.b, 'int'); }
	  if(data.ts) { this._checkValue(data.ts, 'int'); }

    switch(data.mt) {

//===========================================================
//===================== CONNECT OPEN ========================
//===========================================================
//Il messaggio si occupa nel segnalare l'apertura del webSocket
      case ServerMessageTypes.CONFIRM_CONNECTION :
        Console.Log('Confirm Connection' , 1 , 'wss');
        break;

//===========================================================
//===================== CONNECT CLOSE =======================
//===========================================================
//Il messaggio si occupa nel gestire la chiusura del webSocket
      case ServerMessageTypes.CLOSE :
        Console.Log('Close Connection' , 1 , 'wss');
        connection.close();
        break;

//===========================================================
//===================== PLAYER INFO =========================
//===========================================================
//Il messaggio si occupa nel darci i dati del nostro personaggio
      case ServerMessageTypes.UNIT_INFO :
        Console.Log('Param Player' , 1 , 'wss');
		    if(data.i) { this._checkValue(data.i, 'int'); }

        player = new Game.Player(
    			data.x,
    			data.y,
    			data.h,
          data.mh,
          data.e,
          data.me,
    			data.n,
    			data.r,
    			data.g,
    			data.v,
    			data.s,
    			data.i,
    			data.b,
    			data.pid,
    			data.uid
    		);
        Interface.startHUD();

        break;

//===========================================================
//=================== PLAYER INVENTORY ======================
//===========================================================
//Il messaggio si occupa di fornire ogni oggetto presente nel nostro inventario
      case ServerMessageTypes.PLAYER_INVENTORY :
        Console.Log('Player Inventory' , 1 , 'wss');

        for(var i in data.w) {
          player.inventory.push(data.w[i]);
        }

        break;

//===========================================================
//==================== OTHER PLAYERS ========================
//===========================================================
//Il messaggio si occupa di segnalare ogni nuovo giocatore che si incontra nella propria visuale
      case ServerMessageTypes.PLAYERS_INFO :
        Console.Log('Other Player' , 1 , 'wss');
    		if(data.i) { this._checkValue(data.i, 'int'); }

        GAME.OTHER_PLAYERS[data.uid] = new Game.Player(
    			data.x,
    			data.y,
    			data.h,
          data.mh,
          data.e,
          data.me,
    			data.n,
    			data.r,
    			data.g,
    			data.v,
    			data.s,
    			data.i,
    			data.b,
    			data.pid,
    			data.uid
    		);
        break;

//===========================================================
//==================== PLAYERS POSITION =====================
//===========================================================
//Il messaggio si occupa nel fornire la posizione degli altri personaggi
      case ServerMessageTypes.PLAYERS_POSITION :
        if(GAME.OTHER_PLAYERS[data.uid]) {
          GAME.OTHER_PLAYERS[data.uid].changePosition(
      			data.x,
      			data.y
      		);
        }
        break;

//===========================================================
//===================== MAP + ITEMS =========================
//===========================================================
//Il messaggio si occupa di fornire gli elementi circostanti al giocatore
      case ServerMessageTypes.MAP_INFO :
        Console.Log('Map Info' , 1 , 'map');

        //Info Mappa
        GAME.MAP_INFO = {
          'id' : data.i.id,
          'name' : data.i.name,
          'ground' : data.i.ground_icon
        };
        //Info oggetti intorno al pg
        for(var i in data.m) {
          var item = data.m[i];

          if(item) {
            //Salvo oggetto parsificato
            GAME.ITEMS[item.id] = item;
          }
        }

        Interface.createBar('MENU_BAR');


        if(!GAME.TERRAIN || GAME.TERRAIN.name !== GAME.MAP_INFO.name) {
          GAME.TERRAIN = {
            name : GAME.MAP_INFO.name,
            img : CanvasEngine.createImage(PATH.ITEMS + GAME.MAP_INFO.ground , true)
          }
        }

        GAME.ROOM = {
          width: 5000,
          height: 3000,
          map: new Game.Map(5000, 3000)
        };

        // generate a large image texture for the room
        GAME.ROOM.map.generate();
        GAME.CAMERA = new Game.Camera(0 , 0, window.innerWidth, window.innerHeight, 10000, 10000);
        GAME.CAMERA.follow(player, window.innerWidth/2, window.innerHeight/2);

        //Game.play(); // PLAY THE GAME
        break;

//===========================================================
//======================= LOGOUT ============================
//===========================================================
//Il messaggio si occupa della cancellazione dalla mappa di un pg al suo logout
      case ServerMessageTypes.LOGOUT :
        Console.Log('Logout Unit' , 1 , 'map');

        delete GAME.OTHER_PLAYERS[data.id];
        break;

//===========================================================
//===================== MAP DETAILS =========================
//===========================================================
//Il messaggio si occupa di fornire gli elementi di mappa esistenti nel gioco
      case ServerMessageTypes.LANDS :
        Console.Log('Lands' , 1 , 'map');

        // width - height - icon - id - obstacle
        for(var i = 0 ; i < data.a.length ; i++) {
          var item = data.a[i];
          if(item) {
            GAME.INFO.LANDS[item.id] = item;


            var path = PATH.ITEMS + item.icon + '.png';
            var img = new Image();
            img.onload = function () {};
            img.src = path;
            GAME.LOADED_IMAGES[path] = img;
          }
        }
        break;

//===========================================================
//======================= OBJECTS ===========================
//===========================================================
//Il messaggio si occupa nel fornire la lista di oggetti esistenti nel gioco
      case ServerMessageTypes.OBJECTS :
        Console.Log('Objects' , 1 , 'map');

        for(var i = 0 ; i < data.a.length ; i++) {
          var item = data.a[i];
          if(item) {
            GAME.INFO.OBJECTS[item.id] = item;

            var path = PATH.OBJECTS + item.icon + '.png';
            var img = new Image();
            img.onload = function () {};
            img.src = path;
            GAME.LOADED_IMAGES[path] = img;
          }
        }
        break;

//===========================================================
//==================== BAD COLLISION ========================
//===========================================================
//Il messaggio si occupa della segnalazioni di collisioni non rispettate
      case ServerMessageTypes.UNIT_COLLISION :
        Console.Log('Bad Collision' , 1 , 'error');

        player.x = data.x;
        player.y = data.y;
        break;

//===========================================================
//====================== LIST UNIT ==========================
//===========================================================
//Il messaggio si occupa nel fornire la lista dei giocatori dell'utente, cosi da poter scegliere con quale giocare
      case ServerMessageTypes.LIST_UNIT :
        Console.Log('List Unit' , 1 , 'map');

        GAME.LIST_UNIT = data.a;
        if(Interface.checkWindow('chooseUnit')) {
          WINDOWS['CHOOSE_UNIT'] = Interface.createWindow('chooseUnit' , 'CHOOSE_UNIT' , 400 , 300);
        }
        Interface.chooseUnit(data.a , WINDOWS['CHOOSE_UNIT'].body);
        break;

//===========================================================
//=================== GET DROP ITEM =========================
//===========================================================
//Il messaggio si occupa del drop dell'oggetto, dando la conferma del server che � stato preso
      case ServerMessageTypes.GET_DROP_ITEM :
        Console.Log('Get Drop Item' , 1 , 'map');
        SystemInfo.write('Hai preso ' + SELECTION_MOUSE.items[0]);

        for(var i in data.i) {
          player.inventory.push(parseInt(data.i[i]));
          var data_k = parseInt(data.k);

          for(var j in GAME.ITEMS[data_k].object_id) {
            if(GAME.ITEMS[data_k].object_id[j] === data.i[i]) {
              GAME.ITEMS[data_k].object_id.splice(j , 1);
            }
          }

          if(GAME.ITEMS[data_k].object_id.length === 0) {
            delete GAME.ITEMS[data_k];
            //Deselezione dell'oggetto scomparso
            SELECTION_MOUSE = false;
          }

        }

        //Aggiornamento dell'inventario se aperto
        if(WINDOWS['INVENTORY']) {
          Interface.createInventory(WINDOWS['INVENTORY'].id , player.inventory , 2);
        }
        break;

//===========================================================
//=================== UPDATE DROP ITEM ======================
//===========================================================
//Il messaggio si occupa di fare l'update degli oggetti a terra, togliendo quelli che altri giocatori hanno preso
      case ServerMessageTypes.UPDATE_DROP_ITEMS :
        Console.Log('Update Drop Item' , 1 , 'map');

        for(var i in data.i) {
          var data_k = parseInt(data.k);

          for(var j in GAME.ITEMS[data_k].object_id) {
            if(GAME.ITEMS[data_k].object_id[j] === data.i[i]) {
              GAME.ITEMS[data_k].object_id.splice(j , 1);
            }
          }

          if(GAME.ITEMS[data_k].object_id.length === 0) {
            delete GAME.ITEMS[data_k];
          }
        }
        break;
//===========================================================
//=================== LOCK CONFIRMED ========================
//===========================================================
//Il messaggio si occupa di gestire la conferma del permesso di prendere gli oggetti
      case ServerMessageTypes.LOCK_OK :
        Console.Log('Permission LOCK Confirmed' , 1 , 'map');
        createDropList(SELECTION_MOUSE.items);
        break;
//===========================================================
//===================== LOCK DENIED =========================
//===========================================================
//Il messaggio si occupa di gestire la negazione del permesso di prendere gli oggetti
      case ServerMessageTypes.LOCK_FAIL :
        Console.Log('Permission LOCK Denied' , 1 , 'map');
        createDropList_READONLY(SELECTION_MOUSE.items);
        break;

    }

    GAME.DRAW = true;
  }
}

window.onerror = function(message, url, line, column, errorObj) {
  Console.Log(message , 2 , 'error');
  Game.togglePause();
}
