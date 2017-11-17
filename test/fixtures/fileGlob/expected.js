'use strict';

var _A_after = require('./data/A_after.js');

var _A_after2 = _interopRequireDefault(_A_after);

var _before_C_and_D_after = require('./data/before_C_and_D_after.js');

var _before_C_and_D_after2 = _interopRequireDefault(_before_C_and_D_after);

var _before_B = require('./data/before_B.js');

var _before_B2 = _interopRequireDefault(_before_B);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var before = {};
before['BeforeCAndDAfter'] = _before_C_and_D_after2.default;
before['BeforeB'] = _before_B2.default;

var multiple = {};
multiple['BeforeCAndDAfter'] = _before_C_and_D_after2.default;

console.log((0, _A_after2.default)());
console.log(before.beforeB());
console.log(before.beforeCAndDAfter());
console.log(multiple.beforeCAndDAfter());
