'use strict';

var _test = require('./data/more/deep/test.js');

var _test2 = _interopRequireDefault(_test);

var _second = require('./data/more/deep/second.js');

var _second2 = _interopRequireDefault(_second);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var files = {};
files['More'] = {};
files['More']['Deep'] = {};
files['More']['Deep']['Test'] = _test2.default;
files['More']['Deep']['Second'] = _second2.default;

console.log(files.More.Deep.Test());
console.log(files.More.Deep.Second());
