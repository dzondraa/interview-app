const Controller = require('../../lib/controller.js')
const helpers = require('../../lib/helpers.js')
const email = require('../../lib/email.js')

let attachments = null
try{
  attachments = require('../../lib/attachments.js')
}catch(err){
  console.log('Attachments error', err)
}


class UserController extends Controller {

  constructor(api){
    super(api)

    this.filter = ["id", "email", "password", "roles", "fullName", "firstName", "lastName", "middleName", "dateOfBirth", 
    "phoneNumber", "onWhatsApp", "invitedBy", "streetAddress", "suiteNumber", "city", "zip", 
    "country", "instagramFollowersNumber", "instagramUsername", "comment", "testShootDate", "unitOfMeasurement",
    "height", "waist", "bust", "hips", "shoeSize", "hairColor", "eyeColor", "agencyManager",
    "passportExpirationDate", "passportNumber", "passportIssuingCountry", "files", "status"]
  }

  async inputCreate(context, record, session){
    record.created = new Date()

    let isAdmin = (session && session.user && session.user.roles.includes("admin")) || context.request.meta.nofilter

    // login is email
    if(record.login) record.email = record.login

    // default roles
    if(!isAdmin) record.roles = ["user"]
    if(!isAdmin) record.status = "pending"

    // check if user exists
    try{
      let result = await this.api.store.find("user", null, {
        "match":{
          "login": record.login
        },
        "fields": {id:true}
      })
      if(result.payload.count) throw Error("User already exists")
    }catch(err) {
      throw err
    }

    if(record.status == 'approved'){
      context.request.meta.statusChanged = {status:record.status}
    }

    return Object.assign(record, helpers.makePassword(record.password))
  }

  inputUpdate(context, record, update, session){
    let isAdmin = context.request.meta.nofilter || session.user.roles.includes("admin") ? true : false
    if(!isAdmin) {
      // restrict what can be updated
      this.filterFields(update, ['login', 'email', 'status', 'roles', 'salt', 'created', 'updated'], 'update')
    }
    if(!update.replace) update.replace = {}
    const { replace: { password } } = update
    update.replace.dateOfBirth = new Date(update.replace.dateOfBirth || record.dateOfBirth)
    update.replace.created = new Date(record.created)
    update.replace.updated = new Date()

    if (password) Object.assign(update.replace, helpers.makePassword(password))
    if(update.replace.status && record.status != update.replace.status){
      context.request.meta.statusChanged = {status:record.status}
    }

    if(update.replace.email && !update.replace.login){
      update.replace.login = update.replace.email
    }else if(update.replace.login && !update.replace.email){
      update.replace.email = update.replace.login
    }

    return update
  }

  async "GET /user/uninvited"(req, res, ses){
    let isAdmin = ses.user.roles.includes("admin")
    if(!isAdmin) return {status:403, body:{message:"Access Forbidden"}}
    try{

      // get attendance related search params and remove from url
      let search = req.urlParsed.searchParams
      let options = {match:{}, fields:{"user":true}, limit:1000, offset:0}
      let attendanceMatch = ['invitedBy', 'maxGuests', 'international', 'includesTrip', 'international', 'event', 'user']
      attendanceMatch.forEach(m => {
        let name = 'match.'+m
        let match = search.getAll(name)
        if(match && match.length){
          options.match[m] = match
          search.delete(name)
        } 
      })
      let resp = await this.api.store.find('attendance', null, options, null)

      // exclude matched users
      let excludeUsers = []
      if(resp.payload && resp.payload.count > 0) {
        resp.payload.records.forEach(r => excludeUsers.push('NOT-'+r.user))
      }

      // parse request into fortunejs options
      let userOpts = this.reqToOptions(req)
      if(userOpts.match){
        delete userOpts.match.event
        delete userOpts.match.user
      }
      if(!userOpts.exists) userOpts.exists = {}
      userOpts.exists.login = true // to force the search as opposed to _mget by id

      let users = await this.api.store.find('user', excludeUsers, userOpts, null)

      // users.opts = userOpts
      // users.aopts = options
      return {body:users}
    }catch(err) {
      return {status:400, body:err}
    }
  }

  async "GET /user/{id}"(req, res, ses){
    this.meShorthand(req, res, ses)
  }

  meShorthand(req, res, ses){
    // use "me" keyword as reference to currently logged in user
    if(ses.user && ses.user.id && req.params.id == "me") {
      req.url = "/user/" + ses.user.id
    }
  }

  outputFind(context, record, session) {
    return this.filterOutput(context, record, session)
  }
  outputCreate(context, record, session) {
    // if status set to approved, notify user
    if(context.request.meta.statusChanged){
      if(!this.emailSender) this.emailSender = new email(this.api)
      this.emailSender.userStatusChange(record, (err, resp)=>{
        if(err) return console.error('Email not sent', err)
        console.log('Email sent', resp)
      })
    }
    return this.filterOutput(context, record, session)
  }
  outputUpdate(context, record, session) {
    // if status changed, notify user
    if(context.request.meta.statusChanged){
      //let oldStatus = context.request.meta.statusChanged.status
      if(!this.emailSender) this.emailSender = new email(this.api)
      this.emailSender.userStatusChange(record, (err, resp)=>{
        if(err) return console.error('Email not sent', err)
        console.log('Email sent', resp)
      })
    }
    return this.filterOutput(context, record, session)
  }

  filterOutput(context, record, session){
    // limit what non admins can see
    let isAdmin = (session && session.user && session.user.roles.includes("admin")) ? true : false
    if(!isAdmin && !context.request.meta.nofilter) {
      let filtered = {}
      let fields = this.filter.filter(field => !["password"].includes(field) );
      fields.forEach( prop => {
        if(record[prop] != undefined) filtered[prop] = record[prop]
      })
      record = filtered
    }
    return record
  }

  "POST /user/attachment"(req, res, ses){
    if(!ses || !ses.user || !ses.user.id) return Promise.resolve({ status:400, body: {status:400, message:"User not specified"}})
    if(!req.params) req.params = {}
    if(!req.params.id) req.params.id = ses.user.id
    return attachments.create(req, res, ses, this.api, "user")
  }

  "POST /user/attachment/{id}"(req, res, ses){
    if(!ses || !ses.user || !ses.user.id || !req.params || !req.params.id) return Promise.resolve({ status:400, body: {status:400, message:"User not specified"}})
    if(!req.params) req.params = {}
    if(req.params.id != ses.user.id){
      // check if this is admin
      let isAdmin = (ses.user.roles && ses.user.roles.includes("admin"))
      if(!isAdmin) return Promise.resolve({ status:400, body: {status:403, message:"Access forbidden"}})
    }
    return attachments.create(req, res, ses, this.api, "user")
  }

  async "GET /user/attachment/{id}"(req, res, ses){
    // admin can see all attachments, user only her own, anon none
    if(!ses || !ses.user || !ses.user.id) return Promise.resolve({ status:400, body: {status:400, message:"User not specified"}})
    let isAdmin = ses.user.roles.includes("admin")
    try{
      let resp = await this.api.store.find("file", [req.params.id])
      if(!resp.payload.records.length) return { status:404, body: {status:404, message:"Attachment not found"}}
      let file = resp.payload.records[0]
      if(!isAdmin && file.owner != ses.user.id) return {status:403, body:{message:"Forbidden"}}
      req.fileInfo = file
      return attachments.read(req, res, ses, this.api, "user")
    }catch(err){
      return { status:400, body: {status:400, message:err.message}}
    } 
  }

  async "DELETE /user/attachment/{id}"(req, res, ses){
    if(!ses || !ses.user || !ses.user.id) return Promise.resolve({ status:400, body: {status:400, message:"User not specified"}})
    let isAdmin = ses.user.roles.includes("admin")
    try{
      let resp = await this.api.store.find("file", [req.params.id])
      if(!resp.payload.records.length) return { status:404, body: {status:404, message:"Attachment not found"}}
      let file = resp.payload.records[0]
      if(!isAdmin && file.owner != ses.user.id) return {status:403, body:{message:"Forbidden"}}
      req.fileInfo = file
      return attachments.delete(req, res, ses, this.api, "user")
    }catch(err){
      return { status:400, body: {status:400, message:err.message}}
    } 
  }
}

module.exports = UserController
