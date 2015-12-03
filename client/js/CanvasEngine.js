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
  createImage : function(path) {
    this._checkValue(path , 'string');
    var img = new Image();
    img.src = path + '.png';
    return img;
  },

  /**
   * Crea il path per trovare l'immagine
   * @method createImage
   * @param {string} path
   *
   * @return Image
   */
  buildPathImage : function(path , id , mode) {
    if(!mode || mode === 'lands') {
      return path + GAME.INFO.LANDS[ id ].icon + '.png';
    }
    if(mode === 'objects') {
      return path + GAME.INFO.OBJECTS[ id ].icon + '.png';
    }
    return false;
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
      case ServerMessageTypes.CONFIRM_CONNECTION :
        Console.Log('Confirm Connection' , 1 , 'wss');
        break;

//===========================================================
//===================== CONNECT CLOSE =======================
//===========================================================
      case ServerMessageTypes.CLOSE :
        Console.Log('Close Connection' , 1 , 'wss');
        connection.close();
        break;

//===========================================================
//===================== PLAYER INFO =========================
//===========================================================
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

        break;

//===========================================================
//==================== OTHER PLAYERS ========================
//===========================================================
      case ServerMessageTypes.PLAYERS_INFO :
        Console.Log('Other Player' , 1 , 'wss');
    		if(data.i) { this._checkValue(data.i, 'int'); }
        /* b: 400 e: 30 g: 2 h: 40 i: 120 me: 30 mh: 40 mt: 3 n: "Nik" pid: 2 r: 1 s: 80 uid: 2 v: 2 x: 312 y: 465 */
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
      case ServerMessageTypes.PLAYERS_POSITION :
    		GAME.OTHER_PLAYERS[data.uid].changePosition(
    			data.x,
    			data.y
    		);
        break;

//===========================================================
//===================== MAP + ITEMS =========================
//===========================================================
      case ServerMessageTypes.MAP_INFO :
        Console.Log('Map Info' , 1 , 'map');

        //Info Mappa
        GAME.MAP_INFO = {
          'id' : data.i.id,
          'name' : data.i.name,
          'ground' : data.i.ground_icon
        };
        //Info oggetti intorno al pg
        if(data.m.length > 0) {
          for(var i = 0 ; i < data.m.length ; i++) {
            GAME.ITEMS[data.m[i].id] = data.m[i];
          }
        }

        Interface.createBar('MENU_BAR');
        Game.play(); // PLAY THE GAME
        break;

//===========================================================
//======================= LOGOUT ============================
//===========================================================
      case ServerMessageTypes.LOGOUT :
        Console.Log('Logout Unit' , 1 , 'map');

        delete GAME.OTHER_PLAYERS[data.id];
        break;

//===========================================================
//===================== MAP DETAILS =========================
//===========================================================
      case ServerMessageTypes.LANDS :
        Console.Log('Lands' , 1 , 'map');

        // width - height - icon - id - obstacle
        for(var i = 0 ; i < data.a.length ; i++) {
          var item = data.a[i];
          if(item) {
            GAME.INFO.LANDS[item.id] = item;
          }
        }
        break;

//===========================================================
//======================= OBJECTS ===========================
//===========================================================
      case ServerMessageTypes.OBJECTS :
        Console.Log('Objects' , 1 , 'map');

        for(var i = 0 ; i < data.a.length ; i++) {
          var item = data.a[i];
          if(item) {
            GAME.INFO.OBJECTS[item.id] = item;
          }
        }
        break;

//===========================================================
//==================== BAD COLLISION ========================
//===========================================================
      case ServerMessageTypes.UNIT_COLLISION :
        Console.Log('Bad Collision' , 1 , 'error');

        player.x = data.x;
        player.y = data.y;
        break;

//===========================================================
//====================== LIST UNIT ==========================
//===========================================================
      case ServerMessageTypes.LIST_UNIT :
        Console.Log('List Unit' , 1 , 'map');

        GAME.LIST_UNIT = data.a;
        if(Interface.checkWindow('chooseUnit')) {
          WINDOWS['CHOOSE_UNIT'] = Interface.createWindow('chooseUnit' , 'CHOOSE_UNIT' , 400 , 300);
        }
        Interface.chooseUnit(data.a , WINDOWS['CHOOSE_UNIT'].body);
        break;

    }

    //Descrizione

    /*if(data.pid) { Console.Log(' [ PLAYER ID ] : ' + data.pid , 2 , 'wss'); }
    if(data.uid) { Console.Log(' [ UNIT ID ] : ' + data.uid , 2 , 'wss'); }
    if(data.i) { Console.Log(' [ MAP ] : ' + data.i.name , 2 , 'wss'); }
    if(data.n) { Console.Log(' [ NOME ] : ' + data.n , 2 , 'wss'); }
    if(data.x) { Console.Log(' [ X ] : ' + data.x , 2 , 'wss'); }
    if(data.y) { Console.Log(' [ Y ] : ' + data.y , 2 , 'wss'); }
    if(data.h) { Console.Log(' [ HP ] : ' + data.h , 2 , 'wss'); }
    if(data.s) { Console.Log(' [ NORMAL SPEED ] : ' + data.s , 2 , 'wss'); }
    if(data.b) { Console.Log(' [ VISIBILITY ] : ' + data.b , 2 , 'wss'); }
    if(data.r) { Console.Log(' [ RAZZA ] : ' + WS_Race[data.r] , 2 , 'wss'); }
    if(data.g) { Console.Log(' [ GENERE ] : ' + WS_Gender[data.g] , 2 , 'wss'); }
    if(data.v) { Console.Log(' [ VARIANTE ] : ' + WS_Variant[data.v] , 2 , 'wss'); }*/

  }
}

window.onerror = function(message, url, line, column, errorObj) {
  Console.Log(message , 2 , 'error');
  Game.togglePause();
}
