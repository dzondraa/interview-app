const Controller = require('../../lib/controller.js')
const router = require('../../lib/router.js')
/**
 * Default business logic for an endpoint.
 * In case when there's no custom controller implementation
 * @extends Controller
 */
class DefaultController extends Controller {

  inputCreate(context, record, session){
    record.created = new Date()
    record.updated = record.created
    return record
  }

  inputUpdate(context, record, update){
    let createdDate = record.created
    if(!createdDate) createdDate = new Date().toISOString()
    if(update.replace){
      update.replace.created = new Date(createdDate)
      update.replace.updated = new Date()
    }else{
      update.replace = {
        created: new Date(createdDate),
        updated:new Date() 
      }
    }
    return update
  }

  exec(req, res, ses){
    // default access
    return this.roles(req, ['admin', 'user', 'anon']).then(_=>router.route(this, req, res, ses))
  }

}

module.exports = DefaultController
