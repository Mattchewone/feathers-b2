# feathers-b2

[![Build Status](https://travis-ci.org/git@github.com:Mattchewone/feathers-b2.git.png?branch=master)](https://travis-ci.org/git@github.com:Mattchewone/feathers-b2.git)
[![Code Climate](https://codeclimate.com/github/git@github.com:Mattchewone/feathers-b2.git/badges/gpa.svg)](https://codeclimate.com/github/git@github.com:Mattchewone/feathers-b2.git)
[![Test Coverage](https://codeclimate.com/github/git@github.com:Mattchewone/feathers-b2.git/badges/coverage.svg)](https://codeclimate.com/github/git@github.com:Mattchewone/feathers-b2.git/coverage)
[![Dependency Status](https://img.shields.io/david/git@github.com:Mattchewone/feathers-b2.git.svg?style=flat-square)](https://david-dm.org/git@github.com:Mattchewone/feathers-b2.git)
[![Download Status](https://img.shields.io/npm/dm/feathers-b2.svg?style=flat-square)](https://www.npmjs.com/package/feathers-b2)

> Featherjs B2 plugin to handle uploading to B2

## Installation

```
npm install feathers-b2 --save
```

## Documentation

Please refer to the [feathers-b2 documentation](http://docs.feathersjs.com/) for more details.

## Complete Example

Here's an example of a Feathers server that uses `feathers-b2`. 

```js
const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');
const bodyParser = require('body-parser');
const errorHandler = require('feathers-errors/handler');
const plugin = require('feathers-b2');

// Initialize the application
const app = feathers()
  .configure(rest())
  .configure(hooks())
  // Needed for parsing bodies (login)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  // Initialize your feathers plugin
  .use('/plugin', plugin())
  .use(errorHandler());

app.listen(3030);

console.log('Feathers app started on 127.0.0.1:3030');
```

## License

Copyright (c) 2017

Licensed under the [MIT license](LICENSE).
