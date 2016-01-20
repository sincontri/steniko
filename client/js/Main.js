//====================================================================
//=========================== VARIABLES ==============================
//====================================================================

//Player
var player;
//Main webSocket
var connection,check_connection;
//Main Canvas
var canvas,context;
//Vision
var maskCanvas,maskCtx;

//Game Object
var GAME = {
  //Contiene i giocatori circostanti
  'OTHER_PLAYERS' : {},
  //Contiene le immagini del gioco caricate
  'LOADED_IMAGES' : {},
  //Contiene le informazioni della mappa in cui si sta giocando
  'MAP_INFO': {},
  //Contiene la lista degli oggetti presenti sulla mappa
  'ITEMS' : {},
  //Contiene l'anagrafica degli oggetti del gioco
  'INFO' : {
    'LANDS' : {},
    'OBJECTS': {}
  },
  //Contiene la lista delle unita create dall'utente
  'LIST_UNIT': [],
  'INVENTORY': [],
  //HUD
  'HUD': {},
  //Flag per fare la draw o meno
  'DRAW' : false,
  //Variabili che tengono in memoria variabili che ricalcolo spesso
  'CANVAS_WIDTH' : 0,
  'CANVAS_HEIGHT' : 0,
  'CANVAS_WIDTH_HALF' : 0,
  'CANVAS_HEIGHT_HALF' : 0,
  'SELECT_ITEM' : {},
  'TIMER_LOCK' : 10 //Timer lock in multi item in secondi
};

var WINDOWS = {};
var MENU_BAR = [
  { id:'INVENTORY', icon:'fa-archive', listener:'createInventory' },
  { id:'CHARACTER', icon:'fa-male', listener:'createCharacter' },
];

//====================================================================
//======================== CALLBACK GOOGLE ===========================
//====================================================================

function checkConnection() {
  if(check_connection) {
    //document.body.style.cursor = 'default';
  } else {
    console.log('WEBSOCKET NOT WORKING');
  }
}

function signInCallback(authResult) {
  CanvasEngine._checkValue(authResult['code'], 'string');

  // Nasconde il pulsante e rende visibile la finestra di gioco
  document.getElementById('signinButton').style.display = 'none';
  document.getElementById('interface').style.display = 'block';
  document.getElementById('canvas').style.display = 'table';

  connection = new WebSocket(WEBSOCKET, encodeURIComponent(authResult['code']));

  //Check se la connessione � avvenuta o meno
  //document.body.style.cursor = 'wait';
  setTimeout(checkConnection , 1500);

  connection.onopen = function () {
    Console.Log('Send Open Message' , 1 , 'cmd');
  };

  // Loggare poi gli errori
  connection.onerror = function (error) {
    Console.Log('WebSocket Error ' , 1 , 'error');
    Console.Log(error , 2 , 'error');
    Console.Log(' ' , 3 , 'error')
  };

  // Log messages from the server
  connection.onmessage = function (e) {
    check_connection = true;
    CanvasEngine.onMessage(e.data);
  };
}

//====================================================================
//============================= GAME =================================
//====================================================================

window.onload = function() {
  var button = document.getElementById('signinButton');
  button.src= "img/google.png";
  button.onload = function() {
    button.style.width = '300px';
    button.style.marginTop = '-33px';
    button.style.marginLeft = '-150px';
  }

  document.getElementById('signinButton').addEventListener('click', function() {
    auth2.grantOfflineAccess({'redirect_uri': 'postmessage'}).then(signInCallback);
  });
}

document.addEventListener('DOMContentLoaded', function() {

//=========================================================
//==================== AUTHENTICATION =====================
//=========================================================

  gapi.load('auth2', function() {
    auth2 = gapi.auth2.init({
      client_id: '312071925620-5naovu338onpjg024ngsn07hp702ajma.apps.googleusercontent.com'
    });
  });

//=========================================================
//===================== DECLARATIONS ======================
//=========================================================

	(function(){

    //Game Level
    canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
    //Vision Level
    maskCanvas = document.createElement('canvas');
    maskCtx = maskCanvas.getContext('2d');

//=========================================================
//====================== LOOP GAME ========================
//=========================================================

		var update = function() {
		  player.update(STEP);
      GAME.CAMERA.update();
		}

		var draw = function() {

      checkDraw();
      if(GAME.DRAW === false) {
        context.restore();
        return false;
      }

      //Reset Schermo
      Drawer.Check();
			context.clearRect(0, 0, GAME.CANVAS_WIDTH, GAME.CANVAS_HEIGHT);
      GAME.ROOM.map.draw(GAME.CAMERA.xView, GAME.CAMERA.yView);

      //Drawer.Terrain();
      Drawer.Items();
      Drawer.Objects();

      Drawer.Players();
      Drawer.Selector();
      player.draw();

      Drawer.Vision();
      Drawer.Hud();

      GAME.DRAW = false;
		}

//=========================================================

		var gameLoop = function() {
			update();
			draw();
		}

//=========================================================
//===================== STATUS GAME =======================
//=========================================================
  var runningId = -1;
	var sendPosition = -1;

    Game.play = function(){
      document.getElementById('systemInfo').style.display = 'block';
			if(runningId == -1){
				runningId = setInterval(function() {
					gameLoop();
				}, INTERVAL);
			}

			//SEND POSITION
			if(sendPosition == -1 && player){
				sendPosition = setInterval(function() {
					player.sendPosition();
				}, MOVE_INTERVAL);
			}
		}

		Game.togglePause = function() {
			if(runningId === -1){
				Game.play();
			} else {
				clearInterval(runningId);
				runningId = -1;
			}
		}

	})();


  //Enable Mouse
  canvas.addEventListener('click', clickReporter, false);
  canvas.addEventListener('contextmenu', clickReporter, false);
});

//====================================================================
//============================ CODICE ================================
//====================================================================

function Main() {
  // Global Variables
  window.shapesSize = 15;
  window.data = new Data();
  window.lastClickPoint = null;
  window.selectedNode = null;
  window.selectionColor = 'rgb(255,214,35)';
  window.selectionWidth = 2;
  window.branchesColor = 'rgb(255,214,35)';
  window.bestBranchesColor = 'rgb(255,255,0)';
  //window.bestBranchesColor = 'rgb(241,255,100)';
  window.branchesWidth = 2;
  window.bestBranchesWidth = 4;
  window.dragging = false;
  window.defaultFont = '10px Tahoma, sans-serif';
  window.previousValue;	// Used to keep the last modified branch value

  // Set by InvalidateCanvas() to redraw everything at next interval
  window.canvasValid = true;

  // Create html canvas handler
  canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Get canvas graphic context
  ctx = canvas.getContext('2d');

  // Create right mouse popup menu
  //CreateMenu();

  // Add event handlers
  //canvas.addEventListener('click', OnMouseClick, true);
  canvas.onmousedown = OnMouseDown;
  canvas.onmouseup = OnMouseUp;

  ShowWelcome();

  // call Draw() every 20 milliseconds
  StartDrawLoop();
}

function StartDrawLoop() {
  window.loopId = setInterval(Draw, 20);
}

function StopDrawLoop() {
  clearInterval(window.loopId);
}

function InvalidateCanvas() {
  window.canvasValid = false;
}

function Draw() {
  if (canvasValid == false) {
    window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);

    //DrawResults();

    // Double 'for' cycle to cover branch lines with node shapes
    /*for (index in window.data.nodes) {
      DrawBranches(window.data.nodes[index]);
    }
    for (index in window.data.nodes) {
      DrawNode(window.data.nodes[index]);
    }

    DrawSelection();*/

    canvasValid = true;
  }
}

function ShowWelcome(clear) {
  if (clear) {
    ClearMessages();
  }
  ShowMessage('Welcome to Triskel the game Alpha!');
}

function DrawResults() {
  for (index in window.data.nodes) {
    var node = window.data.nodes[index];

    var value = 0;
    if (window.calculus.nodesValues[node.id]) {
      value = RoundDecimals(window.calculus.nodesValues[node.id]);
    }

    window.ctx.font = 'bold 13px sans-serif';
    //window.ctx.fillStyle = '80A0A0';
    window.ctx.fillStyle = 'C4E8FF';

    var textDim = window.ctx.measureText(value);

    var posX = node.point.x - textDim.width / 2;
    var posY = node.point.y + window.shapesSize * 2;
    if (node instanceof Result) {
      posX = node.point.x + window.shapesSize * 2 - 4;
      posY = node.point.y + 4;
    }

    window.ctx.fillText(value, posX, posY);

    // Risk value
    if ((node instanceof Event || node.fatherNode instanceof Event) && localStorage.Mode == 'risk') {
      var thirdValue = false;
      var rVal = '0';
      if (window.calculus.riskValues[node.id]) {
        rVal = RoundDecimals(window.calculus.riskValues[node.id]);
      }
      if (node.fatherNode instanceof Event) {
        var branch = window.data.branches[node.fatherNode.id][node.id];
        //-- in questo caso aggiungere il terzo valore preso dal ramo, oltre al valore del nodo
        /*if (node instanceof Event) {
          thirdValue = true;
          rThirdVal = RoundDecimals(window.calculus.riskValues[branch.id]);
        } else {*/
          rVal = RoundDecimals(window.calculus.riskValues[branch.id]);
        //}
      }
      var rDim = window.ctx.measureText(rVal);

      if (node instanceof Result) {
        window.ctx.fillText(rVal, node.point.x + window.shapesSize * 2 - 4, posY + 12);
      } else {
        window.ctx.fillText(rVal, node.point.x - rDim.width / 2, posY + 12);
      }

      /*if (thirdValue) {
        var rDim = window.ctx.measureText(rThirdVal);
        if (node instanceof Result) {
          window.ctx.fillText(rThirdVal, node.point.x + window.shapesSize * 2 - 4, posY + 24);
        } else {
          window.ctx.fillText(rThirdVal, node.point.x - rDim.width / 2, posY + 24);
        }
      }*/
    }
  }
}

function DrawNode(node) {
  if (node instanceof Decision) {
    // Decision
    window.ctx.fillStyle = "rgb(187,158,255)";
    window.ctx.fillRect(node.point.x - window.shapesSize, node.point.y - window.shapesSize, window.shapesSize*2, window.shapesSize*2);
  } else if (node instanceof Event) {
    // Event
    window.ctx.fillStyle = "rgb(251,178,203)";
    window.ctx.beginPath();
    window.ctx.arc(node.point.x, node.point.y, window.shapesSize, 0, Math.PI*2, true);
    window.ctx.closePath();
    window.ctx.fill();
  } else {
    // Result
    window.ctx.fillStyle = "rgb(182,213,151)";
    window.ctx.beginPath();
    window.ctx.moveTo(node.point.x - window.shapesSize - window.shapesSize/3, node.point.y - window.shapesSize);
    window.ctx.lineTo(node.point.x + window.shapesSize + window.shapesSize/3, node.point.y);
    window.ctx.lineTo(node.point.x - window.shapesSize - window.shapesSize/3, node.point.y + window.shapesSize);
    window.ctx.closePath();
    window.ctx.fill();
  }
}

function DrawBranches(node) {
  if (node instanceof Result) {
    return;
  }

  var subNodes = node.GetSubNodes();
  for (index in subNodes) {
    var subNode = subNodes[index];

    var branchColor = branchesColor;
    var branchWidth = branchesWidth;
    if (node.id in window.data.branches && subNode.id in window.data.branches[node.id]) {
      var branch = window.data.branches[node.id][subNode.id];
      if (branch.bestBranch) {
        branchWidth = bestBranchesWidth;
        branchColor = bestBranchesColor;
      }
    }

    window.ctx.lineWidth = branchWidth;
    window.ctx.strokeStyle = branchColor;
    window.ctx.beginPath();
    window.ctx.moveTo(node.point.x, node.point.y);
    window.ctx.lineTo(subNode.point.x /*- window.shapesSize*/, subNode.point.y);
    window.ctx.closePath();
    window.ctx.stroke();

    DrawLabels(node, subNode);
  }
}

function DrawLabels(node, subNode) {
  if (node.id in window.data.branches && subNode.id in window.data.branches[node.id]) {
    var middlePoint = CalcLineMiddlePoint(node.point, subNode.point);
    var lineAngle = CalcLineAngle(node.point, subNode.point);

    var branch = window.data.branches[node.id][subNode.id];
    branch.SetAllPositions(node, middlePoint, lineAngle);
    branch.SetAllAngles(node, lineAngle);
  }
}

function ShowMessage(msg) {
  var log = document.getElementById('log');
  var cr = '\n';
  if (log.value.length == 0) {
    cr = '';
  }
  log.value += cr + msg;
  log.scrollTop = log.scrollHeight;
}

function ClearMessages() {
  var log = document.getElementById('log');
  log.value = '';
}

function OnMouseDown(e) {
  // TODO - check that 1 is left button for every browser
  if (e.which == 1) {
    var clickPoint = GetCursorPosition(e);

    SelectNode(clickPoint);

    if (window.selectedNode) {
      dragging = true;
      canvas.onmousemove = OnMouseMove;
    }
  }
}

function SelectNode(clickPoint) {
  var previousSelectedNode = window.selectedNode;
  window.selectedNode = GetNodeAt(clickPoint);
  if (previousSelectedNode != window.selectedNode) {
    InvalidateCanvas();
  }
}

function OnMouseMove(e) {
  if (dragging && window.selectedNode) {
    var mousePoint = GetCursorPosition(e);
    window.selectedNode.point.x = mousePoint.x;
    window.selectedNode.point.y = mousePoint.y;
    InvalidateCanvas();
  }
}

function OnMouseUp() {
  dragging = false;
  canvas.onmousemove = null;
}

function GetNodeAt(point) {
  if (window.data.nodes) {
    for (index in window.data.nodes) {
      var nodePoint = window.data.nodes[index].point;

      if (point.x >= nodePoint.x - window.shapesSize &&
        point.x <= nodePoint.x + window.shapesSize &&
        point.y >= nodePoint.y - window.shapesSize &&
        point.y <= nodePoint.y + window.shapesSize) {

        return window.data.nodes[index];

      }
    }
  }
  return null;
}

function DrawSelection() {
  if (window.selectedNode) {
    window.ctx.strokeStyle = selectionColor;
    window.ctx.lineWidth = 2;
    if (window.selectedNode instanceof Decision) {
      // Decision
      window.ctx.strokeRect(window.selectedNode.point.x - window.shapesSize - 1, window.selectedNode.point.y - window.shapesSize - 1, window.shapesSize*2 + 1, window.shapesSize*2 + 1);
    } else if (window.selectedNode instanceof Event) {
      // Event
      window.ctx.beginPath();
      window.ctx.arc(window.selectedNode.point.x, window.selectedNode.point.y, window.shapesSize + 1, 0, Math.PI*2, true);
      window.ctx.closePath();
      window.ctx.stroke();
    } else {
      // Result
      window.ctx.beginPath();
      window.ctx.moveTo(window.selectedNode.point.x - window.shapesSize - window.shapesSize/3 - 1, window.selectedNode.point.y - window.shapesSize - 1);
      window.ctx.lineTo(window.selectedNode.point.x + window.shapesSize + window.shapesSize/3 + 1, window.selectedNode.point.y);
      window.ctx.lineTo(window.selectedNode.point.x - window.shapesSize - window.shapesSize/3 - 1, window.selectedNode.point.y + window.shapesSize + 1);
      window.ctx.closePath();
      window.ctx.stroke();
    }
  }
}

function CreateMenu() {
  var popup1 = new PopupMenu();
  popup1.add(window.locale['MenuDecision'][localStorage.Language], CreateDecisionNode);
  popup1.add(window.locale['MenuEvent'][localStorage.Language], CreateEventNode);
  popup1.add(window.locale['MenuResult'][localStorage.Language], CreateResultNode);
  popup1.addSeparator();
  popup1.add(window.locale['MenuDeleteNode'][localStorage.Language], DeleteSelectedNode);
  popup1.addSeparator();
  popup1.add(window.locale['SensibilityAnalysis'][localStorage.Language], SensibilityAnalysis);
  popup1.addSeparator();
  popup1.add(window.locale['MenuLoadSave'][localStorage.Language], LoadSaveTree);
  popup1.add(window.locale['MenuOptions'][localStorage.Language], Options);
  popup1.add(window.locale['MenuHelp'][localStorage.Language], Help);
  popup1.setSize(140, 0);
  popup1.bind('canvas');
  //popup1.bind(); // target is document
}

function Help() {
  window.open('Help.html', 'HelpWindow', 'width=500,height=400,left=200,top=100,toolbar=0,resizable=1,location=0,menubar=0,scrollbars=1');
}

function Options() {
  window.open('Options.html', 'OptionsWindow', 'width=260,height=400,left=300,top=200,toolbar=0,resizable=1,location=0,menubar=0,scrollbars=1');
}

function SensibilityAnalysis() {
  window.data.EnumerateBranchesForAnalysis();
  localStorage.setItem('branchesList', window.data.branchesLabels.join('|'));
  window.open('SensibilityAnalysis.html', 'SensibilityWindow', 'width=320,height=400,left=300,top=200,toolbar=0,resizable=1,location=0,menubar=0,scrollbars=1');
}

function LoadSaveTree() {
  if (typeof(localStorage) == undefined) {
    ShowMessage(window.locale['LocalStorageNS'][localStorage.Language]);
  } else {
    window.open('LoadSave.html', 'LoadSaveWindow', 'width=300,height=400,left=300,top=200,toolbar=0,resizable=1,location=0,menubar=0,,scrollbars=1');
  }
}

function DeleteSelectedNode() {
  if (window.selectedNode) {
    var answer = confirm(window.locale['Delete'][localStorage.Language]);
    if (answer) {
      window.data.DeleteNode(window.selectedNode);
      window.selectedNode = null;
      InvalidateCalculus();
      InvalidateCanvas();
    }
  } else {
    ShowMessage(window.locale['NoSelected'][localStorage.Language]);
  }
}

function CreateNode(type) {
  if (!window.data.firstNode || selectedNode) {
    var newNode = data.AddNode(window.lastClickPoint.x, window.lastClickPoint.y, type, window.selectedNode);
    if (newNode) {
      // Create node
      ShowMessage(window.locale['Created'][localStorage.Language] + Translate(type));
      if (type != 'Result') {
        selectedNode = newNode;
      }
      InvalidateCalculus();
      InvalidateCanvas();
    } else {
      // Result nodes cannot have subnodes.
      ShowMessage(window.locale['NoSubNodes'][localStorage.Language]);
    }
  } else {
    // Please select a node.
    ShowMessage(window.locale['Select'][localStorage.Language]);
  }
}

function CreateDecisionNode(target) {
  CreateNode('Decision');
}

function CreateResultNode(target) {
  CreateNode('Result');
}

function CreateEventNode(target) {
  CreateNode('Event');
}
