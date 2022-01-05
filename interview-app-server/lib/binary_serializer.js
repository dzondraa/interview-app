'use strict'

module.exports = function (HttpSerializer) {

  function BinarySerializer (properties) {
    HttpSerializer.call(this, properties)
  }

  BinarySerializer.prototype = Object.create(HttpSerializer.prototype)

  BinarySerializer.prototype.processResponse = function (contextResponse, request, response) {
    return contextResponse
  }

  BinarySerializer.prototype.parsePayload = function (contextRequest) {
    return contextRequest
  }

  BinarySerializer.mediaType = 'binary/octet-stream'

  return BinarySerializer

}
