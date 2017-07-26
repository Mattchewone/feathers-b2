/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    if (!options) {
      throw new Error('Feathers-B2 options have to be provided')
    }

    if (!options.Model || !options.Model) {
      throw new Error('You must provide a B2 Model')
    }

    this.Model = options.Model
  }

  find (params) {
    return new Promise((resolve, reject) => {
      // Authorize the request
      this.Model.authorize()
      .then(() => {
        // Fetch a list of the filenames
        this.Model.listFileNames({
          bucketId: params.query.bucketId,
          startFileName: params.query.startFileName || '',
          maxFileCount: 100,
          delimiter: '',
          prefix: ''
        })
        .then(res => {
          resolve({
            data: res.data
          })
        })
        .catch(reject)
      })
      .catch(reject)
    })
  }

  get (id, params = { query: { byId: false, download: false } }) {
    return new Promise((resolve, reject) => {
      // Authorize the request
      this.Model.authorize()
      .then(() => {
        // Cannot fetch file info for filename, needs to be an id
        if (!params.query.byId && !params.query.download) {
          throw new Error('getFileInfo requires a fileId not fileName')
        }

        // Handle getting fileinfo
        if (params.query.byId && !params.query.download) {
          this.Model.getFileInfo(id)
          .then(res => {
            resolve(res.data)
          })
          .catch(reject)
        }

        // Handle file download
        if (params.query.byId) {
          this.Model.downloadFileById({
            fileId: id
          })
          .then(res => {
            // Need to alter the content type to be download/file content
            // as the files are being downloaded as application/json
            resolve(res.data)
          })
          .catch(reject)
        } else {
          if (!params.query.bucketName) {
            throw new Error('bucketName is required to download by fileName')
          }
          this.Model.downloadFileByName({
            bucketName: params.query.bucketName,
            fileName: id,
          })
          .then(res => {
            // Need to alter the content type to be download/file content
            // as the files are being downloaded as application/json
            resolve(res.data)
          })
          .catch(reject)
        }
      })
      .catch(reject)
    })
  }

  create (data, params) {
    return new Promise((resolve, reject) => {
      // Authorize the request
      this.Model.authorize()
      .then(() => {
        // Need to have a bucketId
        if (!data.bucketId) {
          throw new Error('bucketId is required for file upload')
        }

        // Need to check filesize?
        // We can then opt to use the largeFileUpload to upload larger files

        // Get the uploadUrl and authorizationToken to process the upload
        this.Model.getUploadUrl(data.bucketId)
        .then(res => {
          // Run the upload
          this.Model.uploadFile({
              uploadUrl: res.data.uploadUrl,
              uploadAuthToken: res.data.authorizationToken,
              filename: data.fileName || params.file.originalname, // use the uploaded filename or one provided in the request
              mime: params.file.mimetype, // optonal mime type, will default to 'b2/x-auto' if not provided
              data: params.file.buffer, // this is expecting a Buffer not an encoded string,
          })
          .then(res => {
            // return the success data
            resolve(res.data)
          })
          .catch(reject)
        })
        .catch(reject)
      })
      .catch(reject)
    })
  }

  remove (id, params) {
    // Do nothing if we have no id
    if (!id) {
      throw new Error('Please provide a fileId')
    }

    return new Promise((resolve, reject) => {
      // Authorize the request
      this.Model.authorize()
      .then(() => {

        if (!params.query.fileName) {
          throw new Error('fileName is required for deleting a file')
        }

        // Delete the fileVersion
        this.Model.deleteFileVersion({
          fileId: id,
          fileName: params.query.fileName
        })
        .then(res => {
          // Return the success message from B2
          // This should be the fileName and the fileId
          resolve(res.data)
        })
        .catch(reject)
      })
      .catch(reject)
    })
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
