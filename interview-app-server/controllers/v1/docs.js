
const docsGen = require('../../lib/docs.js')
const Controller = require('../../lib/controller.js')
const RamlMaker = require('../../lib/raml.js')

/**
 * Generates documentation for the api
 * @extends Controller
 */
class DocsController extends Controller {

  constructor(api){
    super(api);
    this.ramlMaker = new RamlMaker(api)
  }

  exec(req, res, session) {
    const {Promise} = this.api.store.adapter
    return new Promise((resolve, reject) => {
      docsGen.generateFromRaml(this.ramlMaker.getRaml(), function(err, docs){
        if(err){
          return reject(err)
        }
        return resolve({
          "body":docs
        })
      })
    })
  }
}

module.exports = DocsController
