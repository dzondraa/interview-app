const Controller = require('../../lib/controller.js')

class EndpointController extends Controller {

  exec(req, res, ses){
    // only admins can create endpoints
    return this.roles(req, ['admin'])
  }

  inputCreate(context, record, session){
    record.created = new Date()
    this.reloadStore(record)
    return record
  }

  inputUpdate(context, record, update){
    var inst = this
    update.replace.updated = new Date()
    return update
  }

  outputUpdate(context, record){
    this.rebootEndpoints(record)
    return record
  }

  inputDelete(context, record){
    this.rebootEndpoints(record)
    return null
  }


  rebootEndpoints(endpoint) {
    var type = endpoint.name
    setTimeout(()=>{
      delete Controller.api.storeConfig.hooks[type]
      Controller.api.model = Controller.copyModel(Controller.api.bootModel) //Object.assign({}, Controller.api.bootModel);
      Controller.api.store.find('endpoint').then((results)=>{
        if(results.payload && results.payload.records && results.payload.records.count > 0){
          Controller.initializeWith(results.payload.records)
        }else{
          Controller.initialize()
        }
      })
    }, 500)
  }


  reloadStore(endpoint) {
    var schema = Controller.initializeWith(endpoint)
    schema = schema[0]
    // fix for memory adapter bug, possibly others?
    if(Controller.api.store.adapter.db && !Controller.api.store.adapter.db[schema.name]){
      Controller.api.store.adapter.db[schema.name] = {}
    }
  }
}

module.exports = EndpointController
