// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"canvas.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ctx = exports.canvas = void 0;
var canvas = document.getElementById('canvas');
exports.canvas = canvas;
var ctx = canvas.getContext('2d'); // Définit la taille du canvas à la taille de la fenêtre

exports.ctx = ctx;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; // Pour les prochains changement de taille

window.onresize = function () {
  if (ctx instanceof CanvasRenderingContext2D) {
    ctx.save();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.restore();
    console.info('Le canvas a été redimensionné');
  }
};
},{}],"function.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCoords = getCoords;
exports.frame = void 0;

function getCoords(leapPoint, frame, canvas) {
  var iBox = frame.interactionBox;
  var normalizedPoint = iBox.normalizePoint(leapPoint, true);
  return {
    x: normalizedPoint[0] * canvas.width,
    y: (1 - normalizedPoint[1]) * canvas.height
  };
}

var controller = new Leap.Controller();
controller.connect();
controller.on('frame', function (f) {
  exports.frame = frame = f;
});
var frame;
exports.frame = frame;
},{}],"app.js":[function(require,module,exports) {
"use strict";

var _canvas = require("./canvas.js");

var _function = require("./function.js");

/**
 * Coords & Inits
 */
// sounds
var breaking = document.getElementById("breaking");
var pass = document.getElementById("pass"); // interval

var intervalID = setInterval(draw, 10); // score

var points = 0; // ball start coords

var ballX = _canvas.canvas.width / 2;
var ballY = 500; // ball speed

var newBallX = 0;
var newBallY = 3; // board start coords

var boardX = (_canvas.canvas.width - 100) / 2;
var boardY = _canvas.canvas.height - 40;
var boardW = 100;
var boardH = 20; // bricks

var bricksD;
var nRows;
var nCols;
var padding;
var brickW;
var brickH;

function initBricks() {
  nRows = 4;
  nCols = 8;
  padding = 70;
  brickW = (_canvas.canvas.width - padding) / nCols - padding;
  brickH = 50;
  bricksD = new Array(nRows);

  for (var i = 0; i < nRows; i++) {
    bricksD[i] = new Array(nCols);

    for (var j = 0; j < nCols; j++) {
      bricksD[i][j] = 1;
    }
  }
}
/**
 * bouger la planche avec le clavier
 */
//init touche


var keyboard = {};
keyboard.left = false;
keyboard.right = false;
document.addEventListener('keydown', function (_event) {
  //console.log(_event.code)
  switch (_event.code) {
    case 'ArrowRight':
      keyboard.right = true;
  }

  switch (_event.code) {
    case 'ArrowLeft':
      keyboard.left = true;
  }
});
document.addEventListener('keyup', function (_event) {
  //console.log(_event.code)
  switch (_event.code) {
    case 'ArrowRight':
      keyboard.right = false;
  }

  switch (_event.code) {
    case 'ArrowLeft':
      keyboard.left = false;
  }
});
/**
 * Draw
 */
// score

function score() {
  _canvas.ctx.font = "24px Arial";
  _canvas.ctx.fillStyle = "#0095DD";

  _canvas.ctx.fillText("Score: " + points, 30, 40);
} // board


function board() {
  _canvas.ctx.beginPath();

  _canvas.ctx.rect(boardX, boardY, boardW, boardH);

  _canvas.ctx.fillStyle = "#0095DD";

  _canvas.ctx.fill();

  _canvas.ctx.closePath();
} // ball


function ball() {
  _canvas.ctx.beginPath();

  _canvas.ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);

  _canvas.ctx.fillStyle = "#0095DD";

  _canvas.ctx.fill();

  _canvas.ctx.closePath();
} // bricks


function bricks() {
  for (var i = 0; i < nRows; i++) {
    for (var j = 0; j < nCols; j++) {
      if (bricksD[i][j] == 1) {
        _canvas.ctx.beginPath();

        _canvas.ctx.rect(j * (brickW + padding) + padding, i * (brickH + padding) + padding, brickW, brickH);

        _canvas.ctx.fillStyle = "#0095DD";

        _canvas.ctx.fill();

        _canvas.ctx.closePath();
      }
    }
  }
} // draw ( loop )


function draw() {
  _canvas.ctx.clearRect(0, 0, _canvas.canvas.width, _canvas.canvas.height);

  ball();
  board();
  bricks();
  score(); // Update ball

  ballX += newBallX;
  ballY += newBallY;

  if (ballY + newBallY - 5 < 0) {
    newBallY = -newBallY;
  }

  if (ballX + newBallX + 5 > _canvas.canvas.width || ballX + newBallX - 5 < 0) {
    newBallX = -newBallX;
  }

  if (ballY + newBallY + 5 > boardY && ballX + newBallX > boardX && ballX + newBallX < boardX + boardW) {
    newBallX = 8 * ((ballX - (boardX + boardW / 2)) / boardW);
    newBallY = -newBallY;
  }

  if (ballY + newBallY + 5 > _canvas.canvas.height) {
    clearInterval(intervalID);
    alert("GAME OVER\nVotre score: " + points);
    document.location.reload();
  } // collisions


  var rowheight = brickH + padding;
  var colwidth = brickW + padding;
  var row = Math.floor(ballY / rowheight);
  var col = Math.floor(ballX / colwidth); // conditions + demolition

  if (ballY < nRows * rowheight && row >= 0 && col >= 0 && bricksD[row][col] == 1) {
    newBallY = -newBallY;
    bricksD[row][col] = 0;
    points++;
    breaking.addEventListener("ended", function () {
      pass.volume = 0.7;
      pass.play();
    });
    breaking.play();

    if (points == 32) {
      clearInterval(intervalID);
      alert("You win bro");
      document.location.reload();
    }
  } // controle direction avec le clavier


  if (keyboard.left == false && keyboard.right == true) {
    boardX += 6;
  }

  if (keyboard.left == true && keyboard.right == false) {
    boardX += -6;
  }
  /**
   * detection pinch + direction
   */


  if (_function.frame.hands.length > 0) {
    console.log(_function.frame.hands); //console.log(frame.hands[0].pinchStrength)
    //console.log(frame.hands[0].palmPosition[0])

    if (_function.frame.hands[0].pinchStrength > 0.91) {
      boardX = _function.frame.hands[0].palmPosition[0] * 3 + (_canvas.canvas.height + 75);
    }
  }
}

initBricks();
},{"./canvas.js":"canvas.js","./function.js":"function.js"}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62002" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.c328ef1a.js.map