'use strict';

var _test = require('./data/more/deep/test.js');

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var files = {};
files['More'] = {};
files['More']['Deep'] = {};
files['More']['Deep']['Test'] = _test2.default;

console.log(files.More.Deep.Test());
