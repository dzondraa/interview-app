module.exports = {
    version:'v1',
    protocol:'http',
    host:'localhost',
    port:1337,
    website:'https://igniteevents.co',
    // if there is no admin account on the system, create this one
    noadmin:{
      login:'admin@ignite.co',
      password: 'ConfusedBirch|3',
      dateOfBirth:'1970-01-01',
      roles:['admin']
    },
    // Fortune.js built-in model
    model: {
      endpoint: {
        name: String,
        schema: String,
        created: Date,
        updated: Date
      },
      user: {
        login: String,
        password: Buffer,
        roles: Array(String),
        salt: Buffer,
        created: Date,
        updated: Date,
        fullName: String,
        firstName: String,
        lastName: String,
        middleName: String,
        dateOfBirth: Date,
        email: String,
        phoneNumber:String,
        onWhatsApp:Boolean,
        invitedBy:String,
        streetAddress:String,
        suiteNumber:String,
        city:String,
        zip:Number,
        country:String,
        instagramFollowersNumber:Number,
        instagramUsername:String,
        status: String,
        //files: Array('file')
        files: { link: 'file', isArray: true, inverse: 'owner' } // Has many.
      },
      file:{
        URL:String,
        ext:String,
        mime:String,
        nameId:String,
        attachId:String,
        modified:Date,
        created:Date,
        title:String,
        caption:String,
        latlon:String,
        location:String,
        description:String,
        url:String,
        name:String,
        body:String,
        subtitle:String,
        license:String,
        order:Number,
        owner: { link: 'user', isArray: false, inverse: 'files' }
      },
      login:{
        login: String,
        password: Buffer,
        token:String,
        created: Date,
        updated: Date,
        user: 'user'
      },
      events: {
        name: String,
        description: String,
        startLocation:String,
        endLocation:String,
        dateBegins:String,
        dateEnds:String
      },
      attendance: {
        invitedBy: String,
        event:'events',
        user:'user',
        maxGuests: Number,
        international: Boolean,
        includesTrip: Boolean,
        tripSubmitted: Boolean,
        guests: Array('file'),
        created: Date,
        updated: Date,
        nda:Boolean,
        termsAndConditions:Boolean,
        status: String // approved, denied, pending
      },
      models: {
        user: 'user',
        photos: Array('file'),
        unitOfMeasurement:String,
        height:Number,
        waist:Number,
        bust:Number,
        hips:Number,
        shoeSize:Number,
        hairColor:String,
        eyeColor:String,
        agencyManager:String,
        testShootDate:Date,
        canWorkInUSA:Boolean,
        testShootStatus: String, // approved, denied, pending
        status: String // approved, denied, pending
      },
      trips:{
        name: String,
        fullName: String,
        tripDate:Date,
        passportNumber:String,
        passportExpirationDate:Date,
        passportIssuingCountry:String,
        arrivingFlightPreferredAirport: String,
        arrivingFlightSecondaryAirport: String,
        departingFlightPreferredAirport: String,
        departingFlightSecondaryAirport: String,
        availableToDepartDate: Date,
        mustArriveByDate: Date,
        tsaPrecheckNumber: String,
        frequentFlyerNumbers: Array(String),
        frequentFlyerCompanies: Array(String),
        files: Array('file'),
        user: 'user',
        attendance: 'attendance',
        readyForReview: Boolean,
        refusedByUser: Boolean,
        //passangerType: String, // user, guest
        status: String // approved, denied, pending
      }
    },
    boot:{},
    server:null,
    store:null,
    // Fortune.js config
    storeConfig:{
      hooks:{},
      settings: {
        name: 'Ignite',
        description: 'Event management platform'
      },
      documentation:{}
    },
    // schemas for the built in model
    schema:{
      endpoint:{
        "title": "Endpoint",
        "name": "endpoint",
        "description": "Endpoint builder",
        "properties": {
          "name": {
            "title": "Name",
            "description": "Endpoint name",
            "type": "string"
          },
          "schema": {
            "title": "Schema",
            "description": "Endpoint schema",
            "type": "string"
          },
          "created": {
            "title": "Created",
            "description": "Creation date time",
            "type": "string",
            "format": "date-time"
          },
          "updated": {
            "title": "Updated",
            "description": "Updated date time",
            "type": "string",
            "format": "date-time"
          }
        },
        "type": "object",
        "required":["schema"]
      },
      user:{
        "title": "User",
        "name": "user",
        "description": "User endpoint",
        "access":{
          "create":{"roles":["admin", "anon"]},
          "update":{"roles":["admin","user"],"owner":true},
          "read":{"roles":["admin","user"],"owner":true},
          "delete":{"roles":["admin","user"],"owner":true},
          "attach":{"roles":["admin","user"],"owner":true}
        },
        "properties": {
          "login": {
            "title": "Login",
            "description": "Login handle, either user name or email",
            "type": "string",
            "format": "email"
          },
          "password": {
            "title": "Password",
            "type": "string"
          },
          "roles": {
            "title": "Roles",
            "description": "User roles",
            "type": "array"
          },
          "salt": {
            "title": "Salt",
            "type": "string"
          },
          "created": {
            "title": "Created",
            "description": "Creation date time",
            "type": "string",
            "format": "date-time"
          },
          "updated": {
            "title": "Updated",
            "description": "Updated date time",
            "type": "string",
            "format": "date-time"
          },
          "fullName": {
            "title": "Full name",
            "description": "Full Legal name",
            "type": "string"
          },
          "firstName": {
            "title": "First name",
            "description": "First name",
            "type": "string"
          },
          "middleName": {
            "title": "Middle name",
            "description": "Middle name",
            "type": "string"
          },
          "lastName": {
            "title": "Last name",
            "description": "Last name",
            "type": "string"
          },
          "dateOfBirth": {
            "title": "Date of birth",
            "description": "Date of birth",
            "type": "string",
            "format": "date"
          },
          "email": {
            "title": "Email",
            "description": "Email address",
            "type": "string",
            "format": "email"
          },
          "phoneNumber": {
            "title": "Phone number",
            "description": "Phonr number",
            "type": "string"
          },
          "onWhatsApp": {
            "title": "Are you on WhatsApp",
            "description": "Is user on WhatsApp using the provided phone number",
            "type": "boolean",
            "default":false
          },
          "invitedBy": {
            "title": "Who invited you to enroll?",
            "description": "Who invited you to fill this application form?",
            "type": "string"
          },
          "streetAddress": {
            "title": "Street address",
            "description": "Street number and name",
            "type": "string"
          },
          "suiteNumber": {
            "title": "Suite number",
            "description": "Appartment or suite number",
            "type": "string"
          },
          "city": {
            "title": "City",
            "description": "City of residence",
            "type": "string"
          },
          "zip": {
            "title": "Zip",
            "description": "Zip code",
            "type": "number"
          },
          "country": {
            "title": "Country",
            "description": "Country",
            "type": "string"
          },
          "instagramFollowersNumber": {
            "title": "Number of Instagram followers",
            "description": "How many Instagram followers do you have?",
            "type": "number"
          },
          "instagramUsername": {
            "title": "Instagram username",
            "description": "What is your instagram username / handle?",
            "type": "string"
          },
          "comment": {
            "title": "Comment",
            "description": "Why should you have access to this site",
            "type": "string"
          },
          "status": {
            "title": "User status",
            "description": "Status of the user account. Can be pending, approved and denied",
            "type": "string",
            "enum": ["approved", "denied", "pending"],
            "default": "pending"
          }
        },
        "type": "object",
        "required":["login", "password", "dateOfBirth"]
      },
      trips:{
        "title": "Trips",
        "name": "trips",
        "description": "Trip details",
        "access":{
          "create":{"roles":["admin", "user"]},
          "update":{"roles":["admin", "user"], "owner":true},
          "read":{"roles":["admin","user"], "owner":true},
          "delete":{"roles":["admin","user"], "owner":true}
        },
        "properties": {
          "name": {
            "title": "Trip name",
            "description": "Descriptive name for the trip",
            "type": "string"
          },
          "fullName": {
            "title": "Passanger full name",
            "description": "Passanger first and last name",
            "type": "string"
          }, 
          "tripDate": {
            "title": "Trip date",
            "description": "Estimated date for the trip",
            "type": "string",
            "format": "date"
          },
          "passportNumber": {
            "title": "Pasport number",
            "description": "Unique number of your passport",
            "type": "string"
          },
          "passportExpirationDate": {
            "title": "Pasport expiration date",
            "description": "Expiration date of your passport",
            "type": "string",
            "format":"date"
          },
          "passportIssuingCountry":{
            "title": "Pasport issuing country",
            "description": "Name of the country which issued your passport",
            "type": "string"
          },
          "arrivingFlightPreferredAirport":{
            "title": "Arrival airport",
            "description": "Name of the preffered airport for arrival",
            "type": "string"
          },
          "arrivingFlightSecondaryAirport":{
            "title": "Secondary arrival airport",
            "description": "Name of the secondary airport for arrival",
            "type": "string"
          },
          "departingFlightPreferredAirport":{
            "title": "Departing airport",
            "description": "Name of the preferred airport for departing",
            "type": "string"
          },
          "departingFlightSecondaryAirport":{
            "title": "Secondary departing airport",
            "description": "Name of the secondary airport for departing",
            "type": "string"
          },
          "availableToDepartDate":{
            "title": "Available to depart on date",
            "description": "Date and time when available to depart. If applicable",
            "type": "string",
            "format":"date-time"
          },
          "mustArriveByDate":{
            "title": "Must arrive by date and time",
            "description": "Date and time when user prefers to arrive. If applicable",
            "type": "string",
            "format":"date-time"
          }, 
          "tsaPrecheckNumber":{
            "title": "TSA precheck number",
            "description": "Transportation Security Administration precheck number",
            "type": "string"
          }, 
          "frequentFlyerNumbers":{
            "title": "Frequent flyer numbers",
            "description": "List of frequent flyer numbers for different airlines",
            "type": "array",
            "items": {
              "type": "string"
            }
          }, 
          "frequentFlyerCompanies":{
            "title": "Frequent flyer airlines",
            "description": "List of frequent flyer airlines",
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "files":{
            "type": "array",
            "description": "Array of file metadata objects",
            "attachment":true,
            "items": {
              "type": "string"
            }
          },
          "user": {
            "title": "User",
            "description": "User reference for trip",
            "type": "string"
          },
          "attendance": {
            "title": "Attendance",
            "description": "Attendance reference",
            "type": "string"
          },
          "readyForReview": {
            "title": "Ready for review",
            "description": "Is trip record ready to be reviewed",
            "type": "boolean",
            "default": false
          },
          "refusedByUser": {
            "title": "Refused by user",
            "description": "Is trip refused by user",
            "type": "boolean",
            "default": false
          },
          "status": {
            "title": "Trip status",
            "description": "Whether the trip is approved (tickets bought) or denied. Defaults to pending",
            "type": "string",
            "enum": ["approved", "denied", "pending"],
            "default": "pending"
          }
        },
        "type": "object",
       // "required":["passportNumber", "passportExpirationDate", "passportIssuingCountry"]
      },
      models: {
        "title": "Models",
        "name": "models",
        "description": "Model details",
        "access":{
          "create":{"roles":["admin", "user"]},
          "update":{"roles":["admin", "user"], "owner":true},
          "read":{"roles":["admin","user"], "owner":true},
          "delete":{"roles":["admin","user"], "owner":true}
        },
        "properties": {
          "user": {
            "title": "User",
            "description": "User reference for model",
            "type": "string"
          },
          "photos":{
            "type": "array",
            "description": "Array of file metadata objects",
            "attachment":true,
            "items": {
              "type": "string"
            }
          },
          "unitOfMeasurement": {
            "title": "Unit of measurement",
            "description": "Which measurement units do you prefer?",
            "type": "string",
            "enum":["imperial", "metric"]
          },
          "height": {
            "title": "Height",
            "description": "What is your height?",
            "type": "number"
          },
          "waist": {
            "title": "Waist",
            "description": "What is your waist circumference?",
            "type": "number"
          },
          "bust": {
            "title": "Bust",
            "description": "What is your bust circumference?",
            "type": "number"
          },
          "hips": {
            "title": "Hips",
            "description": "What is your hips circumference?",
            "type": "number"
          },
          "shoeSize": {
            "title": "Shoe size",
            "description": "What is shoe size?",
            "type": "number"
          },
          "hairColor": {
            "title": "Hair color",
            "description": "What is your hair color?",
            "type": "string",
            "enum": ["black", "brown", "blonde", "other"]
          },
          "eyeColor": {
            "title": "Eye color",
            "description": "What is your eye color?",
            "type": "string",
            "enum": ["black", "brown", "green", "blue", "other"]
          },
          "agencyManager": {
            "title": "Agency manager",
            "description": "What is the name of your agency manager if applicable",
            "type": "string"
          },
          "testShootDate": {
            "title": "Test photo shoot date",
            "description": "Your preferred date for a test photo shoot?",
            "type": "string",
            "format": "date"
          },
          "canWorkInUSA": {
            "title": "Allowed to work in USA",
            "description": "Legally allowed to work in the USA",
            "type": "boolean",
            "default": false
          },
          "testShootStatus": {
            "title": "Test shoot status",
            "description": "Status of the test shoot. Can be pending, approved and denied",
            "type": "string",
            "enum": ["approved", "denied", "pending"],
            "default": "pending"
          },
          "status": {
            "title": "Model status",
            "description": "Status of the user as model. Can be pending, approved and denied",
            "type": "string",
            "enum": ["approved", "denied", "pending"],
            "default": "pending"
          }
        },
        "type": "object",
        "required":["unitOfMeasurement", "height", "waist", "bust", "hips", "shoeSize", "hairColor", "eyeColor", "canWorkInUSA", "testShootDate"]
      },
      events: {
        "title": "Events",
        "name": "events",
        "description": "Event details",
        "access":{
          "create":{"roles":["admin"]},
          "update":{"roles":["admin"]},
          "read":{"roles":["admin","user"]},
          "delete":{"roles":["admin"]}
        },
        "properties": {
          "name": {
            "title": "Name",
            "description": "Name of the event",
            "type": "string"
          },
          "description": {
            "title": "Description",
            "description": "Event description",
            "type": "string"
          },
          "dateBegins": {
            "title": "Date begins",
            "description": "Date and time when event begins",
            "type": "string",
            "format": "date-time"
          },
          "dateEnds": {
            "title": "Date ends",
            "description": "Date and time when event ends",
            "type": "string",
            "format": "date-time"
          },
          "startLocation": {
            "title": "Start location",
            "description": "Start location of the event",
            "type": "string"
          },
          "endLocation": {
            "title": "End location",
            "description": "End location of the event",
            "type": "string"
          }
        },
        "type": "object",
        "required":["name", "startLocation", "dateBegins"]
      },
      attendance: {
        "title": "Attendance",
        "name": "attendance",
        "description": "Event attendance",
        "access":{
          "create":{"roles":["admin"]},
          "update":{"roles":["admin", "user"], "owner":true},
          "read":{"roles":["admin","user"], "owner":true},
          "delete":{"roles":["admin", "user"], "owner":true}
        },
        "properties": {
          "invitedBy": {
            "title": "Invited by",
            "description": "Name of the person who invited you to the event",
            "type": "string"
          },
          "event": {
            "title": "Event",
            "description": "Event to which this attendance refers to",
            "type": "string"
          }, 
          "user": {
            "title": "User",
            "description": "User who applies for attendance",
            "type": "string"
          },
          "maxGuests": {
            "title": "Maximum Guests",
            "description": "Number of guests user is eligible to bring along",
            "type": "number",
            "multipleOf": 1.0,
            "minimum": 0,
            "maximum": 10
          },
          "international": {
            "title": "International",
            "description": "Is invited guest outside US?",
            "type": "boolean",
            "default":false
          },
          "includesTrip": {
            "title": "Includes Trip",
            "description": "Is invited guest eligible for a trip?",
            "type": "boolean",
            "default":false
          },
          "guests":{
            "type": "array",
            "description": "Array of file metadata objects",
            "attachment":true,
            "items": {
              "type": "string"
            }
          },
          "created": {
            "title": "Created",
            "description": "Creation date time",
            "type": "string",
            "format": "date-time"
          },
          "updated": {
            "title": "Updated",
            "description": "Updated date time",
            "type": "string",
            "format": "date-time"
          },
          "status": {
            "title": "Attendance status",
            "description": "Status of this event attendance application. Can be pending, approved and denied",
            "type": "string",
            "enum": ["approved", "denied", "pending"],
            "default": "pending"
          },
          "nda": {
            "title": "Non disclosure agreement",
            "description": "Status of the acceptance for the non disclosure agreement.",
            "type": "boolean",
            "default": false
          },
          "termsAndConditions": {
            "title": "Terms and conditions",
            "description": "Status of the acceptance for the terms and conditions",
            "type": "boolean",
            "default": false
          },
          "tripSubmitted": {
            "title": "Trip submitted",
            "description": "Is trip record for this attendance created",
            "type": "boolean",
            "default": false
          }
        },
        "type": "object",
        "required":["event"]
      },
      login:{
        "title": "Login",
        "name": "login",
        "description": "Login endpoint",
        "access":{
          "create":{"roles":["admin", "user", "anon"]},
          "update":{"roles":["admin"]},
          "read":{"roles":["admin","user"], "owner":true},
          "delete":{"roles":["admin","user"], "owner":true}
        },
        "properties": {
          "login": {
            "title": "Login",
            "description": "User name or email",
            "type": "string"
          },
          "password": {
            "title": "Password",
            "type": "string"
          },
          "token": {
            "type": "string",
            "title": "token"
          },
          "created": {
            "title": "Created",
            "description": "Creation date time",
            "type": "string",
            "format": "date-time"
          },
          "updated": {
            "title": "Updated",
            "description": "Updated date time",
            "type": "string",
            "format": "date-time"
          }
        },
        "type": "object",
        "required":["login", "password"]
      },
      file:{
          "title": "Files",
          "name": "file",
          "description": "File attachment metadata",
          "access":{
            "create":{"roles":["admin", "user"]},
            "update":{"roles":["admin", "user"],"owner":false},
            "read":{"roles":["admin", "user"],"owner":false},
            "delete":{"roles":["admin", "user"],"owner":false}
          },
          "properties": {
            "URL": {
              "title": "File url",
              "description": "File url",
              "type": "string"
            },
            "ext": {
              "title": "File extension",
              "description": "File extension",
              "type": "string"
            },
            "mime": {
              "title": "File mime type",
              "description": "File mime type",
              "type": "string"
            },
            "nameId": {
              "title": "File name",
              "description": "File name",
              "type": "string"
            },
            "attachId": {
              "title": "File attachment id",
              "description": "File attachment id",
              "type": "string"
            },
            "updated": {
              "title": "Modified date",
              "description": "Modified date",
              "type": "string",
              "format":"date-time"
            },
            "created": {
              "title": "Updated date",
              "description": "Updated date",
              "type": "string",
              "format":"date-time"
            }
          },
          "type": "object"
      }
    },
    attachments:{
        path: __dirname + '/../attachments'
    },
    AWS:{
      profile:"ignite",
      templateDir: __dirname + '/../templates',
      fromName:"Ignite Events",
      fromEmail:"hello@igniteevents.co",
      SESApiVersion:"2010-12-01",
      SESRegion:"us-west-2"
    }
  }

  // URL:String,
  // ext:String,
  // mime:String,
  // nameId:String,
  // attachId:String,
  // modified:Date,
  // created:Date,
  // owner:'user'