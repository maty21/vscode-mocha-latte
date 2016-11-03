'use strict';

const babylon = require('babylon');

function isValidTest(token){
  const expression = token.expression;

  return token.type === "ExpressionStatement" && expression.type === "CallExpression" // This is a function call
    && ["describe", "it"].indexOf(expression.callee.name) !== -1 // This is a valid mocha test context
    && expression.arguments.length === 2 && expression.arguments[0].type === "StringLiteral" && expression.arguments[1].type === "FunctionExpression"; // This is a valid test definition
}

function detectTests(body, path, tests){
  body.filter(isValidTest).forEach(token => {
    const name = token.expression.arguments[0].value;

    // Add the test
    tests.push({depth: path.length, label: path.concat(name).join(" "), start: token.loc.start.line, end: token.loc.end.line});

    // Parse the called function
    detectTests(token.expression.arguments[1].body.body, path.concat(name), tests);
  });
}

module.exports.getTests = function getTests(text){
  const ast = babylon.parse(
    text,
    {sourceType: "import", allowReturnOutsideFunction: true, allowImportExportEverywhere: true}
  );

  let tests = [];
  // Start a depth-first visit of the tree
  detectTests(ast.program.body, [], tests);

  return tests.sort((a, b) => b.depth - a.depth); // Sort by descending depth in order to correct recognize nested positions
}
