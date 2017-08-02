const feathers = require('feathers')
const rest = require('feathers-rest')
const socketio = require('feathers-socketio')
const handler = require('feathers-errors/handler')
const bodyParser = require('body-parser')
const multer = require('multer')
const multipartMiddleware = multer()
const path = require('path')
const timeout = require('connect-timeout')

const B2 = require('backblaze-b2')
const { files: fileService, buckets: bucketService } = require('../lib/')

// Setup the B2 SDK
const b2 = new B2({
  accountId: process.env['accountId'],
  applicationKey: process.env['applicationKey']
})
// fileService options
const options = {
  Model: b2
}

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

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
  // Host the public folder
  app.use('/', feathers.static(path.join(__dirname, './public')))

  // add the file endpoint
  .use('/files',
    multipartMiddleware.single('file'),
    // Add timeout to allow for length request
    timeout('25m'),

    // another middleware, this time to
    // transfer the received file to feathers
    function(req,res,next){
        req.feathers.file = req.file
        req.body.bucketId = 'cab869322dd730185dda001e'
        next()
    },
    haltOnTimedout,
    // use the fileService
    fileService(options)
  )
  .use('/buckets', bucketService(options))

// A basic error handler, just like Express
// app.use(handler())

// Start the server if we're not being required in a test
if (!module.parent) {
  app.listen(3030)
  console.log('Feathers B2 service running on http://127.0.0.1:3030')
}

module.exports = app
