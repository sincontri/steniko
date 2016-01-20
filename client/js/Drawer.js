var Drawer = {

  getX : function(x) {
    return (GAME.CANVAS_WIDTH_HALF - player.width_half) + (x - player.x);
  },

  getY : function(y) {
    return (GAME.CANVAS_HEIGHT_HALF - player.height_half) + (y - player.y);
  },

  //Disegno oggetti della mappa
  Items : function() {

    for(var i in GAME.ITEMS) {

      //LAND
      if(GAME.ITEMS[i].land_id) {
        //Calcolo coordinata
        var item_x = this.getX(GAME.ITEMS[i].x);
        var item_y = this.getY(GAME.ITEMS[i].y);
        var pathImage = PATH.ITEMS + GAME.INFO.LANDS[ GAME.ITEMS[i].land_id ].icon + '.png';
        //context.drawImage(GAME.LOADED_IMAGES[pathImage] , item_x, item_y);
        context.drawImage(GAME.LOADED_IMAGES[pathImage] , GAME.ITEMS[i].x - GAME.CAMERA.xView, GAME.ITEMS[i].y - GAME.CAMERA.yView);
      }

    }

  },

  //Disegno equipaggiamenti presenti in mappa
  Objects : function() {

    for(var i in GAME.ITEMS) {
      //OBJECT
      if(GAME.ITEMS[i].object_id) {
        //Calcolo coordinata
        var item_x = this.getX(GAME.ITEMS[i].x);
        var item_y = this.getY(GAME.ITEMS[i].y);

        var arr_items = GAME.ITEMS[i].object_id;

        for(var x in arr_items) {

          var pathImage = PATH.OBJECTS + GAME.INFO.OBJECTS[ arr_items[x] ].icon + '.png';
          //context.drawImage(GAME.LOADED_IMAGES[pathImage] , item_x, item_y);
          context.drawImage(GAME.LOADED_IMAGES[pathImage] , GAME.ITEMS[i].x - GAME.CAMERA.xView, GAME.ITEMS[i].y - GAME.CAMERA.yView);

        }

      }
    }

  },

  //Disegno giocatori
  Players : function() {

		for(var i in GAME.OTHER_PLAYERS) {

		  //Calcolo coordinata
		  var item_x = this.getX(GAME.OTHER_PLAYERS[i].x);
      var item_y = this.getY(GAME.OTHER_PLAYERS[i].y);

      //GAME.OTHER_PLAYERS[i].draw(item_x, item_y);
      GAME.OTHER_PLAYERS[i].draw();
		}

  },

  //Disegno terreno
  Terrain : function() {

    //Creazione terreno
    if(!GAME.TERRAIN || GAME.TERRAIN.name !== GAME.MAP_INFO.name) {
      GAME.TERRAIN = {
        name : GAME.MAP_INFO.name,
        img : CanvasEngine.createImage(PATH.ITEMS + GAME.MAP_INFO.ground)
      };
    }

    //Senza nebbia
    var ptrn = context.createPattern(GAME.TERRAIN.img , 'repeat');
    context.rect(0, 0, GAME.CANVAS_WIDTH, GAME.CANVAS_HEIGHT);
    context.fillStyle = ptrn;
    context.fill();

  },

  //Disegno limitazione della visione
  Vision : function() {

    var centerX = player.x - GAME.CAMERA.xView;
    var centerY = player.y - GAME.CAMERA.yView;

    maskCanvas.width = GAME.CANVAS_WIDTH;
    maskCanvas.height = GAME.CANVAS_HEIGHT;

    //GRANDIENT
    var gradient = maskCtx.createRadialGradient(centerX, centerY, player.vision - 50, centerX, centerY, player.vision);
    gradient.addColorStop(0, "rgba(50,50,50,0)");
    gradient.addColorStop(1, "black");

    //maskCtx.fillStyle = "black";
    maskCtx.globalAlpha = 0.3;
    maskCtx.fillStyle = gradient;
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    //maskCtx.globalCompositeOperation = 'xor';
    //maskCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    maskCtx.fill();

    context.drawImage(maskCanvas, 0, 0);

  },

  //Disegno Parametri
  Hud : function() {
    context.font="14px sans-serif";
    context.fillStyle="white";
    context.fillText('HP : ' + player.hp, (GAME.CANVAS_WIDTH-100), (GAME.CANVAS_HEIGHT-90));
    context.fillText('SPEED : ' + player.speed, (GAME.CANVAS_WIDTH-100), (GAME.CANVAS_HEIGHT-70));
    context.fillText('VISION : ' + player.vision, (GAME.CANVAS_WIDTH-100), (GAME.CANVAS_HEIGHT-50));

    //Interface.startHUD();
    $("#player_HP").val(player.current_hp).trigger("change");
    $("#player_ENERGY").val(player.current_energy).trigger("change");
  },

  Check : function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    GAME.CAMERA.follow(player, GAME.CANVAS_WIDTH_HALF, GAME.CANVAS_HEIGHT_HALF);

    if(GAME.CANVAS_WIDTH !== window.innerWidth || GAME.CANVAS_HEIGHT !== window.innerHeight) {

      GAME.CANVAS_WIDTH = window.innerWidth;
      GAME.CANVAS_HEIGHT = window.innerHeight;
      GAME.CANVAS_WIDTH_HALF = window.innerWidth/2;
      GAME.CANVAS_HEIGHT_HALF = window.innerHeight/2;

    }
  },

  //Selezione di cio che il puntatore ha cliccato
  Selector : function() {
    //Selector
    if(SELECTION_MOUSE) {

      var item_x = SELECTION_MOUSE.item_x - GAME.CAMERA.xView;
      var item_y = SELECTION_MOUSE.item_y - GAME.CAMERA.yView;

      context.lineWidth = 2;         // thickness
      try {
        //Items
        context.strokeStyle = SELECTOR.ITEM;
        context.strokeRect(item_x, item_y, GAME.LOADED_IMAGES[SELECTION_MOUSE.img].width, GAME.LOADED_IMAGES[SELECTION_MOUSE.img].height);
      } catch(e) {
        //Players
        context.strokeStyle = SELECTOR.PLAYERS;
        context.strokeRect(item_x, item_y, SELECTION_MOUSE.img.width, SELECTION_MOUSE.img.height);
      }

    }

    //Movement
    if(player.destination) {

      var item_x = this.getX(player.x + player.destination.x);
      var item_y = this.getY(player.y + player.destination.y);

      context.strokeStyle = SELECTOR.MOVE;  // some color/style
      context.lineWidth = 2;         // thickness
      //context.strokeRect(item_x, item_y, 32, 32);
      context.strokeRect(player.x + player.destination.x - GAME.CAMERA.xView, player.y + player.destination.y - GAME.CAMERA.yView, 32, 32);
    }
  }
};
