const DefaultController = require('./default.js')

/**
 * Events represents an event to which users can be invited
 * Admin creates events, then invites users by creating attendance records
 */

class EventsController extends DefaultController {
    inputCreate(context, record, session){
        // admin
        let isAdmin = context.request.meta.nofilter || session.user.roles.includes("admin") ? true : false
        if(!isAdmin) return Promise.reject(new Error("Access Denied"))

        record.created = new Date()
        record.updated = new Date()

        return record
    }
    
    inputUpdate(context, record, update, session){
        // user cannot change event once set. Also cannot set user or status
        let isAdmin = context.request.meta.nofilter || session.user.roles.includes("admin") ? true : false
        if(!isAdmin) return Promise.reject(new Error("Access Denied"))
        if(!update.replace) update.replace = {}
        update.replace.created = new Date(record.created)
        update.replace.updated = new Date()
        return update
    }

    
}

module.exports = EventsController