window.Game = {};

//=========================================================
//====================== CONFIG GAME ======================
//=========================================================

//WEBSOCKET
var WEBSOCKET = 'ws://double-triskel.rhcloud.com:8000';

//FPS
var FPS = 60;
var INTERVAL = 1000/FPS; // ms
var STEP = INTERVAL/1000 // s

//MOVE PARAM
var MOVE_INTERVAL = 50; //ogni quanti ms mando il messaggio della mia posizione

//PATH PARAM
var PATH = {
  'ITEMS' : "icons/dc-dngn/",
  'OBJECTS' : "icons/item/",
  'PLAYERS' : "icons/player/base/"
};

/* CONFIGURATION MENU */
var CHOOSE_UNIT = null;

/* GAME FLAG */
var COLLISION_FLAG = true; //Attiva la collisione
var COLLISION_TOLLERANCE = 5;  //Gestisce quanti pixel tollerare alla collisione


/* INVENTORY PARAM */
var INVENTORY_SIZE = 30;

//=========================================================
//====================== OBJECT WSS =======================
//=========================================================

var Object_Types = {
  1: 'ARMOUR'
}

var Race = {
  CENTAUR: 1,
  DEEP_DWARF: 2,
  DEEP_ELF: 3,
  DEMIGOD: 4,
  DEMONSPAWN: 5,
  DRACONIAN: 6,
  DWARF: 7,
  ELF: 8,
  GHOUL: 9,
  GNOME: 10,
  HALFLING: 11,
  HUMAN: 12,
  KENKU: 13,
  KOBOLD: 14,
  MERFOLD: 15,
  MINOTAUR: 16,
  MUMMY: 17,
  NAGA: 18,
  OGRE: 19,
  ORC: 20,
  SPRIGGAN: 21,
  TROLL: 22,
  VAMPIRE: 23
};

var Gender = {
  NEUTER: 1,
  MALE: 2,
  FEMALE: 3
};

var Variant = {
  NEUTER: 1,
  BROWN: 2,
  DARKBROWN: 3,
  DARKGREY: 4,
  LIGHTBROWN: 5,
  LIGHTGREY: 6,
  BLACK: 7,
  PINK: 8,
  RED: 9,
  GOLD: 10,
  GRAY: 11,
  GREEN: 12,
  MOTTLED: 13,
  PALE: 14,
  PURPLE: 15,
  WHITE: 16,
  WINGED: 17,
  WINGLESS: 18,
  WATER: 19,
  DARKGREEN: 20,
  LIGHTGREEN: 21
};

//Oggetto per la ricezione messaggi del WS

var WS_Race = {
  1 : 'CENTAUR',
  2 : 'DEEP_DWARF',
  3 : 'DEEP_ELF',
  4 : 'DEMIGOD',
  5 : 'DEMONSPAWN',
  6 : 'DRACONIAN',
  7 : 'DWARF',
  8 : 'ELF',
  9 : 'GHOUL',
  10 : 'GNOME',
  11 : 'HALFLING',
  12 : 'HUMAN',
  13 : 'KENKU',
  14 : 'KOBOLD',
  15 : 'MERFOLD',
  16 : 'MINOTAUR',
  17 : 'MUMMY',
  18 : 'NAGA',
  19 : 'OGRE',
  20 : 'ORC',
  21 : 'SPRIGGAN',
  22 : 'TROLL',
  23 : 'VAMPIRE'
}

var WS_Gender = {
  1 : 'NEUTER',
  2 : 'MALE',
  3 : 'FEMALE'
};

var WS_Variant = {
  1 : 'NEUTER',
  2 : 'BROWN',
  3 : 'DARKBROWN',
  4 : 'DARKGREY',
  5 : 'LIGHTBROWN',
  6 : 'LIGHTGREY',
  7 : 'BLACK',
  8 : 'PINK',
  9 : 'RED',
  10 : 'GOLD',
  11 : 'GRAY',
  12 : 'GREEN',
  13 : 'MOTTLED',
  14 : 'PALE',
  15 : 'PURPLE',
  16 : 'WHITE',
  17 : 'WINGED',
  18 : 'WINGLESS',
  19 : 'WATER',
  20 : 'DARKGREEN',
  21 : 'LIGHTGREEN'
};

//=========================================================
//===================== TYPE MESSAGE ======================
//=========================================================

var ServerMessageTypes = {
  CONFIRM_CONNECTION: 1,
  CLOSE: 2,
  UNIT_INFO: 3,
  MAP_INFO: 4,
  PLAYERS_INFO: 5,
  PLAYERS_POSITION: 6,
  LOGOUT: 7,
  LANDS: 8,
  OBJECTS: 9,
  UNIT_COLLISION: 10,
  LIST_UNIT: 11
};

var ClientMessageTypes = {
  CLOSE: 1,
  MOVE: 2,
  CHOOSE_UNIT: 3
}
