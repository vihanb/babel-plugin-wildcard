import { AAfter } from './data/*_after';
import * as before from './data/before_*';
import * as multiple from './data/before_*_and_*_after';
console.log(AAfter());
console.log(before.beforeB());
console.log(before.beforeCAndDAfter());
console.log(multiple.beforeCAndDAfter());
