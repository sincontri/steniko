var listClass = document.getElementsByClassName('titleBar');
for (var i = 0 ; i < listClass.length ; i++) {
  if (listClass[i]) {
    listClass[i].addEventListener('mousedown' , function(e) {
      console.log(e);
    });
  }
}
