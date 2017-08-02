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
        // Fetch a list of buckets
        this.Model.listBuckets()
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

  create (data, params) {
    return new Promise((resolve, reject) => {
      // Authorize the request
      this.Model.authorize()
      .then(() => {

        // Need to have a bucketName
        if (!data.bucketName) {
          throw new Error('bucketName is required')
        }
        // Need to have bucketType
        if (!data.bucketType) {
          throw new Error('bucketType is required (`allPublic`, `allPrivate`)')
        }

        // Create the bucket
        this.Model.createBucket(data.bucketName, data.bucketType)
        .then(res => {
          // Return the results
          resolve(res.data)
        })
        .catch(err => {
          reject(new Error(`Error: ${err.response.data.message}`))
        })
      })
      .catch(reject)
    })
  }

  remove (id, params) {
    // Do nothing if we have no id
    if (!id) {
      throw new Error('Please provide a bucketId')
    }

    return new Promise((resolve, reject) => {
      // Authorize the request
      this.Model.authorize()
      .then(() => {
        // Delete the bucket
        this.Model.deleteBucket(id)
        .then(res => {
          // Return the success message from B2
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
