const Controller = require('../../lib/controller.js')

class SchemaController extends Controller {
  exec(req, res, session){
    const { Promise } = this.api.store.adapter
    var modelName = req.urlParsed.pathname.split('/')[2]
    if(this.api.schema[modelName]){
      return Promise.resolve({"body":this.api.schema[modelName]})
    }

    const { message, errors: { NotFoundError } } = this.api.store.adapter
    let forbid = new NotFoundError(message('InvalidID', req.language))
    return Promise.reject(forbid)
  }
}

module.exports = SchemaController
