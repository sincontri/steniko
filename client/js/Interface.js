document.addEventListener('DOMContentLoaded', function() {
  Interface.origin = document.getElementById('interface');
});

var Interface = {

  //Variables
  origin : document.getElementById('interface'),

  setElementWithText : function(type , text) {
    var element = document.createElement(type);
    element.appendChild( document.createTextNode(text) );
    return element;
  },

  setElementWithImg : function(type , src) {
    var element = document.createElement(type);
    var img = document.createElement('img');
    img.src = src;
    element.appendChild(img);
    return element;
  },

  setElementWithHealthBar : function(id , classes , current , max) {
    var container = document.createElement('div');
    var style = {};
    style.class = ['prbar'];
    this.setStyle(div, style);

    var div = document.createElement('div');
    var style = {};
    style.class = [classes];
    style.style = ['width:' + Math.round((current * 100)/max) + 'px;'];
    style.id = id;
    this.setStyle(div, style);

    container.appendChild(div);
    return container;
  },

  setElementWithEquipSlot : function(text) {
console.log(player.wear[text])

    var div = document.createElement('div');
    var style = {};
    style.class = ['slot'];

    //se non è equipaggiato nulla mostra il nome dello slot
    if(!player.wear[text]) {
      style.text = text;
    }

    this.setStyle(div, style);

    //se è equipaggiato qualcosa mostra l'immagine
    if(player.wear[text]) {
      div.appendChild( player.wear[text] );
    }

    return div;
  },

  setElementWithDropButtons : function(text , valueCallback) {
    var div = document.createElement('div');
    var style = {};
    if(valueCallback === 1) {
      style.class = ['hoverButton' , 'takeall_button'];
    } else {
      style.class = ['hoverButton' , 'takethis_button'];
    }
    style.callback = 'takeItems';
    style.value = valueCallback;
    style.text = text;
    this.setStyle(div , style);
    return div;
  },

  setElementWithButton : function(text, callback , valueCallback) {
    var div = document.createElement('div');
    var style = {};
    style.class = ['hoverButton' , 'txt_center'];
    style.callback = callback;
    style.value = valueCallback;
    style.text = text;
    this.setStyle(div , style);
    return div;
  },

  //=========================================================
  //======================== CHECKS =========================
  //=========================================================
  checkWindow : function(id) {
    if(document.getElementById(id)) {
      return false;
    }
    return true;
  },

  checkValues : function(data , id) {
    if(id.length) {
      for(var i in data) {
        return true;
      }
    }
    return false;
  },

  //=========================================================
  //======================= SET STYLE =======================
  //=========================================================

  setStyle : function(element , style) {

    //Controllo che l'elemento sia valido
    if(!element) {
      console.error = 'ELEMENT IS NOT VALID!';
      return false;
    }
    if(style.id) { element.id = style.id; }
    if(style.class) { element.className = style.class.join(' '); }
    if(style.style) {
      //element.styleSheet.cssText = style.style.join(';');
      for(var i in style.style) {
        var s = style.style[i];
        var ss = s.split(':');
        element.style[ss[0]] = ss[1];
      }
    }
    if(style.text) { element.appendChild( document.createTextNode(style.text) ); }
    if(style.callback) {

      if(style.value) {
        element.onclick = function () {
          var function_name = style.callback;
          var values = style.value;
          window[function_name](values);
        }
      } else {
        element.onclick = function () {
          var function_name = style.callback;
          window[function_name]();
        }
      }
    }

  },

  //=========================================================
  //====================== CREATE BAR =======================
  //=========================================================

  createBar : function(id) {

    var div_1 = document.createElement('div');

    var style = {};
    style.class = ['absolute' , 'window' , 'interface_bar'];
    style.style = ['border-right:0px' , 'border-left:0px'];
    this.setStyle(div_1, style);

    for(var i = 0 ; i < MENU_BAR.length ; i++) {
      var div_2 = document.createElement('div');

      var style = {};
      style.class = ['interface_bar_voice' , 'txt_center' , 'fa' , MENU_BAR[i].icon];
      style.style = ['line-height:40px'];
      style.callback = MENU_BAR[i].listener;
      style.id = MENU_BAR[i].id;
      this.setStyle(div_2, style);
      div_1.appendChild(div_2);
    }

    this.origin.appendChild(div_1);
  },

  //=========================================================
  //==================== WINDOW CREATE ======================
  //=========================================================

  createWindow : function(id , title , width , height) {
    if(!this.checkWindow(id)) {
      destroyWindow(id);
    }

    var div_1 = document.createElement('div');
    var style = {};
    style.class = ['draggable' , 'resizeable' , 'absolute' , 'window'];
    style.style = ['width:' + width + 'px' , 'height:' + height + 'px' , 'top:50px' , 'left:50px'];
    style.id = id;
    this.setStyle(div_1, style);

    var div_2 = document.createElement('div');
    var style = {};
    style.class = ['absolute' , 'closeWindow' , 'txt_center' , 'fa' , 'fa-close'];
    style.style = ['z-index:70'];
    style.callback = 'destroyWindow';
    style.value = [id];
    style.id = id + '_close';
    this.setStyle(div_2, style);

    var div_3 = document.createElement('div');
    var style = {};
    style.class = ['absolute' , 'handle' , 'txt_center'];
    style.text = title;
    style.id = id + '_title';
    this.setStyle(div_3, style);

    var div_4 = document.createElement('div');
    var style = {};
    style.id = id + '_body';
    this.setStyle(div_4, style);

    div_1.appendChild(div_2);
    div_1.appendChild(div_3);
    div_1.appendChild(div_4);

    this.origin.appendChild(div_1);

    return {
      id:id,
      body:id + '_body',
      title:title,
      width:width,
      height:height
    };
  },

  //=========================================================
  //===================== CHOOSE UNIT =======================
  //=========================================================

  //Crea l'interfaccia HTML Per scegliere l'unita a inizio gioco
  chooseUnit : function(data , id) {

    var box = document.getElementById(id);

    var table = document.createElement('table');
    table.cellPadding = 0;
    table.cellSpacing = 0;
    var style = {};
    style.class = ['fullWidth' , 'box'];
    this.setStyle(table, style);

    var tr = document.createElement('tr');
    var style = {};
    style.class = ['infoRow'];
    this.setStyle(tr, style);

    //INFO COLUMNS
    tr.appendChild( document.createElement('td') );
    tr.appendChild( document.createElement('td') );
    tr.appendChild( this.setElementWithText('td' , 'NAME') );
    tr.appendChild( this.setElementWithText('td' , 'ENERGY') );
    tr.appendChild( this.setElementWithText('td' , 'MAP') );

    table.appendChild(tr);

    for(var i = 0 ; i < data.length ; i++) {

      var tr = document.createElement('tr');
      var style = {};

      //CHANGEMENT FOR SELECTED UNIT
      if(CHOOSE_UNIT === data[i].id) {
        style.class = ['menuRow_active'];
      } else {
        style.class = ['menuRow'];
        style.callback = 'chooseUnit';
        style.value = [data[i].id];
        style.id = 'chooseUnit_' + data[i].id;
      }
      this.setStyle(tr, style);

      //CREATE ROWS
      var src = buildImage(data[i].race_id , data[i].variant_id , data[i].gender_id);
      tr.appendChild( this.setElementWithImg('td' , src ) );
      tr.appendChild( this.setElementWithText('td' , data[i].unitName) );
      tr.appendChild( this.setElementWithText('td' , data[i].hp) );
      tr.appendChild( this.setElementWithText('td' , data[i].energy) );
      tr.appendChild( this.setElementWithText('td' , data[i].mapName) );
      table.appendChild(tr);
    }

    var tr = document.createElement('tr');
    var style = {};
    style.class = ['menuButton'];

    var td = document.createElement('td');
    td.align = 'center';
    td.colSpan = 5;

    var div = document.createElement('div');
    var style = {};
    style.class = ['buttonMenu'];
    style.id = 'chooseUnit_button';
    style.text = 'Gioca';
    this.setStyle(div , style);

    td.appendChild(div);
    tr.appendChild(td);
    table.appendChild(tr);

    box.innerHTML = '';
    box.appendChild(table);

    //Creazione listener per il button
    Listener.create('chooseUnit_button' , 'chooseUnit_SEND');
  },

//=========================================================
//=================== OBJECT SELECTOR =====================
//=========================================================

  //Selezione oggetto
  //icon: "armour/robe1" id: 1 name: "Robe" real_name: "Robe" type: 1 values: "{"p":2,"e":1}" weight: 2
  selectionObject : function(id) {
    var data = SELECTION_MOUSE.info;
    if(!this.checkValues(data, id)) {
      return false;
    }

    var box = document.getElementById(id + '_body');

    var table = document.createElement('table');
    table.cellPadding = 0;
    table.cellSpacing = 0;
    var style = {};
    style.class = ['fullWidth'];
    this.setStyle(table, style);


    //CREATE ROWS
    var tr = document.createElement('tr');
    var src = PATH.OBJECTS + data.icon + '.png';
    tr.appendChild( this.setElementWithImg('td' , src ) );
    tr.appendChild( this.setElementWithText('td' , Object_Types[data.type]) );
    table.appendChild(tr);

    //Protezione
    if(data.values.p) {
      var tr = document.createElement('tr');
      tr.appendChild( this.setElementWithText('td' , 'Protezione') );
      tr.appendChild( this.setElementWithText('td' , data.values.p) );
      table.appendChild(tr);
    }
    //Ingombro
    if(data.values.e) {
      var tr = document.createElement('tr');
      tr.appendChild( this.setElementWithText('td' , 'Ingombro') );
      tr.appendChild( this.setElementWithText('td' , data.values.e) );
      table.appendChild(tr);
    }
    //Peso
    var tr = document.createElement('tr');
    tr.appendChild( this.setElementWithText('td' , 'Peso') );
    tr.appendChild( this.setElementWithText('td' , data.weight) );
    table.appendChild(tr);

    //Set title
    document.getElementById(id + '_title').innerHTML = '';
    document.getElementById(id + '_title').appendChild( document.createTextNode(data.name) );

    box.innerHTML = '';
    box.appendChild(table);
  },

  //=========================================================
  //=================== PLAYER SELECTOR =====================
  //=========================================================

  //Selezione giocatore
  selectionPlayer : function(id) {
    var data = SELECTION_MOUSE.info;
    if(!this.checkValues(data, id)) {
      return false;
    }

    var box = document.getElementById(id + '_body');

    var table = document.createElement('table');
    table.cellPadding = 0;
    table.cellSpacing = 0;
    var style = {};
    style.class = ['fullWidth' , 'relative'];
    this.setStyle(table, style);

    //Img + Name
    var tr = document.createElement('tr');
    var src = data.img.src;
    tr.appendChild( this.setElementWithImg('td' , src) );
    tr.appendChild( this.setElementWithText('td' , data.name) );
    table.appendChild(tr);

    //Hp
    var tr = document.createElement('tr');
    tr.appendChild( this.setElementWithText('td' , 'Hp') );
    tr.appendChild( this.setElementWithHealthBar('hp_bar_' + data.uid , 'hp_color', data.current_hp , data.hp) );
    table.appendChild(tr);

    //Energy
    var tr = document.createElement('tr');
    tr.appendChild( this.setElementWithText('td' , 'Energy') );
    tr.appendChild( this.setElementWithHealthBar('energy_bar_' + data.uid , 'energy_color' , data.current_energy , data.energy) );
    table.appendChild(tr);

    //Razza
    var tr = document.createElement('tr');
    tr.appendChild( this.setElementWithText('td' , 'Razza') );
    tr.appendChild( this.setElementWithText('td' , WS_Race[data.race]) );
    table.appendChild(tr);

    //Velocità
    var tr = document.createElement('tr');
    tr.appendChild( this.setElementWithText('td' , 'Velocita') );
    tr.appendChild( this.setElementWithText('td' , data.speed) );
    table.appendChild(tr);

    //Set title
    document.getElementById(id + '_title').innerHTML = '';
    document.getElementById(id + '_title').appendChild( document.createTextNode(data.name) );

    box.innerHTML = '';
    box.appendChild(table);
  },

  //=========================================================
  //================== INVENTORY CREATE =====================
  //=========================================================

  createInventory : function(id , storage , get) {
    if(!get) {
      document.getElementById(id + '_title').appendChild(document.createTextNode(' ReadOnly'));
    }
    var box = document.getElementById(id + '_body');

    var div = document.createElement('div');
    var style = {};
    div.class = ['inventory_bag' , 'relative'];
    this.setStyle(div , style);

    for(var i in storage) {
      if(GAME.INFO.OBJECTS[storage[i]]) {
        var setted = false;
        var slot = document.createElement('div');
        //Se puo prendere l'oggetto allora setto le classi
        if(get) {
          //Inventory
          if(get === 2) {
            //Listener for equip the item
            slot.ondblclick = function () {
              EquipItem(i);
            }

            //Se l'oggetto è equipaggiato lo segno con un bordo
            for(var j in player.equip_item) {
              if(player.equip_item[j]) {
                if(player.equip_item[j] === i) {
                  var style = {};
                  style.id = 'item_slot_' + i;
                  style.class = ['item_slot_equip'];
                  style.callback = 'selectItem';
                  style.value = [i , get];
                  this.setStyle(slot , style);
                  setted = true;
                }
              }
            }
          }
          //Se non è un oggetto equipaggiato lo setto come normal slot
          if(!setted) {
            var style = {};
            style.id = 'item_slot_' + i;
            style.class = ['item_slot'];
            style.callback = 'selectItem';
            style.value = [i , get];
            this.setStyle(slot , style);
          }

        } else {
          style.class = ['item_slot'];
          this.setStyle(slot , style);
        }

        slot.appendChild( this.setElementWithImg('div' , PATH.OBJECTS + GAME.INFO.OBJECTS[storage[i]].icon + '.png') );
        div.appendChild(slot);
      }
    }

    //DropList
    if(get === 1) {
      div.appendChild( this.setElementWithDropButtons('Prendi Tutto' , 1) );
      div.appendChild( this.setElementWithDropButtons('Prendi' , 0) );
    }

    //Inventory
    if(get === 2) {
      var equip_info = document.createElement('div');
      equip_info.id = 'equip_info';
      div.appendChild(equip_info);
    }

    box.innerHTML = '';
    box.appendChild(div);
  },

  //=========================================================
  //================== CHARACTER CREATE =====================
  //=========================================================

  createCharacter : function(id) {
    var box = document.getElementById(id + '_body');

    var table = document.createElement('table');
    table.cellPadding = 0;
    table.cellSpacing = 0;
    var style = {};
    style.class = ['character' , 'relative' , 'totale'];
    this.setStyle(table, style);

    var tr = document.createElement('tr');
    var style = {};
    style.style = ['height:20px;'];
    this.setStyle(tr, style);

    var td = document.createElement('td');
    td.colSpan = 3;
    var style = {};
    style.class = ['txt_center'];
    style.text = player.name;
    this.setStyle(td, style);

    tr.appendChild(td);
    table.appendChild(tr);

    //Top
    var tr = document.createElement('tr');

    var td = document.createElement('td');
    td.colSpan = 3;
    td.align = 'center';
    var style = {};
    style.style = ['height:32px'];
    this.setStyle(td, style);

    td.appendChild( this.setElementWithEquipSlot('HEAD') );
    tr.appendChild(td);
    table.appendChild(tr);

    //Left
    var tr = document.createElement('tr');

    var td = document.createElement('td');
    td.align = 'center';
    var style = {};
    style.style = ['width:40px'];
    this.setStyle(td, style);

    td.appendChild( this.setElementWithEquipSlot('LEFT_HAND') );
    td.appendChild( this.setElementWithEquipSlot('ARMOUR') );
    td.appendChild( this.setElementWithEquipSlot('CLOAK') );

    tr.appendChild(td);

    //Player Image
    var td = document.createElement('td');
    td.align = 'center';

    var img = document.createElement('img');
    img.width = 64;
    img.height = 64;
    img.src = player.img.src;

    td.appendChild(img);
    tr.appendChild(td);

    //Right
    var td = document.createElement('td');
    td.align = 'center';
    var style = {};
    style.style = ['width:40px'];
    this.setStyle(td, style);

    td.appendChild( this.setElementWithEquipSlot('RIGHT_HAND') );
    td.appendChild( this.setElementWithEquipSlot('GLOVES') );
    td.appendChild( this.setElementWithEquipSlot('RING_1') );
    td.appendChild( this.setElementWithEquipSlot('RING_2') );

    tr.appendChild(td);
    table.appendChild(tr);

    //Bottom
    var tr = document.createElement('tr');
    var style = {};
    style.style = ['height:32px'];
    this.setStyle(tr, style);

    var td = document.createElement('td');
    td.colSpan = 3;
    td.align = 'center';

    td.appendChild( this.setElementWithEquipSlot('BOOTS') );

    tr.appendChild(td);
    table.appendChild(tr);

    box.innerHTML = '';
    box.appendChild(table);
  },

  //=========================================================
  //================== INSERT BROADCAST =====================
  //=========================================================

  insertBroadcast : function(string) {
    document.getElementById('messageInterface').innerHTML = '';
    document.getElementById('messageInterface').appendChild( document.createTextNode(string) );
  },

  //=========================================================
  //================== REMOVE BROADCAST =====================
  //=========================================================

  removeBroadcast : function() {
    document.getElementById('messageInterface').innerHTML = '';
  },

  //=========================================================
  //==================== INSERT LOADER ======================
  //=========================================================
  insertLoader : function() {
    var img = document.createElement('img');
    img.src = 'img/loader.gif';
    document.getElementById('messageInterface').appendChild(img);
  },

  //=========================================================
  //====================== START HUD ========================
  //=========================================================

  startHUD : function() {
    document.getElementById('player_HP').style.visibility = 'visible';
    document.getElementById('player_ENERGY').style.visibility = 'visible';

    $("#player_HP").knob({
      'min':0,
      'max':player.hp,
      'readOnly':true,
      'width':180,
      'height':180,
      'bgColor':'black',
      'fgColor':'#66CC66',
      'displayInput':true,
      'thickness':'.5',
      'displayPrevious':true,
      'angleOffset':-125,
      'angleArc':250,
      change : function (value) {
        //console.log("change : " + value);
      },
      release : function (value) {
        //console.log(this.$.attr('value'));
        //console.log("release : " + value);
      },
      cancel : function () {
        //console.log("cancel : ", this);
      },
      draw : function () {
      }
    });
    $("#player_ENERGY").knob({
      'min':0,
      'max':player.energy,
      'readOnly':true,
      'width':120,
      'height':120,
      'bgColor':'black',
      'fgColor':'#00FFFF',
      'displayInput':false,
      'thickness':'.45',
      'displayPrevious':true,
      'angleOffset':-125,
      'angleArc':250,
      change : function (value) {
        //console.log("change : " + value);
      },
      release : function (value) {
        //console.log(this.$.attr('value'));
        //console.log("release : " + value);
      },
      cancel : function () {
        //console.log("cancel : ", this);
      },
      draw : function () {
      }
    });
  }
}

//====================================================================
//====================== LISTENER INTERFACE ==========================
//====================================================================

var Listener = {

  create : function(id, function_name , param) {
    document.getElementById(id).addEventListener('click' , window[function_name]);
    if(param) {
      document.getElementById(id).param = param;
    }
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

function chooseUnit(params) {
  CHOOSE_UNIT = params[0];
  Interface.chooseUnit(GAME.LIST_UNIT, WINDOWS['CHOOSE_UNIT'].body);
}

function chooseUnit_SEND() {
  if(!CHOOSE_UNIT) {
    return false;
  }
  connection.send(JSON.stringify({
    mt:ClientMessageTypes.CHOOSE_UNIT,
    i:CHOOSE_UNIT
  }));
  destroyWindow([WINDOWS['CHOOSE_UNIT'].id]);
  //Interface.insertBroadcast('Caricamento in corso ...')
  Interface.insertLoader();
}


//====================================================================
//============================ EVENTS ================================
//====================================================================

function destroyWindow(params) {

  var param = params[0];
  var element = document.getElementById(param);
  if(element) {
    element.parentNode.removeChild(element);

    for(var i in WINDOWS) {
      if(WINDOWS[i].id === param) {

        //Se si toglie la finestra di selezione azzero anche il puntatore
        if(WINDOWS[i].id === 'selectionUnit') {
          SELECTION_MOUSE = false;
        }
        delete WINDOWS[i];

      }
    }
  }
  document.body.style.cursor = 'default';
}

function createInventory() {
  if(!WINDOWS['INVENTORY']) {
    GAME.SELECT_ITEM = {};
    WINDOWS['INVENTORY'] = Interface.createWindow('inventory' , 'INVENTORY' , 202 , 282);
    Interface.createInventory(WINDOWS['INVENTORY'].id , player.inventory , 2);
  } else {
    destroyWindow(WINDOWS['INVENTORY'].id);
  }
}

function createCharacter() {
  if(!WINDOWS['CHARACTER']) {
    GAME.SELECT_ITEM = {};
    WINDOWS['CHARACTER'] = Interface.createWindow('character_equip' , 'CHARACTER' , 202 , 282);
    Interface.createCharacter(WINDOWS['CHARACTER'].id);
  } else {
    destroyWindow(WINDOWS['CHARACTER'].id);
  }
}

//Crea una droplist
function createDropList(storage) {
  if(!WINDOWS['DROP_LIST']) {
    GAME.SELECT_ITEM = {};
    WINDOWS['DROP_LIST'] = Interface.createWindow('drop_list' , 'OBJECT LIST' , 202 , 282);
    Interface.createInventory(WINDOWS['DROP_LIST'].id , storage , 1);
  }
}

//Crea una droplist di sola lettura (in caso di lock di un altro giocatore)
function createDropList_READONLY(storage) {
  if(!WINDOWS['DROP_LIST']) {
    WINDOWS['DROP_LIST'] = Interface.createWindow('drop_list' , 'OBJECT LIST' , 202 , 282);
    Interface.createInventory(WINDOWS['DROP_LIST'].id , storage);
  }
}

//Funzione di callback in caso di raccolta oggetto
function getDroppableItem() {
  player.status = StatusPlayer.DROP;

  var item_x = SELECTION_MOUSE.item_x - GAME.CAMERA.xView;
  var item_y = SELECTION_MOUSE.item_y - GAME.CAMERA.yView;

  player.goToPosition(item_x , item_y);
}

function EquipItem(item) {
  console.log('EquipItem' , item , player.inventory[item])
  player.equip(item);
}

function UnEquipItem(item) {
  console.log('UnEquipItem' , item , player.inventory[item])
  player.unequip(item);
}

function DropDownItem(item) {
  console.log('DropDownItem' , item)
  /*connection.send(JSON.stringify({
    mt : ClientMessageTypes.DROP_ITEM,
    k : items,
    i : SELECTION_MOUSE.item_id
  }));*/
}

//============================================================================
//========================== SELECTION ITEMS =================================
//============================================================================
//Permette di selezionare gli oggetti in caso di un multiitem
function selectItem(params) {
  var select = params[0];
  var get = params[1];
  var slot = document.getElementById('item_slot_' + select);

//=========================================================
//====================== DROP LIST ========================
//=========================================================
  //Se droplist multiselezione
  if(get === 1) {
    if(slot.className !== 'item_slot_selected') {
      GAME.SELECT_ITEM[select] = true;
      slot.className = "item_slot_selected";
    } else {
      delete GAME.SELECT_ITEM[select];
      slot.className = "item_slot";
    }
  }

//=========================================================
//====================== INVENTORY ========================
//=========================================================
  //Se inventario selezione di un solo oggetto per equip o buttare l'item
  if(get === 2) {
    for(var i in GAME.SELECT_ITEM) {
      document.getElementById('item_slot_' + i).className = 'item_slot';
    }
    GAME.SELECT_ITEM = {};
    GAME.SELECT_ITEM[select] = true;
    slot.className = "item_slot_selected";


    var info_object = GAME.INFO.OBJECTS[ player.inventory[select] ];
    //Realizzazione slot info
    var slot_info = document.getElementById('equip_info');
    slot_info.innerHTML = '';

    var div = document.createElement('div');
    var src = PATH.OBJECTS + info_object.icon + '.png';

    slot_info.appendChild( Interface.setElementWithImg('div' , src) );
    slot_info.appendChild( Interface.setElementWithText('div' , info_object.name) );
    slot_info.appendChild( Interface.setElementWithText('div' , 'Type : ' + Object_Types[info_object.type]) );
    slot_info.appendChild( Interface.setElementWithText('div' , 'Weight : ' + info_object.weight) );

    for(var i in info_object.values) {
      slot_info.appendChild( Interface.setElementWithText('div' , Object_Values[i] + ' : ' + info_object.values[i]) );
    }

    //slot_info.appendChild( Interface.setElementWithText('div' , 'Weight : ' + info_object.weight) );
    slot_info.appendChild( Interface.setElementWithButton('Equip' , 'EquipItem' , select) );
    slot_info.appendChild( Interface.setElementWithButton('Drop' , 'DropDownItem' , select) );
    //document.getElementById('equip_info').innerHTML = JSON.stringify(info_object);
  }
}

//Al tasto prendi o prendi tutto, mando al server la scelta dell'utente
function takeItems(all) {
  var items = [];
  if(all) {
    items = SELECTION_MOUSE.items;
  } else {
    for(var i in GAME.SELECT_ITEM) {
      items.push(SELECTION_MOUSE.items[i]);
    }
  }

  if(items.length > 0) {
    connection.send(JSON.stringify({
      mt : ClientMessageTypes.GET_DROP_ITEM,
      k : items,
      i : SELECTION_MOUSE.item_id
    }));
  }

  //Scrittura sulla System Info
  for(var i in items) {
    SystemInfo.write('Hai preso : ' + GAME.INFO.OBJECTS[items[i]].name);
  }

  //Eliminazione dalla droplist
  var elements = document.getElementsByClassName('item_slot_selected');
  while(elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}


//====================================================================
//========================== SELECTION ===============================
//====================================================================

function selectionItem(pathImage , info , item , i) {
  //Se ho cliccato lo stesso elemento
  if(SELECTION_MOUSE) {
    if(SELECTION_MOUSE.img === pathImage && SELECTION_MOUSE.info.id === info.id) {
      getDroppableItem();
    }
  }
  SELECTION_MOUSE = {
    'item_x':GAME.ITEMS[i].x,
    'item_y':GAME.ITEMS[i].y,
    'info':info,
    'img':pathImage,
    'items':item,
    'item_id':i
  };
  if(!WINDOWS['SELECTION_OBJECT']) {
    WINDOWS['SELECTION_OBJECT'] = Interface.createWindow('selectionUnit' , 'STATUS' , 250 , 200);
  }
  Interface.selectionObject(WINDOWS['SELECTION_OBJECT'].id);
  //this.showContextMenu(pre_x, pre_y, 'OBJECT');
  Drawer.Selector();

  GAME.DRAW = 5;
}

function selectionPlayer(players) {
  SELECTION_MOUSE = {
    'item_x':players.x,
    'item_y':players.y,
    'info':players,
    'img':players.img
  };
  if(!WINDOWS['SELECTION_OBJECT']) {
    WINDOWS['SELECTION_OBJECT'] = Interface.createWindow('selectionUnit' , 'STATUS' , 250 , 200);
  }
  Interface.selectionPlayer(WINDOWS['SELECTION_OBJECT'].id);
  //this.showContextMenu(x, y, 'PLAYER');
  //Drawer.Selector();

  GAME.DRAW = 5;
}

function removeSelection() {
  //In caso di nessuna corrispondenza tolgo l'eventuale selezione
  SELECTION_MOUSE = false;
  if(WINDOWS['SELECTION_OBJECT']) {
    destroyWindow(WINDOWS['SELECTION_OBJECT'].id);
  }
  GAME.DRAW = 5;
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
      /*targets: [
        interact.createSnapGrid({ x: 40, y: 40 })
      ],*/
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
    //target.textContent = Math.round(event.rect.width) + 'ï¿½' + Math.round(event.rect.height);
  });
