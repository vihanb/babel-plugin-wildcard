'use strict';

var _test = require('./data/test.js');

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var files = {};
files['Test'] = _test2.default;

console.log(files.Test());
