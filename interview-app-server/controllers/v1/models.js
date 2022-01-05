const DefaultController = require('./default.js')

class ModelsController extends DefaultController {

  inputCreate(context, record, session){
    let user = session.user
    // user must fill in basic info first before she can apply for model
    let requiredFields = ['dateOfBirth', 'fullName', 'email', 'phoneNumber', 'streetAddress', 'suiteNumber', 'city', 'zip', 'country']
    let missingFields = []
    requiredFields.forEach(f => { if(!user[f]) missingFields.push(f) })
    if(missingFields.length) return Promise.reject(new Error("Model cannot be created because user profile is incomplete. Missing fields: "+missingFields.join(', ')))

    // check if model already exists
    const options = {
        match:{
            user: user.id
        },
        fields:{id:true}
    }
    return this.api.store.find('models', null, options, null, {nofilter:true}).then((result) => {
        var model = result.payload.records[0]
        if(model) return Promise.reject(new Error("Model already exists. Model id: "+model.id))
        let isAdmin = context.request.meta.nofilter || session.user.roles.includes("admin") ? true : false
        if(!isAdmin){
          // non admins can't set status (defaults to pending), testShootStatus defaults to pending if record.testShootDate is set
          record.status = 'pending'
          if(record.testShootDate) {
            record.testShootStatus = 'pending'
          } else {
            delete record.testShootStatus
          }
          record.user = user.id
        }else{
          // admin can set arbitrary user, status and testShootStatus (but has defaults to not break the logic)
          if(!record.user) record.user = user.id
          if(!record.status) record.status = 'pending'
          if(record.testShootDate && !record.testShootStatus) record.testShootStatus = 'pending'
        }
        return record
    })
  }

  inputUpdate(context, record, update, session){
    // user cannot update own model statuses and user reference
    let isAdmin = context.request.meta.nofilter || session.user.roles.includes("admin") ? true : false
    if(!isAdmin) this.filterFields(update, ['testShootStatus', 'status', 'user', 'photos'], 'update') 
    if(!update.replace) update.replace = {}
    update.replace.created = new Date(record.created)
    update.replace.updated = new Date()
    if(record.testShootDate) update.replace.testShootDate = new Date(record.testShootDate)
    return update
  }

  async "GET /models"(req, res, ses){
    this.readOwn(req, res, ses)
  }
  async "GET /models/{id}"(req, res, ses){
    this.readOwn(req, res, ses)
  }
  readOwn(req, res, ses){
    // user can only see her own records
    let user = ses.user
    if(user && !user.roles.includes('admin')) {
        this.modifyQuery(req, [{
            action: "delete",
            args:['match.user']
        }, {
            action: "set",
            args: ['match.user', user.id]
        }])
    }
  }

  
}

module.exports = ModelsController