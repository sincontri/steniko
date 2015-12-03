//====================================================================
//======================= INTERFACE BUILDER ==========================
//====================================================================

var Interface = {

//=========================================================
//===================== CHECK WINDOW ======================
//=========================================================
  checkWindow : function(id) {
    if(document.getElementById(id)) {
      return false;
    } else {
      return true;
    }
  },

  checkValues : function(data , id) {
    if(!data || Object.keys(data).length === 0 || !id) {
      return false;
    }
  },
//=========================================================
//==================== BAR MENU BOTTOM ====================
//=========================================================
  createBar : function(id) {
    var text = '<div id="' + id + '" class="absolute window interface_bar">';

    for(var i = 0 ; i < MENU_BAR.length ; i++) {
      text += '<div id="' + MENU_BAR[i].id + '" class="interface_bar_voice txt_center fa ' + MENU_BAR[i].icon + '" style="line-height:40px;"></div>';
    }
    text += '</div>';

    document.getElementById('interface').innerHTML += text;

    for(var i = 0 ; i < MENU_BAR.length ; i++) {
      Listener.create(MENU_BAR[i].id , MENU_BAR[i].listener);
    }
  },

//=========================================================
//==================== WINDOW CREATE ======================
//=========================================================

  createWindow : function(id , title, width, height) {
    var text = '<div id="' + id + '" class="draggable resizeable absolute window" style="width:' + width + 'px;height:' + height + 'px;top:50px;left:50px;">';
    text += '<div id="' + id + '_close" class="absolute closeWindow txt_center fa fa-close" style="z-index:70;"></div>';
    text += '<div id="' + id + '_title" class="absolute handle txt_center"> ' + title + ' </div>';
    text += '<div id="' + id + '_body"></div>';
    text += '</div>';
    document.getElementById('interface').innerHTML += text;
    //Creazione listener per distruttore
    Listener.create(id + '_close' , 'destroyWindow' , id);

    return {
      id:id,
      body:id + '_body',
      title:title,
      width:width,
      height:height
    };
  },



  //Crea l'interfaccia HTML Per scegliere l'unita a inizio gioco
  chooseUnit : function(data , id) {
    var box = document.getElementById(id);
    var text = '<table cellpadding="0" cellspacing="0" class="fullWidth box">';
    text += '<tr class="infoRow"><td></td> <td>NAME</td> <td>HP</td> <td>ENERGY</td> <td>MAP</td></tr>';

    for(var i = 0 ; i < data.length ; i++) {

      if(CHOOSE_UNIT === data[i].id) {
        text += '<tr class="menuRow_active">';
      } else {
        text += '<tr onclick="Listener.chooseUnit('+data[i].id+');" class="menuRow">';
      }

      text += '<td> <img src="' + buildImage(data[i].race_id , data[i].variant_id , data[i].gender_id) + '"/></td>';
      text += '<td>' + data[i].unitName + '</td><td>' + data[i].hp + '</td><td>' + data[i].energy + '</td>';
      text += '<td>' + data[i].mapName + '</td></tr>';
    }

    text += '<tr class="menuButton"><td align="center" colspan="5"><div class="buttonMenu" id="chooseUnit_button">Gioca</div></td></tr></table>';

    box.innerHTML = text;

    //Creazione listener per il button
    Listener.create('chooseUnit_button' , 'chooseUnit_SEND');
  },



  //Selezione oggetto
  selectionObject : function(data , id) {
    if(!this.checkValues(data, id)) {
      return false;
    }

    //icon: "armour/robe1" id: 1 name: "Robe" real_name: "Robe" type: 1 values: "{"p":2,"e":1}" weight: 2
    var box = document.getElementById(id + '_body');
    var text = '<table cellpadding="0" cellspacing="0" class="fullWidth">';
    text += '<tr><td><img src="' + PATH.OBJECTS + data.icon + '.png"/></td>';
    text += '<td>' + Object_Types[data.type] + '</td></tr>';
    if(data.values.p) { text += '<tr><td>Protezione</td><td>' + data.values.p + '</td></tr>'; }
    if(data.values.e) { text += '<tr><td>Ingombro</td><td>' + data.values.e + '</td></tr>'; }
    text += '<tr><td>Peso</td><td>' + data.weight + '</td></tr></table>';

    box.innerHTML = text;
    document.getElementById(id + '_title').innerHTML = data.name;
  },



  //Selezione giocatore
  selectionPlayer : function(data , id) {
    if(!this.checkValues(data, id)) {
      return false;
    }

    var box = document.getElementById(id + '_body');
    var text = '<table cellpadding="0" cellspacing="0" class="fullWidth relative">';
    text += '<tr><td><img src="' + data.img.src + '"/></td>';
    text += '<td>' + data.name + '</td></tr>';
    text += '<tr><td>HP</td><td> <div class="prbar"><div id="hp_bar_' + data.uid + '" class="hp_color"></div></div> </td></tr>';
    text += '<tr><td>ENERGY</td><td> <div class="prbar"><div id="energy_bar_' + data.uid + '" class="energy_color"></div></div> </td></tr>';
    text += '<tr><td>Razza</td><td>' + WS_Race[data.race] + '</td></tr>';
    text += '<tr><td>Velocità</td><td>' + data.speed + '</td></tr>';


    box.innerHTML = text;
    document.getElementById(id + '_title').innerHTML = data.name;
    document.getElementById('hp_bar_' + data.uid).style.width = Math.round((data.current_hp * 100)/data.hp);
    document.getElementById('energy_bar_' + data.uid).style.width = Math.round((data.current_energy * 100)/data.energy);
  },

  createInventory : function(id) {
    var box = document.getElementById(id + '_body');

    var text = '<div class="inventory_bag relative">';

    for(var i = 0; i < INVENTORY_SIZE ; i++) {
        text += '<div></div>';
    }
    text += '</div>';

    box.innerHTML = text;
  }

};

//====================================================================
//====================== LISTENER INTERFACE ==========================
//====================================================================

var Listener = {

  create : function(id, function_name , param) {
    document.getElementById(id).addEventListener('click' , window[function_name]);
    if(param) {
      document.getElementById(id).param = param;
    }
  },

  chooseUnit : function(id) {
    CHOOSE_UNIT = id;
    Interface.chooseUnit(GAME.LIST_UNIT, WINDOWS['CHOOSE_UNIT'].body);
  }
}

//====================================================================
//============================ ONLOAD ================================
//====================================================================

window.onload = function(e) {
  //$( ".draggable" ).draggable({ handle: "div.handle" });
}

//====================================================================
//============================= SEND =================================
//====================================================================

function chooseUnit_SEND() {
  if(!CHOOSE_UNIT) {
    return false;
  }
  connection.send(JSON.stringify({
    mt:ClientMessageTypes.CHOOSE_UNIT,
    i:CHOOSE_UNIT
  }));
  document.getElementById('chooseUnit').style.display = 'none';
}


//====================================================================
//============================ EVENTS ================================
//====================================================================

function destroyWindow(evt) {
  var element = document.getElementById(evt.target.param);
  element.parentNode.removeChild(element);
}

function createInventory() {
  if(!WINDOWS['INVENTORY']) {
    WINDOWS['INVENTORY'] = Interface.createWindow('inventory' , 'INVENTORY' , 202 , 282);
  }
  Interface.createInventory(WINDOWS['INVENTORY'].id);
}






//====================================================================
//========================== DRAGGABLE ===============================
//====================================================================

// target elements with the "draggable" class
interact('.draggable').allowFrom('.handle')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      var textEl = event.target.querySelector('p');

      textEl && (textEl.textContent =
        'moved a distance of '
        + (Math.sqrt(event.dx * event.dx +
                     event.dy * event.dy)|0) + 'px');
    }
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;

//====================================================================
//========================= RESIZEABLE ===============================
//====================================================================

interact('.resizeable')
  .resizable({
    snap: {
      targets: [
        interact.createSnapGrid({ x: 40, y: 40 })
      ],
      range: Infinity,
      relativePoints: [ { x: 0, y: 0 } ]
    },
    preserveAspectRatio: false,
    edges: { left: true, right: true, bottom: true, top: true }
  })
  .on('resizemove', function (event) {
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    //target.textContent = Math.round(event.rect.width) + '×' + Math.round(event.rect.height);
  });
