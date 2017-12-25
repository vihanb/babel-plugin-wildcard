'use strict';

var _test = require('./data/test.js');

var _test2 = _interopRequireDefault(_test);

var _test3 = require('./data/test.es6');

var _test4 = _interopRequireDefault(_test3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var js = {};
js['Test'] = _test2.default;
var es6 = {};
es6['Test'] = _test4.default;

console.log(js.Test());
console.log(es6.Test());
