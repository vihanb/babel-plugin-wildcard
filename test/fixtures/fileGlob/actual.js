import { AAfter } from './data/*_after';
import * as before from './data/before_*';
import * as multiple from './data/before_*_and_*_after';
import * as dot from './data/with.*';
console.log(AAfter());
console.log(before.BeforeB());
console.log(before.BeforeCAndDAfter());
console.log(multiple.BeforeCAndDAfter());
console.log(dot.WithDot());
