var idList = [
  { id:'chooseUnit_button', function:'chooseUnit_SEND' }
];

//====================================================================
//======================= INTERFACE BUILDER ==========================
//====================================================================

var Interface = {
  //Crea l'interfaccia HTML Per scegliere l'unita a inizio gioco
  chooseUnit : function(data) {
    var box = document.getElementById("chooseUnit").getElementsByClassName("box")[0];
    var text = '<table cellpadding="0" cellspacing="0" class="fullWidth">';
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
    box.innerHTML = text;
  },

  selectionUnit : function(data) {
    //icon: "armour/robe1"id: 1name: "Robe"real_name: "Robe"type: 1value1: 2value2: 1value3: nullweight: 2
    var box = document.getElementById("selectionUnit_stats");
    var text = '';
    text += '<tr><td><img src="' + PATH.ITEMS + data.icon + '"/></td>';
    text += ' <td>' + Object_Types[data.type] + '</td></tr>';

    box.innerHTML = text;
    box.style.display = 'block';
    document.getElementById('selectionUnit_name').innerHTML = data.name;
  }

};

//====================================================================
//====================== LISTENER INTERFACE ==========================
//====================================================================

var Listener = {
  chooseUnit : function(id) {
    CHOOSE_UNIT = id;
    Interface.chooseUnit(GAME.LIST_UNIT);
  }
}

//====================================================================
//============================ ONLOAD ================================
//====================================================================

window.onload = function(e) {
  $( ".draggable" ).draggable({ handle: "div.handle" });

  for(var i = 0 ; i < idList.length ; i++) {
    document.getElementById(idList[i].id).addEventListener('click' , window[idList[i].function]);
  }
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
