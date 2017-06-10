import _path from 'path';
import _fs from 'fs';

export default function (babel) {
  const { types: t } = babel;
  
  return {
    visitor: {
      ImportDeclaration(path, state) {
        let node = path.node, dec;
        var src = path.node.source.value;
        let addWildcard = false, wildcardName;
        for (var i = 0; i < node.specifiers.length; i++) {
          dec = node.specifiers[i];
          
          if (t.isImportNamespaceSpecifier(dec)) {
            addWildcard = true;
            wildcardName = node.specifiers[i].local.name;
            node.specifiers.splice(i, 1);
          }
        }

        var exts = state.opts.exts || ["js", "es6", "es", "jsx"];
        
        if (addWildcard) {
          var obj = t.variableDeclaration(
            "const", [
            t.variableDeclarator(t.identifier(wildcardName), t.objectExpression([]))
          ]);
          path.insertBefore(obj);
          
          var name = this.file.parserOpts.sourceFileName || this.file.parserOpts.filename;

          var files = [];
          var dir = _path.join(_path.dirname(name), src);

          try {
              let r = _fs.readdirSync(dir);
              for (var i = 0; i < r.length; i++) {
                  if (exts.indexOf(_path.extname(r[i]).substring(1)) > -1)
                      files.push(r[i]);
              }
          } catch(e) {
              console.warn(`Wildcard for ${name} points at ${src} which is not a directory.`);
              return;
          }
          
          for (var i = 0; i < files.length; i++) {
            let id = path.scope.generateUidIdentifier("wcImport");
            var file = files[i];
            var fancyName = file.replace(/(?!^)\.[^.\s]+$/, "");
            if (fancyName[0] === ".") fancyName = fancyName.substring(1);
            if (state.opts.noCamelCase !== true)
                fancyName = fancyName.match(/[A-Z][a-z]+(?![a-z])|[A-Z]+(?![a-z])|([a-zA-Z\d]+(?=-))|[a-zA-Z\d]+(?=_)|[a-z]+(?=[A-Z])|[A-Za-z0-9]+/g).map(s => s[0].toUpperCase() + s.substring(1)).join("");
            var name;
            if (state.opts.nostrip !== true) name = "./" + _path.join(src, _path.basename(file));
            else name = "./" + _path.join(src, file);

            let importDeclaration = t.importDeclaration(
              [t.importDefaultSpecifier(
                id
              )],
              t.stringLiteral(name)
            );
            let thing = t.expressionStatement(
                t.assignmentExpression("=", t.memberExpression(
                  t.identifier(wildcardName),
                  t.identifier(
                    fancyName
                  )
                ), id
            ));

            path.insertAfter(thing);
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

