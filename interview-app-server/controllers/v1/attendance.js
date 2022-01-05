const DefaultController = require('./default.js')
const email = require('../../lib/email.js')

/**
 * Event Attendance represents both guest invitation to an event and guests event data
 * 
 * Admin creates attendance records by supplying event reference, user to invite reference as well as data such as
 * maximum number of guests user is allowed to bring, are they eligible for a paid trip and is guest international.
 * 
 * After the attendance record is created, email invitation is sent to user and she is now able to fill in rest of the record
 * which includes: guest names and their photos and name of the person who invited her
 * 
 * If admin allowed paid trip, user can also create a trip record for each guest.
 */

class AttendanceController extends DefaultController {
    inputCreate(context, record, session){
        let user = session.user
        
        // assign user as currently logged in user
        let isAdmin = context.request.meta.nofilter || session.user.roles.includes("admin") ? true : false
        if(!isAdmin) return Promise.reject(new Error("Access Denied"))
        
        if(!record.status) record.status = 'pending' // default status if not admin

        let userId = isAdmin && record.user ? record.user : user.id

        record.tripSubmitted = false

        // check if attendance has already been requested
        const options = {
            match:{
                event: record.event,
                user: userId
            },
            fields:{id:true}
        }
        return this.api.store.find('attendance', null, options, null, {nofilter:true}).then((result) => {
            var attendance = result.payload.records[0]
            if(attendance) return Promise.reject(new Error("User is already invited."))
            record.user = userId
            record.created = new Date()
            record.updated = new Date()
            record.__owner = record.user

            if(record.status == 'pending'){
              context.request.meta.statusChanged = {status:record.status}
            }

            return record
        })
      }

      async outputCreate(context, record, session){
        let s = context.request.meta.statusChanged
        try{
          if(s && s.status == 'pending'){
            // email invitation to user
            if(!this.emailSender) this.emailSender = new email(this.api)

            // fetch user and event
            let uresp = await this.api.store.find('user', [record.user], null, null, {nofilter:true})
            let user = uresp.payload.records[0]
            let eresp = await this.api.store.find('events', [record.event], null, null, {nofilter:true})
            let event = eresp.payload.records[0]

            this.emailSender.userEventInvitation(user, event, record, (err, resp) => {
              if(err) return console.error('Email not sent', err)
              console.log('Email sent', resp)
            })
          }
          return record
        }catch(err) {
          return Error("Could not email user. "+err)
        }
      }
    
      inputUpdate(context, record, update, session){
        if(!session) session = {user:{roles:['anon']}}
        // user cannot change event once set. Also cannot set user. User can set status to approved or denied
        let isAdmin = context.request.meta.nofilter || session.user.roles.includes("admin") ? true : false
        if(!isAdmin) this.filterFields(update, ['user', 'event', 'created', 'updated', 'maxGuests', 'international', 'includesTrip'], 'update') 
        if(!update.replace) update.replace = {}
        update.replace.created = new Date(record.created)
        update.replace.updated = new Date()
        return update
      }

      outputFind(context, record, session){
        //console.log('rec', record, 'ses', session)
        return record
      }

      async "GET /attendance"(req, res, ses){
        this.readOwn(req, res, ses)
      }
      async "GET /attendance/{id}"(req, res, ses){
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

module.exports = AttendanceController