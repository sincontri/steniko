var SystemInfo = {
  write : function(str) {
    document.getElementById('systemInfo').value += str+' \n';;
  },
  reset : function() {
    document.getElementById('systemInfo').value = '';
  }
};
