const Controller = require('../../lib/controller.js')
const email = require('../../lib/email.js')

class InviteController extends Controller {
  async "POST /invite"(req, res, session){
    
    let isAdmin = session.user.roles.includes('admin')
    if(!isAdmin) return {status:403, body:{message:"Access Forbidden"}}
    let json = await this.parseBody(req)

    if(!json.email || !json.email.trim()) return {status:400, body:{message:"Missing email"}}
    if(!json.subject || !json.subject.trim()) return {status:400, body:{message:"Missing subject"}}
    if(!json.body || !json.body.trim()) return {status:400, body:{message:"Missing email body"}}

    if(!this.emailSender) this.emailSender = new email(this.api)
    return new Promise((resolve, reject)=>{
        this.emailSender.inviteUserToSite(json.email, json.subject, json.body, (err, resp)=>{
            if(err) return reject(err)
            return resolve({status:200, body:{message:"Invitation sent!", success:true}})
        })
    })
  }
}

module.exports = InviteController
