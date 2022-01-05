const Controller = require('../../lib/controller.js')
const helpers = require('../../lib/helpers.js')

class LoginController extends Controller {

  inputCreate(context, record){
    const options = {
      match:{
        login: record.login
      }
    }
    return this.api.store.find('user', null, options, null, {nofilter:true}).then((result) => {
      var user = result.payload.records[0]
      if(!user) throw new Error("Invalid user")
      if (!helpers.validatePassword(record.password, user.password, user.salt)) throw new Error("Invalid password")
      delete record.password
      record.user = user.id
      record.created = new Date()
      record.token = helpers.generateToken()
      return record
    })
  }

  outputCreate(context, record){
    if(!record) return null
    delete record.password
    delete record.salt
    return record
  }
}

module.exports = LoginController
