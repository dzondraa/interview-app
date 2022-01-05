const DefaultController = require('./default.js')
const email = require('../../lib/email.js')

/**
 * Trips are created by user if she is invited to an event and eligible for travel
 * Attendance is checked for includesTrip 
 */

class TripsController extends DefaultController {

  async inputCreate(context, record, session){

    let user = session.user
    let isAdmin = (session && session.user && session.user.roles.includes("admin")) || context.request.meta.nofilter

    if(!record.attendance) return Promise.reject(new Error("Please supply attendace reference for this trip"))

    if(isAdmin && !record.user) return Promise.reject(new Error("User field is missing"))
    if(!isAdmin && !record.user) record.user = user.id
    record.__owner = record.user

    if(!record.status) record.status = 'pending'
    if(!record.refusedByUser) record.refusedByUser = false
    if(!record.readyForReview) record.readyForReview = false

    // get attendance
    let attendance = null
    try{
      const options = {
        fields:{id:true, includesTrip:true, event:true, user:true, maxGuests:true}
      }
      let result = await this.api.store.find('attendance', [record.attendance], options, null, {nofilter:true})
      attendance = result.payload.records[0]
      if(!attendance) return Promise.reject(new Error("Attendance not found"))
    }catch(err){
      return Promise.reject(err)
    }

    if(attendance.user != record.user) return Promise.reject(new Error("Invalid attendance"))
    if(!attendance.includesTrip) return Promise.reject(new Error("User is not eligible for the trip"))

    // get existing trips
    let trips = null
    try{
      const options = {
        match:{
          user: attendance.user,
          event: attendance.event 
        },
        fields:{id:true}
      }
      let result = await this.api.store.find('trips', null, options, null, {nofilter:true})
      trips = result.payload.records
    }catch(err){
      return Promise.reject(err)
    }
    
    if(trips && trips.length > 0) return Promise.reject(new Error("Trip is already created."))
    if(!record.fullName) record.fullName = user.fullName

    return record
  }

  async outputCreate(context, record, session){
    console.log('OUTPUT CREATE', record)
    await this.api.store.update('attendance', {
      id: record.attendance,
      replace:{
        tripSubmitted: true
      }
    }, {nofilter:true})
    return record
  }
  async outputDelete(context, record, session){
    console.log('OUTPUT DELETE', record)
    await this.api.store.update('attendance', {
      id: record.attendance,
      replace:{
        tripSubmitted: false
      }
    }, {nofilter:true})
    
    return record
  }
  

  inputUpdate(context, record, update, session){
    let isAdmin = context.request.meta.nofilter || session.user.roles.includes("admin") ? true : false
    let required = ["passportNumber", "passportExpirationDate", "passportIssuingCountry"]
    if(!isAdmin) {
        this.filterFields(update, ['user', 'name', 'status', 'attendance', 'passangerType'], 'update')
    } 
    for(let i=0;i<required.length; i++) if(!update.replace[required[i]]) return Promise.reject(new Error("Field "+required[i]+" is missing"))

    let pexp = new Date(update.replace.passportExpirationDate)
    let now = new Date();
    if(pexp < now){
        return Promise.reject("Date field passportExpirationDate is in the past")
    }
    if(!update.replace) update.replace = {}
    update.replace.created = new Date(record.created)
    update.replace.updated = new Date()

    if(update.replace.status && record.status != update.replace.status){
        context.request.meta.statusChanged = {status: record.status}
    }

    return update
  }

  async outputUpdate(context, record, session){
    if(context.request.meta.statusChanged){
        // notify user about trip status change
        if(!this.emailSender) this.emailSender = new email(this.api)
        
        let trip = record

        // fetch user
        let uresp = await this.api.store.find('user', [trip.user], null, null, {nofilter:true})
        let user = uresp.payload.records[0]
        if(!user) return Promise.reject("User for this trip does not exist")

        // fetch attendance
        let aresp = await this.api.store.find('attendance', [trip.attendance], null, null, {nofilter:true})
        let attendance = aresp.payload.records[0]
        if(!attendance) return Promise.reject("Attendance for this trip does not exist")

        // fetch event
        let eresp = await this.api.store.find('events', [attendance.event], null, null, {nofilter:true})
        let event = eresp.payload.records[0]
        if(!event) return Promise.reject("Event for this trip does not exist")

        this.emailSender.userTripStatusChange(user, event, attendance, trip, (err, resp) => {
          if(err) return console.error('Email not sent', err)
          console.log('Email sent', resp)
        })
    }
    return record
  }

  async "GET /trips"(req, res, ses){
    this.readOwn(req, res, ses)
  }
  async "GET /trips/{id}"(req, res, ses){
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

module.exports = TripsController