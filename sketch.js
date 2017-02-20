// for red, green, and blue color values
var a, r, g, b;
var socket;
var display = {
  width: 32,
  height: 32,
  pixels: []
}

var primoTirante = {
  start: 0,
  stop: 51,
  nodes: [
    {
      start: 4,
      stop: 6
    },
    {
      start: 14,
      stop: 16
    },
    {
      start: 22,
      stop: 29
    },
    {
      start: 35,
      stop: 38
    },
    {
      start: 45,
      stop: 48
    }
  ],
  pixels: []
};

var secondoTirante = {
  start: 52,
  stop: 185,
  nodes: [
    {
      start: 64,
      stop: 67
    },
    {
      start: 85,
      stop: 88
    },
    {
      start: 107,
      stop: 110
    },
    {
      start: 127,
      stop: 130
    },
    {
      start: 149,
      stop: 152
    },
    {
      start: 170,
      stop: 173
    }
  ],
  pixels: []
};

var terzoTirante = {
  start: 186,
  stop: 317,
  nodes: [
    {
      start: 200,
      stop: 203
    },
    {
      start: 217,
      stop: 220
    },
    {
      start: 232,
      stop: 235
    },
    {
      start: 268,
      stop: 271
    },
    {
      start: 283,
      stop: 286
    },
    {
      start: 300,
      stop: 303
    }
  ],
  pixels: []
}

var quartoTirante = {
  start: 318,
  stop: 423,
  nodes: [
    {
      start: 329,
      stop: 332
    },
    {
      start: 344,
      stop: 347
    },
    {
      start: 358,
      stop: 361
    },
    {
      start: 380,
      stop: 383
    },
    {
      start: 394,
      stop: 397
    },
    {
      start: 409,
      stop: 412
    }
  ],
  pixels: []
}

var quintoTirante = {
  start: 424,
  stop: 521,
  nodes: [
    {
      start: 433,
      stop: 435
    },
    {
      start: 445,
      stop: 448
    },
    {
      start: 461,
      stop: 464
    },
    {
      start: 481,
      stop: 484
    },
    {
      start: 497,
      stop: 500
    },
    {
      start: 510,
      stop: 513
    }
  ],
  pixels: []
}

var primoAnello = {
  start: 522,
  stop: 612,
  nodes: [
    {
      start: 522,
      stop: 523
    },
    {
      start: 542,
      stop: 543
    },
    {
      start: 558,
      stop: 559
    },
    {
      start: 577,
      stop: 577
    },
    {
      start: 598,
      stop: 598
    },
    {
      start: 612,
      stop: 612
    }
  ],
  pixels: []
}

var secondoAnello = {
  start: 613,
  stop: 790,
  nodes: [
    {
      start: 0,
      stop: 0
    },
    {
      start: 650,
      stop: 652
    },
    {
      start: 0,
      stop: 0
    },
    {
      start: 728,
      stop: 728
    },
    {
      start: 0,
      stop: 0
    }, {
      start: 790,
      stop: 790
    }
  ],
  pixels: []
}

var terzoAnello = {
  start: 791,
  stop: 1071,
  nodes: [
    {
      start: 843,
      stop: 843
    },
    {
      start: 903,
      stop: 905
    },
    {
      start: 974,
      stop: 975
    },
    {
      start: 1032,
      stop: 1033
    },
    {
      start: 1071,
      stop: 1071
    }
  ],
  pixels: []
}

var pixel_w = 5, pixel_h = 5;
var display_pixel_s = 2, display_pixel_spacing = 2;

var rotatePixels = false;

function setup() {
  var myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent('canvasContainer');
  // Pick colors randomly
  var x = 0, y = 0;
  var display_size = display.width * display_pixel_s + (display.width + 2) * display_pixel_spacing;

  for (var i = 0; i < display.height; i++) {
    y = -display_size / 2 + i * (display_pixel_s + 2) + display_pixel_spacing * 2;
    for (var j = 0; j < display.width; j++) {
      x = -display_size / 2 + j * (display_pixel_s + 2) + display_pixel_spacing * 2;
      r = random(255);
      g = random(255);
      b = random(255);
      display.pixels.push({
        color: color(r, g, b),
        x_loc: x,
        y_loc: y
      });
    }
  }

  computeTirante(primoTirante);
  computeTirante(secondoTirante);
  computeTirante(terzoTirante);
  computeTirante(quartoTirante);
  computeTirante(quintoTirante);

  computeAnello(primoAnello, 1.1 * windowHeight / 10);
  computeAnello(secondoAnello, 1.7 * windowHeight / 10);
  computeAnello(terzoAnello, 2.5 * windowHeight / 10);

  socket = io.connect('http://localhost:8080');
  // We make a named event called 'mouse' and write an
  // anonymous callback function
  socket.on('setpixelsColor',
    // When we receive data
    function (data) {
      console.log("Got:a " + data.a + " r " + data.r + " g " + data.g + " b " + data.b);
      // Draw a blue circle
      if (!rotatePixels)
        setpixelsColor(data.a, data.r, data.g, data.b);
    }
  );
}

function draw() {
  background(200);
  smooth();
  translate(windowWidth / 2, windowHeight / 2);
  // Draw a circle

  stroke(0);

  // mostriamo i pixel del display
  var x = 0, y = 0;
  var display_size = display.width * display_pixel_s + (display.width + 2) * display_pixel_spacing;
  noFill();
  rect(-display_size / 2, -display_size / 2, display_size, display_size);
  noStroke();

  display.pixels.forEach(function (pixel, index) {
    fill(pixel.color);
    ellipse(pixel.x_loc, pixel.y_loc, display_pixel_s, display_pixel_s);
  });

  // mostriamo i pixel dei tiranti
  drawTirante(primoTirante, 0);
  drawTirante(secondoTirante, QUARTER_PI + QUARTER_PI / 2);
  drawTirante(terzoTirante, QUARTER_PI + 3 * QUARTER_PI / 2);
  drawTirante(quartoTirante, PI + 3 * QUARTER_PI / 2);
  drawTirante(quintoTirante, PI * 2 - 3 * QUARTER_PI / 2);
  // disegniamo gli anelli
  drawAnello(primoAnello);
  drawAnello(secondoAnello);
  drawAnello(terzoAnello);
}

function rotatePixels() {

}

function mouseWheel(event) {
  if (rotatePixels) {
    var pixels = getPixels();
    var single_pixel;
    var shift_n;
    if (event.delta > 0) {
      shift_n = event.delta / 10;
      while (shift_n > 0) {
        single_pixel = pixels.pop();
        pixels.unshift(single_pixel);
        shift_n--;
      }
    } else {
      shift_n = -event.delta / 20;
      while (shift_n > 0) {
        single_pixel = pixels.shift();
        pixels.push(single_pixel);
        shift_n--;
      }
    }
    setPixels(pixels);
  }
}

function mouseClicked() {
  var new_display_pixels = [], new_pixels = [];

  rotatePixels = !rotatePixels;

  for (var i = 0; i < 1024; i++) {
    if (rotatePixels) {
      r = i < 256 ? 0 : 255;
      g = i < 512 ? 0 : 255;
      b = i < 768 ? 0 : 255;
    } else {
      r = random(255);
      g = random(255);
      b = random(255);
    }
    new_display_pixels.push(color(r, g, b));
  }

  for (var i = 0; i < terzoAnello.stop; i++) {
    if (rotatePixels) {
      r = i < 256 ? 0 : 255;
      g = i < 512 ? 0 : 255;
      b = i < 768 ? 0 : 255;
    } else {
      r = random(255);
      g = random(255);
      b = random(255);
    }
    new_pixels.push(color(r, g, b));
  }
  setPixels(new_pixels);
  setDisplayPixels(new_display_pixels);

}

function pixelsOff() {
  setpixelsColor(255);
}

function setpixelsColor(a, r, g, b) {
  var color_v = color(r, g, b, a);
  primoAnello.pixels.forEach(function (pixel, index) {
    pixel.color = color_v;
  });

  secondoAnello.pixels.forEach(function (pixel, index) {
    pixel.color = color_v;
  });

  terzoAnello.pixels.forEach(function (pixel, index) {
    pixel.color = color_v;
  });

  primoTirante.pixels.forEach(function (pixel, index) {
    pixel.color = color_v;
  });

  secondoTirante.pixels.forEach(function (pixel, index) {
    pixel.color = color_v;
  });

  terzoTirante.pixels.forEach(function (pixel, index) {
    pixel.color = color_v;
  });

  quartoTirante.pixels.forEach(function (pixel, index) {
    pixel.color = color_v;
  });

  quintoTirante.pixels.forEach(function (pixel, index) {
    pixel.color = color_v;
  });
}

function getPixels() {
  var changing = primoTirante;
  var pixels = [];
  for (var i = 0; i < terzoAnello.stop; i++) {
    if (i <= primoTirante.stop) {
      //
    } else if (i <= secondoTirante.stop) {
      changing = secondoTirante;
    } else if (i <= terzoTirante.stop) {
      changing = terzoTirante;
    } else if (i <= quartoTirante.stop) {
      changing = quartoTirante;
    } else if (i <= quintoTirante.stop) {
      changing = quintoTirante;
    } else if (i <= primoAnello.stop) {
      changing = primoAnello;
    } else if (i <= secondoAnello.stop) {
      changing = secondoAnello;
    } else if (i <= terzoAnello.stop) {
      changing = terzoAnello;
    }
    pixels.push(changing.pixels[i - changing.start].color);
  }
  return pixels;
}

function setPixels(pixels_array) {
  var changing = primoTirante;
  var pixel_object = {};
  for (var i = 0; i < pixels_array.length; i++) {
    if (i <= primoTirante.stop) {
      //
    } else if (i <= secondoTirante.stop) {
      changing = secondoTirante;
    } else if (i <= terzoTirante.stop) {
      changing = terzoTirante;
    } else if (i <= quartoTirante.stop) {
      changing = quartoTirante;
    } else if (i <= quintoTirante.stop) {
      changing = quintoTirante;
    } else if (i <= primoAnello.stop) {
      changing = primoAnello;
    } else if (i <= secondoAnello.stop) {
      changing = secondoAnello;
    } else if (i <= terzoAnello.stop) {
      changing = terzoAnello;
    }
    pixel_object = changing.pixels[i - changing.start];
    pixel_object.color = color(pixels_array[i]);
  }
}

function setDisplayPixels(pixels_array) {
  pixels_array.forEach(function (pixel, index) {
    display.pixels[index].color = pixel;
  });
}

function drawAnello(anello) {
  anello.pixels.forEach(function (pixel, index) {
    fill(pixel.color);
    ellipse(pixel.x_loc, pixel.y_loc, pixel_w, pixel_h);
  });
}

function computeAnello(anello, radius) {
  var x = 0, y = 0;
  var pixels_n = anello.stop - anello.start + 1;
  var angle_inc = 2 * PI / pixels_n;
  var angle = 0;
  for (var i = 0; i < pixels_n; i++) {
    r = random(255);
    g = random(255);
    b = random(255);
    x = Math.sin(angle) * radius;
    y = Math.cos(angle) * radius;
    anello.pixels.push({
      color: color(r, g, b),
      x_loc: x,
      y_loc: y
    });
    angle += angle_inc;
  }
}

function computeTirante(tirante) {
  var display_size = display.width * display_pixel_s + (display.width + 2) * display_pixel_spacing;

  var y = -display_size / 2 - 15, x = 0;
  for (var i = 0; i < tirante.stop - tirante.start + 1; i++) {
    r = random(255);
    g = random(255);
    b = random(255);
    if (i > (tirante.stop - tirante.start) / 2) {
      x = 3;
      y += 7;
    } else {
      x = -3;
      y -= 7;
    }
    tirante.pixels.push({
      color: color(r, g, b),
      x_loc: x,
      y_loc: y
    });
  }
}

function drawTirante(tirante, angolo) {
  push();
  rotate(angolo);
  // mostriamo i pixel del secondo tirante
  tirante.pixels.forEach(function (pixel, index) {
    fill(pixel.color);
    ellipse(pixel.x_loc, pixel.y_loc, pixel_w, pixel_h);
  });

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
}

