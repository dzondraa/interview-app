var crypto = require('crypto');
var Handlebars = require('handlebars')
var mailcomposer = require('mailcomposer');
var AWS = require('aws-sdk');
var fs = require('fs');

var email = function (config) {
	var inst = this
	inst.config = config

	var credentials = new AWS.SharedIniFileCredentials({
		profile: inst.config.AWS.profile
	});
	AWS.config.credentials = credentials;

	this.inviteUserToSite = function (email, subject, desc, cb) {
		let template = 'email_template.html'

		let data = {
			title: subject,
			description: desc
		}

		let attachments = this.getstandardAttachments()

		this.getEmailBody([this.config.AWS.templateDir, template].join('/'), data, (err, html) => {
			if (err) return console.error('Email not created', err)
			let fromEmail = this.config.AWS.fromEmail
			this.sendEmail(fromEmail, [email], subject, html, attachments, cb)
		})
	}

	this.userTripStatusChange = function (user, event, attendance, trip, cb) {
		let template = 'email_template.html'

		let desc = `Dear ${user.fullName}, status of your trip to ${event.name} has been changed to ${trip.status}. 
			${trip.status == 'approved' ? `
				Yor ticket have been paid for and ready. 
				${trip.tripDate ? 'Flight is on ' + new Date(trip.availableToDepartDate).toDateString() + '. ' : ''}
				${trip.arrivingFlightPreferredAirport ? 'From airport ' + trip.arrivingFlightPreferredAirport + '. ' : ''}
				${trip.mustArriveByDate ? 'Departing flight is on ' + new Date(trip.mustArriveByDate).toDateString() + '. ' : ''}
				${trip.mustArriveByDate ? 'From airport ' + new Date(trip.departingFlightPreferredAirport).toDateString() + '. ' : ''}
			` : ''}
			${trip.status == 'denied' ? `
				Yor trip has been denied.
			` : ''}
			${trip.status == 'pending' ? `
				Yor trip status is pending, please stay tuned for details. We will notify you when status changes.
			` : ''}
			Check your trip details by logging to ${this.config.website + '/access'}
		`

		let data = {
			title: `Status of your trip has changed to ${trip.status}`,
			description: desc,
			user: user,
			event: event,
			attendance: attendance,
			trip:trip
		}

		let attachments = this.getstandardAttachments()

		this.getEmailBody([this.config.AWS.templateDir, template].join('/'), data, (err, html) => {
			if (err) return console.error('Email not created', err)
			let fromEmail = this.config.AWS.fromEmail
			this.sendEmail(fromEmail, [user.email], "Ignite Events - Status of your trip has changed", html, attachments, cb)
		})
	}

	this.userEventInvitation = function (user, event, attendance, cb) {
		let template = 'email_template.html'

		let desc = `Dear ${user.fullName}, you are invited to attend ${event.name}. 
		${event.description ? event.description + '. ' : ''} 
		${event.startLocation ? 'At '+event.startLocation : ''} on ${event.dateBegins ? new Date(event.dateBegins).toDateString() + '. ' : ''} 
		${event.endLocation ? 'Ends at '+event.endLocation : ''} on ${event.dateEnds ? new Date(event.dateEnds).toDateString() + '. ' : ''} 
		${attendance.maxGuests ? `You can bring ${attendance.maxGuests} guests. `:''}
		${attendance.includesTrip ? `Your trip will be paid by Ignite. `:''}
		`
		if (attendance.status == 'pending') {
			desc += `You can now login to ${this.config.website + '/access'} and approve or deny the invitation.`
		} else {
			return
		}

		let data = {
			title: `You are invited to Ignite event`,
			description: desc,
			user: user,
			event: event,
			attendance: attendance
		}

		let attachments = this.getstandardAttachments()

		this.getEmailBody([this.config.AWS.templateDir, template].join('/'), data, (err, html) => {
			if (err) return console.error('Email not created', err)
			let fromEmail = this.config.AWS.fromEmail
			this.sendEmail(fromEmail, [user.email], "Ignite - You are invited to event ", html, attachments, cb)
		})
	}

	this.userStatusChange = function (user, cb) {

		let template = 'email_template.html'

		let desc = `Dear ${user.fullName}, your account status has been changed to ${user.status}. `
		if (user.status == 'approved') {
			desc += `You can now login to ${this.config.website + '/access'} and check for pending events. 
	  		You are now eligible for Ignite events attendance.`
		} else if (user.status == 'denied') {
			desc += `You will be notified of any eventual changes to your status.`
		} else if (user.status == 'pending') {
			desc += `You will be notified of any eventual changes to your status.`
		}

		let data = {
			title: `Your Ignite Girls account status has been changed to ${user.status}`,
			description: desc,
			user: user
		}

		let attachments = this.getstandardAttachments()

		this.getEmailBody([this.config.AWS.templateDir, template].join('/'), data, (err, html) => {
			if (err) return console.error('Email not created', err)
			let fromEmail = this.config.AWS.fromEmail
			this.sendEmail(fromEmail, [user.email], "Ignite - Your account status has been changed to " + user.status, html, attachments, cb)
		})
	}

	inst.getstandardAttachments = function(){
		return [{
			'path': this.config.AWS.templateDir + '/img/footer_background.png',
			'cid': 'footer_background'
		}, {
			'path': this.config.AWS.templateDir + '/img/facebook.png',
			'cid': 'facebook'
		}, {
			'path': this.config.AWS.templateDir + '/img/instagram.png',
			'cid': 'instagram'
		}, {
			'path': this.config.AWS.templateDir + '/img/twitter.png',
			'cid': 'twitter'
		}, {
			'path': this.config.AWS.templateDir + '/img/logo_footer.png',
			'cid': 'logo_footer'
		}, {
			'path': this.config.AWS.templateDir + '/img/logo_header.png',
			'cid': 'logo_header'
		}];
	}

	/**
	 * Returns email html body given a template and template data.
	 * Uses Handlebars template engine, caches the compiled template
	 * @param  {String}   templateFile Path to template file
	 * @param  {Object}   templateData Object map containing key-value pairs used in the template
	 * @param  {Function} cb           callback looks like: function(error, htmlString){}
	 * @return {null}
	 */
	inst.getEmailBody = function (templateFile, templateData, cb) {
		var inst = this
		var templateKey = crypto.createHash('sha256').update(templateFile).digest('hex');
		if (!inst[templateKey]) {
			fs.readFile(templateFile, {
				encoding: 'utf-8'
			}, function (err, templateSrc) {
				if (err) {
					return cb(err);
				}
				inst[templateKey] = Handlebars.compile(templateSrc);
				var html = inst[templateKey](templateData);
				cb(null, html)
			});
		} else {
			var html = inst[templateKey](templateData);
			cb(null, html)
		}
	}

	/**
	 * Sends a html email using Amazon SES
	 * Supports attachments with "cid" option, multiple recipients
	 * @param  {String}   from        From email
	 * @param  {Array}   toArray      Array of strings each containing a destination email address
	 * @param  {String}   subject     Email subject
	 * @param  {String}   html        Html string which is email body
	 * @param  {Array}   attachments  Array of attachment objects looking like this: [{path:'path/to/attachment.png', cid:'myImage'}]
	 * @param  {Function} cb          Callback looks like: function(error, response){}
	 * @return {null}
	 */
	inst.sendEmail = function (from, toArray, subject, html, attachments, cb) {
		var inst = this;
		// load AWS SES
		var ses = new AWS.SES({
			apiVersion: inst.config.AWS.SESApiVersion,
			'region': inst.config.AWS.SESRegion
		}); // eu-west-1 (Ireland), us-west-2 (Oregon)
		var mail = mailcomposer({
			'from': inst.config.AWS.fromName + ' <' + from + '>',
			'to': toArray.join(','),
			'sender': from,
			'subject': subject,
			'html': html,
			'attachments': attachments
		});
		mail.build(function (err, message) {
			if (err) {
				cb(err);
				return;
			}
			var params = {
				RawMessage: {
					Data: message
				},
				Destinations: toArray
			};
			ses.sendRawEmail(params, function (err, data) {
				cb(err, data);
			});
		});
	}
}

module.exports = email
