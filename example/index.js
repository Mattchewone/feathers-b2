const B2 = require('backblaze-b2')
const { files, buckets } = require('feathers-b2')

// Initializes the `files` service on path `/files`
const hooks = require('./files.hooks');
const filters = require('./files.filters');

module.exports = function () {
  const app = this;
  // const Model = createModel(app);
  // const paginate = app.get('paginate');

  var b2 = new B2({
    accountId: 'accountId',
    applicationKey: 'applicationKey'
  });

  const options = {
    name: 'files',
    model: b2
    // paginate
  };

  // Initialize our service with any options it requires
  app.use('/files', files(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('files');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};

fileService.create() // --> sends a file
fileService.find()   // --> return a list of files
fileService.get('file-name', {})    // --> retrieves info for a single file
fileService.get('file-name', { download: true })    // --> retrieves info for a single file
fileService.get('file-id', { byId: true })    // --> retrieves info for a single file
fileService.get('file-id', { byId: true, download: true })    // --> retrieves info for a single file
