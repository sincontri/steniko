var Drawer = {

  //Disegno oggetti della mappa
  Items : function() {

    if(Object.keys(GAME.ITEMS).length > 0) {

      var keys = Object.keys(GAME.ITEMS);
      for(var j = 0 ; j < keys.length ; j++) {
        var i = keys[j];
        //Calcolo coordinata
        var item_x = ((canvas.width/2) - (player.width/2)) + (GAME.ITEMS[i].x - player.x);
        var item_y = ((canvas.height/2) - (player.height/2)) + (GAME.ITEMS[i].y - player.y);

        //LAND
        var pathImage = CanvasEngine.buildPathImage(PATH.ITEMS , GAME.ITEMS[i].land_id , 'lands');
        if(!GAME.LOADED_IMAGES[pathImage]) {
          var img = new Image();
          img.onload = function () {};
          img.src = pathImage;
          GAME.LOADED_IMAGES[pathImage] = img;
        }
        context.drawImage(GAME.LOADED_IMAGES[pathImage] , item_x, item_y);

      }

    }

  },

  //Disegno equipaggiamenti presenti in mappa
  Objects : function() {

    if(Object.keys(GAME.ITEMS).length > 0) {

      var keys = Object.keys(GAME.ITEMS);
      for(var j = 0 ; j < keys.length ; j++) {
        var i = keys[j];

        //OBJECT
        if(GAME.ITEMS[i].object_id) {
          //Calcolo coordinata
          var item_x = ((canvas.width/2) - (player.width/2)) + (GAME.ITEMS[i].x - player.x);
          var item_y = ((canvas.height/2) - (player.height/2)) + (GAME.ITEMS[i].y - player.y);
          var pathImage = CanvasEngine.buildPathImage(PATH.OBJECTS , GAME.ITEMS[i].object_id , 'objects');

          if(!GAME.LOADED_IMAGES[pathImage]) {
            var img = new Image();
            img.onload = function () {};
            img.src = pathImage;
            GAME.LOADED_IMAGES[pathImage] = img;
          }
          context.drawImage(GAME.LOADED_IMAGES[pathImage] , item_x, item_y);
        }

      }

    }

  },

  //Disegno giocatori
  Players : function() {
    var keys = Object.keys(GAME.OTHER_PLAYERS);
  	if(keys.length > 0) {

  		for(var i = 0 ; i < keys.length ; i++) {

  		  //Calcolo coordinata
  		  var item_x = ((canvas.width/2) - (player.width/2)) + (GAME.OTHER_PLAYERS[keys[i]].x - player.x);
  		  var item_y = ((canvas.height/2) - (player.height/2)) + (GAME.OTHER_PLAYERS[keys[i]].y - player.y);

        GAME.OTHER_PLAYERS[keys[i]].draw(item_x, item_y);
  		}

  	}
  },

  //Disegno terreno
  Terrain : function() {

    //Creazione terreno
    if(!GAME.TERRAIN || GAME.TERRAIN.name !== GAME.MAP_INFO.name) {
      GAME.TERRAIN = {
        name : GAME.MAP_INFO.name,
        img : CanvasEngine.createImage(PATH.ITEMS + GAME.MAP_INFO.ground)
      }
    }

    //Senza nebbia
    var ptrn = context.createPattern(GAME.TERRAIN.img , 'repeat');
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = ptrn;
    context.fill();

  },

  //Disegno limitazione della visione
  Vision : function() {

    //context.globalAlpha = 0.4;
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = player.vision;

    var maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    var maskCtx = maskCanvas.getContext('2d');

    maskCtx.fillStyle = "black";
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    maskCtx.globalCompositeOperation = 'xor';
    maskCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    maskCtx.fill();

    context.drawImage(maskCanvas, 0, 0);

  },

  //Disegno Parametri
  Hud : function() {
    context.font="14px sans-serif";
    context.fillStyle="white";
    context.fillText('HP : ' + player.hp, (canvas.width-100), (canvas.height-90));
    context.fillText('SPEED : ' + player.speed, (canvas.width-100), (canvas.height-70));
    context.fillText('VISION : ' + player.vision, (canvas.width-100), (canvas.height-50));

    document.getElementById('player_HP_N').innerHTML = player.current_hp;
    document.getElementById('player_HP').className = 'c100 p' + Math.round((player.current_hp * 100)/player.hp);

    document.getElementById('player_ENERGY_N').innerHTML = player.current_energy;
    document.getElementById('player_ENERGY').className = 'c100 p' + Math.round((player.current_energy * 100)/player.energy);
  },

  Check : function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
};
