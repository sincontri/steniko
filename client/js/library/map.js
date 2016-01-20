// wrapper for "class" Map
(function(){
  function Map(width, height){
    // map dimensions
    this.width = width;
    this.height = height;

    // map texture
    this.image = null;
  }

  // generate an example of a large map
  Map.prototype.generate = function() {

    var ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = this.width;
    ctx.canvas.height = this.height;
    var ptrn = ctx.createPattern(GAME.TERRAIN.img , 'repeat');

    var rows = ~~(this.width/44) + 1;
    var columns = ~~(this.height/44) + 1;

    ctx.save();

    ctx.rect(0, 0, this.width, this.height);
    ctx.fillStyle = ptrn;
    ctx.fill();

    ctx.restore();

    // store the generate map as this image texture
    this.image = new Image();
    this.image.src = ctx.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

    // clear context
    ctx = null;

  }

  // draw the map adjusted to camera
  Map.prototype.draw = function(xView, yView){
    // easiest way: draw the entire map changing only the destination coordinate in canvas
    // canvas will cull the image by itself (no performance gaps -> in hardware accelerated environments, at least)
    //context.drawImage(this.image, 0, 0, this.image.width, this.image.height, -xView, -yView, this.image.width, this.image.height);

    // didactic way:

    var sx, sy, dx, dy;
    var sWidth, sHeight, dWidth, dHeight;

    // offset point to crop the image
    sx = xView;
    sy = yView;

    // dimensions of cropped image
    sWidth =  context.canvas.width;
    sHeight = context.canvas.height;

    // if cropped image is smaller than canvas we need to change the source dimensions
    if(this.image.width - sx < sWidth) {
      sWidth = this.image.width - sx;
    }
    if(this.image.height - sy < sHeight) {
      sHeight = this.image.height - sy;
    }

    // location on canvas to draw the croped image
    dx = 0;
    dy = 0;
    // match destination with source to not scale the image
    dWidth = sWidth;
    dHeight = sHeight;

    context.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

  }

  // add "class" Map to our Game object
  Game.Map = Map;

})();
