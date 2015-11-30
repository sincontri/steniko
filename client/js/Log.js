var Console = {
  //Functions
  _logTextArea : false,
  _idArea : 'log',

  //Log Separator
  _ShowLog : true,
  _stylesOpen : [
    'text-align: center' ,
    'font-weight: bold' ,
    'font-size:14px' ,
    'text-shadow: 2px 2px 20px rgba(150, 150, 150, 1)'
  ].join(';'),
  _stylesBody : [
    'color: #00c' ,
    'text-align: center' ,
    'font-weight: normal' ,
    'font-size:13px' ,
    'text-shadow: 2px 2px 20px rgba(150, 150, 150, 1)'
  ].join(';'),
  _colorSuccess : '0c0',
  _colorError : 'c00',
  _colorWS : '00c',
  _colorCmd : '9900cc',
  _colorValidate : 'ff9900',
  _colorBunch : 'ffa500',

  Log : function(txt , mode , color) {

    CanvasEngine._checkValue(txt, 'string');

    if(this._logTextArea) {
      document.getElementById(this._idArea).value = document.getElementById(this._idArea).value + txt + '\n';
    } else {

      var theme = '000';
      switch(color) {
        case 'success' : theme = this._colorSuccess; break;
        case 'error' : theme = this._colorError; break;
        case 'wss' : theme = this._colorWS; break;
        case 'cmd' : theme = this._colorCmd; break;
        case 'validate' : theme = this._colorValidate; break;
        case 'map' : theme = this._colorBunch; break;
      }

      switch(mode) {
        case 1 : this.LogSeparatorOpen(txt , theme);
          break;

        case 2 : this.LogSeparatorBody(txt , theme);
          break;

        case 3 : this.LogSeparatorClose(theme);
          break;

        default : console.log(txt);
          break;
      }

    }

  },


  /**
   * Scrive nella console in modo piu chiaro con formato di intestazione
   * @method LogSeparatorOpen
   * @param {string} name Valore da scrivere sulla console
   * @param {string} color Colore con cui scrivere sulla console
   */
  LogSeparatorOpen : function(name , color) {
    if (this._ShowLog) {
      var string = '';
      var count = (92 - name.length);
      for (var i = 0 ; i < count ; i++) {
        if (i <= (count / 2) - 2 || i > (count / 2) - 1) {
          string += ':';
        } else {
          string += ' ' + name + ' ';
        }
      }
      if (!color) { color = '#ccc'; }
      console.log('%c :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::',
      this._stylesOpen + '; color: #' + color);
      console.log('%c ' + string, this._stylesOpen + '; color: #' + color);
      console.log('%c :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::',
      this._stylesOpen + '; color: #' + color);
    }
  },

  /**
   * Scrive nella console in modo più chiaro con formato di paragrafo
   * @method LogSeparatorBody
   * @param {string} name Valore da scrivere sulla console
   * @param {string} color Colore con cui scrivere sulla console
   */
  LogSeparatorBody : function(name , color) {
    if(name) {
      if ((this._ShowLog && name.length > 0)) {
        if (!color) { color = '#ccc'; }

        //Separazione messaggio per colorazione intelligente
        var message = name.split(' ');
        var reCompiled = '';
        var isWord = false;
        var colors = []; colors.push(color);
        for (var i = 0 ; i < message.length ; i++) {
          reCompiled += ' ' + message[i];
        }
        console.log('%c :::::::::::::::::::::::: ' + reCompiled, this._stylesBody + '; color: #' + color);
      }
    }
  },

  /**
   * Scrive nella console in modo più chiaro con formato di chiusura
   * @method LogSeparatorClose
   * @param {string} color Colore con cui scrivere sulla console
   */
  LogSeparatorClose : function(color) {
    if (this._ShowLog) {
      if (!color) { color = '#ccc'; }
      console.log('%c :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::',
      this._stylesOpen + '; color: #' + color);
    }
  }
}
