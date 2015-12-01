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

function fillBorders() {
  //var mapGridFlag = document.getElementById('mapGrid');
  if (window.selectedIcon) {
    var limit = document.getElementById('borderLimit').value;
    if (isNaN(limit) === true) {
      console.log('Border limit not valid: ' + limit + ' - ' + typeof limit);
      return;
    }

    var limitEnd = Math.round(limit / 32) * 32;
    for (var x = 0; x < limit; x += 32) {
      var newId = window.map.length;
      window.map[newId] = {id: newId, x: x, y: 0, land_id: window.selectedIcon};
      newId = window.map.length;
      window.map[newId] = {id: newId, x: x, y: limitEnd, land_id: window.selectedIcon};
    }

    for (var y = 0; y < limit; y += 32) {
      var newId = window.map.length;
      window.map[newId] = {id: newId, x: 0, y: y, land_id: window.selectedIcon};
      newId = window.map.length;
      window.map[newId] = {id: newId, x: limitEnd, y: y, land_id: window.selectedIcon};
    }

    window.mapCanvasValid = false;
  }
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
    window.mapXY = {};
    for (var i in window.map) {
      if (window.mapXY[window.map[i].x] === undefined) {
        window.mapXY[window.map[i].x] = {};
      }
      window.mapXY[window.map[i].x][window.map[i].y] = i;
    }
    console.log(window.mapXY);
    window.mapCanvasValid = false;
  }
}

function OnMouseDown(e) {
  // TODO - check that 1 is left button for every browser
  if (e.which == 1) {
    var griddedX = Math.round((e.clientX + window.x - 16) / 32) * 32;
    var griddedY = Math.round((e.clientY + window.y - 16) / 32) * 32;
    if (window.mapXY[griddedX] !== undefined && window.mapXY[griddedX][griddedY] !== undefined) {
      window.canvasSelectedIcon = window.mapXY[griddedX][griddedY];
      window.mapCanvasValid = false;
      //console.log('select gridded: ' + window.mapXY[griddedX][griddedY]);
      return;
    }

    for (var x = e.clientX - 30 + window.x; x < e.clientX + window.x; x++) {
      for (var y = e.clientY - 30 + window.y; y < e.clientY + window.y; y++) {
        if (window.mapXY[x] !== undefined && window.mapXY[x][y] !== undefined) {
          window.canvasSelectedIcon = window.mapXY[x][y];
          //console.log('cavas icon: ' + window.canvasSelectedIcon + ' - x: ' + x + ' - ' + y);
          window.mapCanvasValid = false;
          return;
        }
      }
    }

    if (window.canvasSelectedIcon !== undefined) {
      window.canvasSelectedIcon = undefined;
      window.mapCanvasValid = false;
    }

    if (window.selectedIcon) {
      var mapGridFlag = document.getElementById('mapGrid');
      var gridX = e.clientX + window.x;
      var gridY = e.clientY + window.y;
      if (mapGridFlag.checked) {
        gridX = Math.round(gridX / 32) * 32;
        gridY = Math.round(gridY / 32) * 32;
      }
      //console.log('insertx: ' + gridX + ' - ' + gridY);

      var newId = window.map.length;
      window.map[newId] = {id: newId, x: gridX, y: gridY, land_id: window.selectedIcon};

      if (window.mapXY[gridX] === undefined) {
        window.mapXY[gridX] = {};
      }
      window.mapXY[gridX][gridY] = newId;

      window.mapCanvasValid = false;
    }
  }
}

function selectIcon(id) {
  if (window.selectedIcon === id) {
    $('#icon' + window.selectedIcon).css('border', 'none');
    window.selectedIcon = undefined;
    return;
  }

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

    for (var i in window.map) {
      var image = document.getElementById('icon' + window.map[i].land_id);
      ctx.drawImage(image, window.map[i].x - window.x, window.map[i].y - window.y);

      if (window.canvasSelectedIcon == i) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.rect(window.map[i].x - window.x, window.map[i].y - window.y, 32, 32);
        ctx.stroke();
      }
    }

    mapCanvasValid = true;
  }
}

function deleteSelected() {
  if (window.canvasSelectedIcon) {
    var item = window.map[window.canvasSelectedIcon];
    delete window.mapXY[item.x][item.y];
    delete window.map[window.canvasSelectedIcon];
    window.mapCanvasValid = false;
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
