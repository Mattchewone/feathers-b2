const feathers = require('feathers');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const handler = require('feathers-errors/handler');
const bodyParser = require('body-parser');
const multer = require('multer');
const multipartMiddleware = multer();

const B2 = require('backblaze-b2')
const { files: fileService, buckets } = require('../lib/')

// Setup the B2 SDK
const b2 = new B2({
  accountId: process.env['accountId'],
  applicationKey: process.env['applicationKey']
});
// fileService options
const options = {
  name: 'files',
  Model: b2
};

// Create a feathers instance.
const app = feathers()
  // Enable Socket.io
  .configure(socketio())
  // Enable REST services
  .configure(rest())
  // Turn on JSON parser for REST services
  .use(bodyParser.json())
  // Turn on URL-encoded parser for REST services
  .use(bodyParser.urlencoded({extended: true}))
  // add the file endpoint
  .use('/files',
    multipartMiddleware.single('uri'),

    // another middleware, this time to
    // transfer the received file to feathers
    function(req,res,next){
        req.feathers.file = req.file;
        next();
    },

    // use the fileService
    fileService(options)
  )
// app.configure(fileService);

// A basic error handler, just like Express
app.use(handler());

// Start the server if we're not being required in a test
if (!module.parent) {
  app.listen(3030);
  console.log('Feathers B2 service running on 127.0.0.1:3030');
}

module.exports = app;