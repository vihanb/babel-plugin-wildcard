import * as manual from 'manualAlias/nested';
import * as webpack from 'webpackAlias/nested';
import * as unnested from 'manualAlias/unnested*';
console.log(manual.Test());
console.log(webpack.Test());
console.log(unnested.Unnested());
console.log(unnested.UnnestedAgain());