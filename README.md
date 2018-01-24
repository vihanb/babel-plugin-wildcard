# babel-plugin-wildcard

Allows you to `import` all files from a directory at compile-time.

## Installation

```sh
$ npm install babel-plugin-wildcard
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["wildcard"]
}
```

### Via CLI

```sh
$ babel --plugins include script.js
```

### Via Node API

```javascript
require('babel').transform('code', {
  plugins: ['wildcard']
});
```

## Example

With the following folder structure:

```
|- index.js
|- dir
    |- a.js
    |- b.js
    |- c.js
```

the following JS:

```javascript
import * as Items from './dir';
```

will be compiled to:

```javascript
const Items = {};
import _wcImport from "./dir/a";
Items.A = _wcImport;
import _wcImport1 from "./dir/b";
Items.B = _wcImport1;
import _wcImport2 from "./dir/c";
Items.C = _wcImport2;
```

meaning you will be able to access the items using `Items.A` and `Items.B`.

---

The above works recursively with nested directories as well:

```
|- index.js
|- dir
    |- a.js
    |- c.js
    |- nested
        |- b.js
```

the following JS:

```javascript
import * as Items from './dir';
```

will be compiled to:

```javascript
const Items = {};
import _wcImport from "./dir/a";
Items.A = _wcImport;
import _wcImport1 from "./dir/c";
Items.C = _wcImport1;
Items.Nested = {};
import _wcImport3 from "./dir/nested/c";
Items.Nested.C = _wcImport3;
```

---

You can also selectively choose files using:

```javascript
import { A, C } from "dir/*";
```

which in the above example would convert to:

```
import A from "./dir/a";
import C from "./dir/c";
```

The above is like doing:

```
import * as temp from "dir";
const { A, C } = temp;
```

---

There is also simple Glob support so given the directory structure:

```
|- index.js
|- dir
    |- a.js
    |- a.spec.js
    |- b.js
    |- b.spec.js
```

this import:

```javascript
import * as tests from './dir/*.spec';
```

will compile to:

```javascript
import aSpec from './dir/a.spec';
import bSpec from './dir/b.spec';
```

---

Files and nested directory names are automatically camel-cased and in the `import` statements the extensions are clipped unless specified otherwise (see below)

## Information

 - File extensions are removed in the resulting variable. Dotfiles will be imported without their preceding `.` (e.g. `.foo` -> `Foo` or `foo` depending on settings)
 - in an `import { ... } from 'foo/*'`, the identifiers inside { ... } are the same as what their name
 would be if you were to import the whole directory. This means it is the files' names' camel-cased and extensions removed etc. by default (depending on settings of course).

## Options

`babel-plugin-wildcard` allows you to change various settings by providing an options object by using the following instead:

```javascript
{
    plugins: [
        ['wildcard', { options }]
    ]
}
```

where `{ options }` is the options object. The following options are available:

### `exts`
By default, the files with the following extensions: `["js", "es6", "es", "jsx"]`, will be imported. You can change this using:

```javascript
{
    plugins: [
        ['wildcard', {
            'exts': ["js", "es6", "es", "jsx", "javascript"]
        }]
    ]
}
```

### `nostrip`
By default, the file extension will be removed in the generated `import` statements, you can change this using:

```javascript
{
    plugins: [
        ['include', {
            'nostrip': true
        }]
    ]
}
```

This is useful when the extension of your source files is different from the outputted ones. (e.g. `.jsx` to `.js`).

### `noCamelCase`
By default, the name will be automatically camel cased, the following regex is used to extract the words, those words then have their first letter capitalized and are joined together:

```
[A-Z][a-z]+(?![a-z])|[A-Z]+(?![a-z])|([a-zA-Z\d]+(?=-))|[a-zA-Z\d]+(?=_)|[a-z]+(?=[A-Z])|[A-Za-z0-9]+
```

you can disable this behavior using:

```javascript
{
    plugins: [
        ['include', {
            'noCamelCase': true
        }]
    ]
}
```

Extensions are still removed (except dotfiles, see "Information").
