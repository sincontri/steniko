//=========================================================
//================== KEYBOARD CONTROL =====================
//=========================================================

	Game.controls = {
		left: false,
		up: false,
		right: false,
		down: false,
	};

	window.addEventListener("keydown", function(e) {
		switch(e.keyCode) {
			case 37: // left arrow
				Game.controls.left = true;
				break;
			case 38: // up arrow
				Game.controls.up = true;
				break;
			case 39: // right arrow
				Game.controls.right = true;
				break;
			case 40: // down arrow
				Game.controls.down = true;
				break;
		}
	}, false);

	window.addEventListener("keyup", function(e) {
		switch(e.keyCode) {
			case 37: // left arrow
				Game.controls.left = false;
				break;
			case 38: // up arrow
				Game.controls.up = false;
				break;
			case 39: // right arrow
				Game.controls.right = false;
				break;
			case 40: // down arrow
				Game.controls.down = false;
				break;
			case 80: // key P pauses the game
				//Game.togglePause();
				break;
		}
	}, false);


//=========================================================
//==================== MOUSE CONTROL ======================
//=========================================================

function clickReporter(e) {
  //e.button -> 0 left === 1 middle === 2 right
  //console.log('CLICK' , e.x, e.y, e.button);

  if(e.button === 0) {
    //MOVE PLAYER
    if(player) {
			var item_sel = player.checkElementPosition(e.x, e.y);
			var player_sel = player.checkPlayersPosition(e.x, e.y);

			//Se non ho selezionato nulla deseleziono
			if(!item_sel && !player_sel) {
				removeSelection();
			}

    }
  }

  if(e.button === 2) {
		player.goToPosition(e.x, e.y);
  }

	return false;
}

//DISABLE CONTEXT MENU (RIGHT CLICK ON MOUSE)
if (document.addEventListener) {
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  }, false);
} else {
  document.attachEvent('oncontextmenu', function() {
    window.event.returnValue = false;
  });
}

//=========================================================
//====================== CHECK DRAW =======================
//=========================================================

function checkDraw() {

	if(	Game.controls.left ||
			Game.controls.right ||
			Game.controls.up ||
			Game.controls.down ||
			player.destination) {

		GAME.DRAW = true;

	}

}
