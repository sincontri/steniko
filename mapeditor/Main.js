function Main() {
  window.mapId = location.search.split('mapId=')[1];
  if (isNaN(window.mapId) === true) {
    console.log('mapId is undefined');
    return;
  }

  // Global Variables
  window.shapesSize = 15;
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
  window.mapCanvasValid = true;

  // Create html mapcanvas handler
  mapcanvas = document.getElementById('mapcanvas');
  mapcanvas.width = window.innerWidth - 300;
  mapcanvas.height = window.innerHeight - 10;
  console.log('width: ' + mapcanvas.width + ' - ' + mapcanvas.height);

  // Get mapcanvas graphic context
  ctx = mapcanvas.getContext('2d');

  // Create right mouse popup menu
  //CreateMenu();

  // Add event handlers
  //mapcanvas.addEventListener('click', OnMouseClick, true);
  mapcanvas.onmousedown = OnMouseDown;
  mapcanvas.onmouseup = OnMouseUp;

  window.addEventListener('keydown', keyPressed, false);
  //mapcanvas.onkeypress = keyPressed;

  iconsPanel = document.getElementById('iconsPanel');
  iconsPanel.width = 280;
  iconsPanel.height = window.innerHeight - 10;

  window.x = 400;
  window.y = 400;

  window.loadCompleted = false;

  openConnection();

  // call Draw() every 20 milliseconds
  window.loopId = setInterval(Draw, 100);
}

function keyPressed(e) {
  if (e.keyCode === 39) {
    window.x += 32;
    window.mapCanvasValid = false;
  } else if (e.keyCode === 40) {
    window.y += 32;
    window.mapCanvasValid = false;
  } else if (e.keyCode === 37) {
    window.x -= 32;
    window.mapCanvasValid = false;
  } else if (e.keyCode === 38) {
    window.y -= 32;
    window.mapCanvasValid = false;
  }
}

function openConnection() {
  var code = encodeURIComponent(btoa('![è#-C1pp@L1pp@0!#]ò'));
  window.conn = new WebSocket('ws://double-triskel.rhcloud.com:8000', code);
  window.conn.onopen = function() {
    console.log('Websocket connetion opened.');
  };
  window.conn.onerror = function(error) {
    console.log('websocket ERROR: ' + error);
  };
  window.conn.onmessage = socketMessage;
}

function socketMessage(message) {
  var msg = JSON.parse(message.data);
  if (msg.mt === 8) {
    window.lands = msg.a;
    var count = 0;
    for (var i in window.lands) {
      var land = window.lands[i];
      if (land === null || land === undefined) {
        continue;
      }
      $('#iconsPanel').append("<img id='icon" + land.id + "' src='icons/" + land.icon +
        ".png' onclick='javascript:selectIcon(" + land.id + ");'/>");
    }
    window.loadCompleted = true;
  }

  if (msg.mt === 4) {
    window.mapInfo = msg.i;
    window.map = msg.m;
    /*window.images = [];
    for (var i in window.map) {
      window.images[i] = new Image();
      window.images[i].src = window.map[i].icon;
    }*/
    window.mapCanvasValid = false;
  }
}

function selectIcon(id) {
  if (window.selectedIcon) {
    $('#icon' + window.selectedIcon).css('border', 'none');
  }
  window.selectedIcon = id;
  $('#icon' + id).css({
    'border-color': '#C1E0FF',
    'border-width': '1px',
    'border-style': 'solid'
  });
}

function Draw() {
  if (window.loadCompleted === false) {
    console.log('images loading in progress');
    return;
  }

  if (mapCanvasValid == false) {
    window.ctx.clearRect(0, 0, window.mapcanvas.width, window.mapcanvas.height);
    /*var midX = window.mapcanvas.width / 2;
    var midY = window.mapcanvas.height / 2;*/

    for (var i in window.map) {
      //var item = window.map[i];
      var image = document.getElementById('icon' + window.map[i].land_id);
      ctx.drawImage(image, window.map[i].x - window.x, window.map[i].y - window.y);
    }

    mapCanvasValid = true;
  }
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
    window.ctx.fillStyle = 'rgb(187,158,255)';
    window.ctx.fillRect(node.point.x - window.shapesSize, node.point.y - window.shapesSize, window.shapesSize * 2,
      window.shapesSize * 2);
  } else if (node instanceof Event) {
    // Event
    window.ctx.fillStyle = 'rgb(251,178,203)';
    window.ctx.beginPath();
    window.ctx.arc(node.point.x, node.point.y, window.shapesSize, 0, Math.PI * 2, true);
    window.ctx.closePath();
    window.ctx.fill();
  } else {
    // Result
    window.ctx.fillStyle = 'rgb(182,213,151)';
    window.ctx.beginPath();
    window.ctx.moveTo(node.point.x - window.shapesSize - window.shapesSize / 3, node.point.y - window.shapesSize);
    window.ctx.lineTo(node.point.x + window.shapesSize + window.shapesSize / 3, node.point.y);
    window.ctx.lineTo(node.point.x - window.shapesSize - window.shapesSize / 3, node.point.y + window.shapesSize);
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

function OnMouseDown(e) {
  // TODO - check that 1 is left button for every browser
  if (e.which == 1) {
    //var click = GetCursorPosition(e);
    if (window.selectedIcon) {
      //console.log(e.clientX + ' - ' + e.clientY);
      var mapGridFlag = document.getElementById('mapGrid');
      var gridX = e.clientX;
      var gridY = e.clientY;
      if (mapGridFlag.checked) {
        gridX = Math.round(e.clientX / 32) * 32;
        gridY = Math.round(e.clientY / 32) * 32;
      }

      var newId = window.map.length;
      window.map[newId] = {id: newId, x: gridX + window.x, y: gridY + window.y, land_id: window.selectedIcon};
      window.mapCanvasValid = false;
    }

    /*SelectNode(clickPoint);

    if (window.selectedNode) {
      dragging = true;
      mapcanvas.onmousemove = OnMouseMove;
    }*/
  }
}

function GetCursorPosition(e) {
  var x;
  var y;

  if (e.pageX != undefined && e.pageY != undefined) {
    x = e.pageX;
    y = e.pageY;
  } else {
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  x -= window.mapcanvas.offsetLeft;
  y -= window.mapcanvas.offsetTop;

  //var cell = new Cell( Math.floor( y/kPieceHeight ), Math.floor( x/kPieceWidth ) );

  return {x: x, y: y};
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
  mapcanvas.onmousemove = null;
}

function DrawSelection() {
  if (window.selectedNode) {
    window.ctx.strokeStyle = selectionColor;
    window.ctx.lineWidth = 2;
    if (window.selectedNode instanceof Decision) {
      // Decision
      window.ctx.strokeRect(window.selectedNode.point.x - window.shapesSize - 1, window.selectedNode.point.y -
        window.shapesSize - 1, window.shapesSize * 2 + 1, window.shapesSize * 2 + 1);
    } else if (window.selectedNode instanceof Event) {
      // Event
      window.ctx.beginPath();
      window.ctx.arc(window.selectedNode.point.x, window.selectedNode.point.y, window.shapesSize + 1, 0, Math.PI * 2,
        true);
      window.ctx.closePath();
      window.ctx.stroke();
    } else {
      // Result
      window.ctx.beginPath();
      window.ctx.moveTo(window.selectedNode.point.x - window.shapesSize - window.shapesSize / 3 - 1,
        window.selectedNode.point.y - window.shapesSize - 1);
      window.ctx.lineTo(window.selectedNode.point.x + window.shapesSize + window.shapesSize / 3 + 1,
        window.selectedNode.point.y);
      window.ctx.lineTo(window.selectedNode.point.x - window.shapesSize - window.shapesSize / 3 - 1,
        window.selectedNode.point.y + window.shapesSize + 1);
      window.ctx.closePath();
      window.ctx.stroke();
    }
  }
}
