# JavaScript, HTML and CSS Style Guide

## Why is consistent code style important?

__Consistent code, even when written by a team, should look like one person wrote it.__

Following a consistent style guide helps improve the overall
quality of the code we write. This helps other developers stepping
in to assist with maintenance more easily and can certainly save time in
the long haul.

Readable source code is arguably easier to understand as well. It's
easier to browse, locate and fix bugs in, and easier to optimize. It can
also give us a clearer picture of how the code fits into a larger body
of work.

Consistently styled code can:
- Reduce the lead time required to understand an implementation.
- Make it easier to establish what code can be reused.
- Clarify how updates to an implementation should be styled or structured.

Our JavaScript style should always pass JSLint/JSHint with no options to turn certain checks off. 

## Strict Mode

Every javascript file should start with `"use strict";`. 

_For this project, do not do this. `"use strict";` will be automatically added during the build step._

## Semicolons

Use semicolons. That is all. Ignore the nay-sayers. They are wrong. 

## Quotes

Prefer `'single quotes'` over `"double quotes"`. Always. 

## Arrays

Use `[ 1, 2, 3 ]` instead of `new Array(1, 2, 3)`.

## Whitespace

Always use two spaces.

__Never__ use tabs.

Never leave trailing whitespace.

Put whitespace between operators.

Most importantly, make it look __good__. 

Readable code is better than code smashed into one line. Let the minifier shorten the code up. 
_You are writing code for a person to read, not a machine._

We care more about beautiful code than fast and clever code. 

__OK:__
```javascript
if (foo === bar) {
  x = y + 7;
  x += 2;
}

var query =
  foo.find()
     .limit()
     .sort();
```

__NOT OK:__
```javascript
if(foo == bar){
    x = y+7;
    x+=2;
}

var query = foo.find().sort().exec();
```

## Curly Braces

You should always use curly braces, with the exception of `if (err) return next(err);`.

Braces should always be on the same line as the control statement.

There should always be whitespace around braces.

__OK:__
```javascript
if (foo) {
  bar();
} else if (baz) {
  bam();
} else {
  fish();
}

if (meow) {
  mix();
}

function foo(bar) {
  return bar + 'bar';
}
```

__NOT OK:__
```javascript
if (foo) bar();
else if (baz)
{
  bam();
}
else
  fish();

if (meow) // always remember your braces
  mix();

if (moew){ // <----- IF THERE ISN'T A SPACE, ADAM WILL SUFFER FROM SERIOUS OCD. YOU DON'T WANT THAT, DO YOU???
  mix();
}

function foo ( bar ){
  return 'this is rilly bad style'
}
```

## Variable declarations

Always use camelCase.

Do not use underscore_separated or CONSTANT_NOTATION variable names.

Do not start variables with a capital letter unless they are a class
declaration, or an Angular modules (such as App, Controllers, Directives...etc);

In config files, keys should be underscore_separated. They should not
use dashes or capital letters.

Use good ordering with require statements. Put built-in modules first,
then npm modules, then relative requires.

When declaring variable list use the following syntax, of putting the
comma at the end of the line. Always align on the '=' sign. 

__OK:__
```javascript
var fs         = require('fs'),
    express    = require('express'),
    redis      = require('redis'),
    config     = require('config'),
    models     = require('models'),
    baptize    = require('lib/baptize'),
    calculator = require('../lib/calculator'),
    app        = express.createServer(),
    appCache   = {}
  ;
```

__NOT OK:__
```javascript
var express = require('express')
  , redis = require('redis')
  , models = require('models')
  , fs = require('fs') // this should be first
  , calculator = require('../lib/calculator')
  , config = require('config')
  , app = require('express').createServer() // requires should be by themselves
  , app_cache = {}
  ;
```

## Functions

Methods should be declared as functions, and not assigned to vars.
Callbacks should be called `cb`, and should be the last argument

__OK:__
```javascript
function doublePositive(number, cb) {
  // when possible, handle error cases first
  if (number <= 0) return cb(new Error("number not positive"));
  cb(null, number * 2);
}
```

__NOT OK:__
```javascript
// anonymous functions result in bad stack traces
var doublePositive = function(number, callback) {
  if (number > 0) {
    // a non-error should be null
    callback(false, number * 2);
  } else {
    // do not return strings for error param
    callback("number not positive");
  }
}
```

## Objects

Always use comma last formatting.

If an object has only one property, inline it, and put spaces after and
before the braces.

If an object has multiple properties, put each property on it's own
line.

If all object keys are valid identifiers, then do not use quotes. If any
object key is not a valid identifier, all keys must have quotes.

__OK:__
```javascript
var conf = { put: 'spaces' };

var user = {
  name: {
    first: 'John',
    last: 'Doe'
  },
  email: 'john@doe.com'
};

var headers = {
  'Content-Type': 'text/plain',
  'Content-Length': 1024,
  'Connection': 'close'
};
```

__NOT OK:__
```javascript
var conf = {'put':'spaces'};

var user = {
  "name": { "first": 'John', "last": 'Doe' },
  "email": 'john@doe.com'
};

var headers = {
    "Content-Type": 'text/plain'
  , "Content-Length": 1024
  , Connection: 'close'
};
```

## Logging

Log all you want. console.log statements will be removed during the deploy step. 

## Iteration

For consistency in the browser, use [lodash](http://lodash.com/) for the great iterator functions it provides. 

## Type Coersion

Always be explicit in showing when casting to a type.

__OK:__
```javascript
x = parseInt(x);

x = parseFloat(x);

x = Number(x);

x = Math.floor(x);

x = x.toString();

x = Boolean(x);
```

__NOT OK:__
```javascript
x = +x;

x = new Number(x);

x = x+'';

x = !!x;
```

## Type Testing

When testing for truthiness/existance, use `if (variable)` or `if (!variable)`.

If looking for a specific type, use `typeof`.

Test for Arrays with `Array.isArray` or `arr instanceof Array`.

__OK:__
```javascript
if (!(arr instanceof Array)) {
  arr = [];
}

if (!Array.isArray(arr)) {
  arr = [];
}

// if it should be either an array or falsy, then this is better.
if (!arr) {
  arr = [];
}
// or
arr = arr || [];

if (err) return cb(err);

if (!arg) {
  arg = 7;
}
```

__NOT OK:__
```javascript
if (_.isArray(arr)) {
  arr = [];
}

if (typeof err === 'object' && err !== null) return cb(err);

if (arg === null || arg === undefined || arg === false) {
  arg = 7;
}
```

## HTML & CSS

When declaring id's and class, ALWAYS use "-" notation, like so: 

`<div class="big-list" id='result-list'>...</div>`

## Not sure?

Ask [Scott Hillman](mailto:scotth@mediarain.com) . If there isn't something covered here, let us know so we can add it. 
