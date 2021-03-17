"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hampath3 = exports.simpleSaw3 = void 0;

var _random = _interopRequireDefault(require("canvas-sketch-util/random"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var simpleSaw3 = function simpleSaw3(_ref) {
  var width = _ref.width,
      height = _ref.height,
      depth = _ref.depth;
  var path = {}; // Matrix where data[z][y][x] is the position
  // of next point in the path [x, y, z]

  var data = [];
  var xMax = width - 1;
  var yMax = height - 1;
  var zMax = depth - 1;

  var incrementX = function incrementX(x, y, z) {
    return x < xMax ? [x + 1, y, z] : undefined;
  };

  var decrementX = function decrementX(x, y, z) {
    return x > 0 ? [x - 1, y, z] : undefined;
  };

  var incrementY = function incrementY(x, y, z) {
    return y < yMax ? [x, y + 1, z] : undefined;
  };

  var decrementY = function decrementY(x, y, z) {
    return y > 0 ? [x, y - 1, z] : undefined;
  };

  var incrementZ = function incrementZ(x, y, z) {
    return z < zMax ? [x, y, z + 1] : undefined;
  };

  var step = function step(x, y, z) {
    var shiftZ = incrementZ;
    var shiftY, shiftX;

    if (z % 2 === 0) {
      shiftY = incrementY;
      shiftX = y % 2 === 0 ? incrementX : decrementX;
    } else {
      shiftY = decrementY;
      shiftX = y % 2 === 0 ? decrementX : incrementX;
    }

    ;
    return shiftX(x, y, z) || shiftY(x, y, z) || shiftZ(x, y, z) || [-1, -1, -1];
  };

  for (var z = 0; z <= zMax; z++) {
    data.push([]);

    for (var y = 0; y <= yMax; y++) {
      data[z].push([]);

      for (var x = 0; x <= xMax; x++) {
        data[z][y].push(step(x, y, z));
      }

      ;
    }

    ;
  }

  ;
  path.start = [0, 0, 0]; // Determine the end point

  if (zMax % 2 === 0) {
    if (yMax % 2 === 0) {
      path.end = [width - 1, height - 1, depth - 1];
    } else {
      path.end = [0, height - 1, depth - 1];
    }
  } else {
    path.end = [0, 0, depth - 1];
  }

  path.data = data;
  path.width = width;
  path.height = height;
  return path;
};

exports.simpleSaw3 = simpleSaw3;

var convertToSequence3 = function convertToSequence3(path) {
  var data = path.data;
  var sequence = [];
  var curr;

  var next = _toConsumableArray(path.start);

  do {
    curr = _toConsumableArray(next);
    sequence.push(_toConsumableArray(curr));
    next = _toConsumableArray(data[curr[2]][curr[1]][curr[0]]);
  } while (next[0] !== -1 || next[1] !== -1 || next[2] !== -1);

  return _objectSpread(_objectSpread({}, path), {}, {
    data: sequence
  });
};

var step3 = function step3(path, random) {
  var start = _toConsumableArray(path.start);

  var end = _toConsumableArray(path.end);

  var data = _toConsumableArray(path.data);

  var depth = data.length;
  var height = data[0].length;
  var width = data[0][0].length;
  var xMax = width - 1;
  var yMax = height - 1;
  var zMax = depth - 1; // Randomize possible directions

  var dirs = random.shuffle([[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]); // Pick the first direction that won't take us outside the grid
  // or in the direction the start is already connected to.

  var dir = dirs.find(function (dir) {
    return !(start[0] + dir[0] < 0 || start[0] + dir[0] > xMax || start[1] + dir[1] < 0 || start[1] + dir[1] > yMax || start[2] + dir[2] < 0 || start[2] + dir[2] > zMax) && !(data[start[2]][start[1]][start[0]][0] === start[0] + dir[0] && data[start[2]][start[1]][start[0]][1] === start[1] + dir[1] && data[start[2]][start[1]][start[0]][2] === start[2] + dir[2]);
  }); // Make a note of the old start connection

  var oldStart = _toConsumableArray(data[start[2]][start[1]][start[0]]); // Connect the old start point in the new direction


  data[start[2]][start[1]][start[0]] = [start[0] + dir[0], start[1] + dir[1], start[2] + dir[2]]; // From the old start, follow the path and reverse 
  // the connections until the new start is reached

  var last = _toConsumableArray(start);

  var curr = _toConsumableArray(start);

  var next = _toConsumableArray(oldStart);

  while (next[0] !== start[0] + dir[0] || next[1] !== start[1] + dir[1] || next[2] !== start[2] + dir[2]) {
    last = _toConsumableArray(curr);
    curr = _toConsumableArray(next);
    next = _toConsumableArray(data[curr[2]][curr[1]][curr[0]]);
    data[curr[2]][curr[1]][curr[0]] = _toConsumableArray(last);
  }

  start = _toConsumableArray(curr);
  return {
    start: start,
    end: end,
    data: data
  };
};

var reverse3 = function reverse3(path) {
  var data = _toConsumableArray(path.data);

  var start = _toConsumableArray(path.start);

  var end = _toConsumableArray(path.end);

  var last = _toConsumableArray(start);

  var curr = _toConsumableArray(start);

  var next = _toConsumableArray(data[start[2]][start[1]][start[0]]);

  data[start[2]][start[1]][start[0]] = [-1, -1, -1];

  do {
    last = _toConsumableArray(curr);
    curr = _toConsumableArray(next);
    next = _toConsumableArray(data[curr[2]][curr[1]][curr[0]]);
    data[curr[2]][curr[1]][curr[0]] = _toConsumableArray(last);
  } while (next[0] !== -1 || next[1] !== -1 || next[2] !== -1);

  end = _toConsumableArray(start);
  start = _toConsumableArray(curr);
  return {
    start: start,
    end: end,
    data: data
  };
};
/* Returns a random looking 3D Hamiltonian path.
* Notes: First generates a basic Hamiltonian path then performs a series of randomizing steps.
* The number of steps has been set to width^2 * height^2 * 0.1 which is generally large enough
* to create a random looking path. The path is periodically reversed since the step function
* only moves the start point, allowing both start and end points to be somewhat randomized */


var hampath3 = function hampath3(_ref2) {
  var _ref2$width = _ref2.width,
      width = _ref2$width === void 0 ? 4 : _ref2$width,
      _ref2$height = _ref2.height,
      height = _ref2$height === void 0 ? 4 : _ref2$height,
      _ref2$depth = _ref2.depth,
      depth = _ref2$depth === void 0 ? 4 : _ref2$depth,
      seed = _ref2.seed;
  var path = simpleSaw3({
    width: width,
    height: height,
    depth: depth
  });

  var random = _random["default"].createRandom(seed);

  for (var i = 0; i < width * width * height * height * depth * depth * 0.1; i++) {
    if ((i + 1) % Math.max(width, height, depth) === 0) {
      path = reverse3(path);
    }

    path = step3(path, random);
  }

  ;
  return convertToSequence3(path);
};

exports.hampath3 = hampath3;