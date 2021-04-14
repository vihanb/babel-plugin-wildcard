import _path from 'path';
import _fs from 'fs';

export default function (babel) {
    const { types: t } = babel;

    return {
        visitor: {
            ImportDeclaration(path, state) {
                let node = path.node, dec;
                var src = path.node.source.value;

                // Don't do anything if not a relative path
                // if if not a relative path then a module
                if (src[0] !== "." && src[0] !== "/") return;

                let addWildcard = false, // True if should perform transform
                    wildcardName;        // Name of the variable the wilcard will go in
                // not set if you have a filter { A, B, C }

                let filterNames = []; // e.g. A, B, C

                // has a /* specifing explicitly to use wildcard
                const wildcardRegex = /\/([^\/]*\*[^\/]*)$/;
                let isExplicitWildcard = wildcardRegex.test(src);
                let filenameRegex = new RegExp('.+');

                // in the above case we need to remove the trailing /*
                if (isExplicitWildcard) {
                    const lastSlash = path.node.source.value.lastIndexOf('/');
                    src = path.node.source.value.substring(0, lastSlash);
                    const filenameGlob = path.node.source.value.substring(lastSlash + 1);
                    path.node.source.value = src;
                    filenameRegex = filenameGlob.replace(/[*\.\(\[\)\]]/g, character => {
                        switch(character) {
                            case '*':
                                return '.*';
                            case '(':
                            case ')':
                            case '[':
                            case ']':
                            case '.':
                                return '\\' + character;
                        }
                        return character;
                    });
                    filenameRegex = new RegExp(filenameRegex);
                }


                // Get current filename so we can try to determine the folder
                var name = state.file.opts.filename;

                var files = [];
                var isDirs = [];
                var dir = _path.join(_path.dirname(name), src); // path of the target dir.

                for (var i = node.specifiers.length - 1; i >= 0; i--) {
                    dec = node.specifiers[i];

                    if (
                        t.isImportNamespaceSpecifier(dec) &&
                        _fs.existsSync(dir) &&
                        !_fs.statSync(dir).isFile() &&
                        !_fs.existsSync(_path.join(dir, 'index.js'))
                    ) {
                        addWildcard = true;
                        wildcardName = node.specifiers[i].local.name;
                        node.specifiers.splice(i, 1);
                    }

                    // This handles { A, B, C } from 'C/*'
                    if (t.isImportSpecifier(dec) && isExplicitWildcard) {
                        // original: the actual name to lookup
                        // local: the name to import as, may be same as original
                        // We do this because of `import { A as B }`
                        filterNames.push({
                            original: dec.imported.name,
                            local: dec.local.name
                        });

                        addWildcard = true;

                        // Remove the specifier
                        node.specifiers.splice(i, 1);
                    }
                }

                // If they are no specifies but it is explicit
                if (isExplicitWildcard) {
                    addWildcard = true;
                    wildcardName = null;
                }

                // All the extensions that we should look at
                var exts = state.opts.exts || ["js", "es6", "es", "jsx"];

                if (addWildcard) {
                    // Add the original object. `import * as A from 'foo';`
                    //  this creates `const A = {};`
                    // For filters this will be empty anyway
                    if (filterNames.length === 0 && wildcardName !== null) {
                        var obj = t.variableDeclaration("const", [
                            t.variableDeclarator(
                                t.identifier(wildcardName),
                                t.objectExpression([])
                            )
                        ]);
                        path.insertBefore(obj);
                    }

                    // Will throw if the path does not point to a dir
                    try {
                        let r = _fs.readdirSync(dir);
                        for (var i = 0; i < r.length; i++) {
                            // Check extension is of one of the aboves
                            const {name, ext} = _path.parse(r[i]);
                            if ((exts.length === 0 || exts.indexOf(ext.substring(1))) > -1 && filenameRegex.test(name)) {
                                files.push(r[i]);
                                isDirs.push(!ext);
                            }
                        }
                    } catch(e) {
                        console.warn(`Wildcard for ${name} points at ${src} which is not a directory.`);
                        return;
                    }

                    // This is quite a mess but it essentially formats the file
                    // extension, and adds it to the object
                    for (var i = 0; i < files.length; i++) {
                        // name of temp. variable to store import before moved
                        // to object
                        let id = path.scope.generateUidIdentifier("wcImport");

                        var file = files[i];
                        const isDir = isDirs[i];

                        // Strip extension
                        var fancyName = file.replace(/(?!^)\.[^.\s]+$/, "");

                        // Handle dotfiles, remove prefix `.` in that case
                        if (fancyName[0] === ".") {
                            fancyName = fancyName.substring(1);
                        }

                        // If we're allowed to camel case, which is default, we run it
                        // through this regex which converts it to a PascalCase variable.
                        if (state.opts.noModifyCase !== true) {
                            let parts = fancyName.match(/[A-Z][a-z]+(?![a-z])|[A-Z]+(?![a-z])|([a-zA-Z\d]+(?=-))|[a-zA-Z\d]+(?=_)|[a-z]+(?=[A-Z])|[A-Za-z0-9]+/g);
                            if (state.opts.useCamelCase) {
                                fancyName = parts[0].toLowerCase() + parts.slice(1).map(s => s[0].toUpperCase() + s.substring(1)).join("")
                            } else {
                                fancyName = parts.map(s => s[0].toUpperCase() + s.substring(1)).join("");
                            }
                        }

                        // Now we're 100% settled on the fancyName, if the user
                        // has provided a filer, we will check it:
                        if (filterNames.length > 0) {
                            // Find a filter name
                            let res = null;
                            for (let j = 0; j < filterNames.length; j++) {
                                if (filterNames[j].original === fancyName) {
                                    res = filterNames[j];
                                    break;
                                }
                            }
                            if (res === null) continue;
                            fancyName = res.local;
                        }

                        // This will remove file extensions from the generated `import`.
                        // This is useful if your src/ files are for example .jsx or
                        // .es6 but your generated files are of a different extension.
                        // For situations like webpack you may want to disable this
                        var name;
                        if (state.opts.nostrip !== true) {
                            name = "./" + _path.join(src, _path.basename(file));
                        } else {
                            name = "./" + _path.join(src, file);
                        }

                        // Special behavior if 'filterNames'
                        if (filterNames.length > 0) {
                            let importDeclaration = t.importDeclaration(
                                [t.importDefaultSpecifier(
                                    t.identifier(fancyName)
                                )],
                                t.stringLiteral(name)
                            );
                            path.insertAfter(importDeclaration);
                            continue;
                        }

                        // Generate temp. import declaration
                        let importDeclaration = t.importDeclaration(
                            [
                                isDir
                                    ? t.importNamespaceSpecifier(id)
                                    : t.importDefaultSpecifier(id)
                            ],
                            t.stringLiteral(name)
                        );

                        // Assign it
                        if (wildcardName !== null) {
                            let thing = t.expressionStatement(
                                t.assignmentExpression("=", t.memberExpression(
                                    t.identifier(wildcardName),
                                    t.stringLiteral(fancyName),
                                    true
                                ), id
                            ));

                            path.insertAfter(thing);
                        }

                        path.insertAfter(importDeclaration);
                    }

                    if (path.node.specifiers.length === 0) {
                        path.remove();
                    }
                }
            }
        }
    };
}
