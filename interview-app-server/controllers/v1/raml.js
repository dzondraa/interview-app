const Controller = require('../../lib/controller.js')
const RamlMaker = require('../../lib/raml.js')

class RamlController extends Controller {

  constructor(api){
    super(api);
    this.ramlMaker = new RamlMaker(api)
  }

  exec(req, res, session) {
    const {Promise} = this.api.store.adapter

    var ramlVersion = req.urlParsed.pathname.split('/')[2]
    ramlVersion = ramlVersion || '1.0'

    return Promise.resolve({
      "body": this.ramlMaker.getRaml(ramlVersion)
    })
  }
  
}

module.exports = RamlController
