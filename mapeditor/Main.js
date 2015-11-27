function Main() {
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
  mapcanvas.height = window.innerHeight;
  console.log('width: ' + mapcanvas.width + ' - ' + mapcanvas.height);

  // Get mapcanvas graphic context
  ctx = mapcanvas.getContext('2d');

  // Create right mouse popup menu
  //CreateMenu();

  // Add event handlers
  //mapcanvas.addEventListener('click', OnMouseClick, true);
  mapcanvas.onmousedown = OnMouseDown;
  mapcanvas.onmouseup = OnMouseUp;

  // call Draw() every 20 milliseconds
  window.loopId = setInterval(Draw, 100);
}

function Draw() {
  if (mapCanvasValid == false) {
    window.ctx.clearRect(0, 0, window.mapcanvas.width, window.mapcanvas.height);

    //DrawResults();

    // Double 'for' cycle to cover branch lines with node shapes
    /*for (index in window.data.nodes) {
      DrawBranches(window.data.nodes[index]);
    }
    for (index in window.data.nodes) {
      DrawNode(window.data.nodes[index]);
    }

    DrawSelection();*/

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
    var clickPoint = GetCursorPosition(e);

    SelectNode(clickPoint);

    if (window.selectedNode) {
      dragging = true;
      mapcanvas.onmousemove = OnMouseMove;
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
