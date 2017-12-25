'use strict';

var _test = require('manualAlias/nested/test.js');

var _test2 = _interopRequireDefault(_test);

var _test3 = require('webpackAlias/nested/test.js');

var _test4 = _interopRequireDefault(_test3);

var _unnested_again = require('manualAlias/unnested_again.js');

var _unnested_again2 = _interopRequireDefault(_unnested_again);

var _unnested = require('manualAlias/unnested.js');

var _unnested2 = _interopRequireDefault(_unnested);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var manual = {};
manual['Test'] = _test2.default;
var webpack = {};
webpack['Test'] = _test4.default;
var unnested = {};
unnested['UnnestedAgain'] = _unnested_again2.default;
unnested['Unnested'] = _unnested2.default;


console.log(manual.Test());
console.log(webpack.Test());
console.log(unnested.Unnested());
console.log(unnested.UnnestedAgain());
