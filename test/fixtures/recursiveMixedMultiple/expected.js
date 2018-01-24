'use strict';

var _test = require('./data/test.js');

var _test2 = _interopRequireDefault(_test);

var _test3 = require('./data/more/deep/test.js');

var _test4 = _interopRequireDefault(_test3);

var _second = require('./data/more/deep/second.js');

var _second2 = _interopRequireDefault(_second);

var _test5 = require('./data/another/test.js');

var _test6 = _interopRequireDefault(_test5);

var _second3 = require('./data/another/second.js');

var _second4 = _interopRequireDefault(_second3);

var _test7 = require('./data/another/deep/test.js');

var _test8 = _interopRequireDefault(_test7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var files = {};
files['Another'] = {};
files['Another']['Deep'] = {};
files['More'] = {};
files['More']['Deep'] = {};
files['Test'] = _test2.default;
files['More']['Deep']['Test'] = _test4.default;
files['More']['Deep']['Second'] = _second2.default;
files['Another']['Test'] = _test6.default;
files['Another']['Second'] = _second4.default;
files['Another']['Deep']['Test'] = _test8.default;

console.log(files.Test());
console.log(files.Another.Deep.Test());
console.log(files.Another.Second());
console.log(files.Another.Test());
console.log(files.More.Deep.Test());
console.log(files.More.Deep.Second());
