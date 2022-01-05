/**
 * Base controller provides input and output hooks aswel as general helper methods
 */
const { URL } = require('url');
const fs = require('fs')
const fortune = require('fortune')
//const fortuneHTTP = require('fortune-http')
const schematofortune = require(__dirname+'/schematofortune.js')
const session = require(__dirname+'/session.js')
const Ajv = require('ajv');
const querystring = require('querystring');
const constants = require('constants');
const router = require(__dirname+'/router.js')
const attachments = require(__dirname+'/attachments.js')

var _api = {}, _instances = {}
class Controller {

  constructor(api){
    this.ajv = new Ajv()
    this.ajv.addFormat('buffer', /.+/)

    this.api = api
  }

  session(context, roles){
    return this.api.session(context, roles)
  }

  roles(req, roles){
    return session.roles(req, roles)
  }

  input(modelName){
    var inst = this;
    return function(context, record, update){
      context.request.modelName = modelName
      return inst.session(context).then((session)=>{
        // validate input on create and update
        if(context.request.method == 'create' || context.request.method == 'update'){
          var errors = null
          if(update && update.replace){
            let urecord = { ...record, ...update.replace }
            errors = inst.getErrors(modelName, urecord)
          }else{
            errors = inst.getErrors(modelName, record)
          }
          if(errors) {
            var emsg = 'Property ' + errors[0].dataPath +' '+ errors[0].message+'. '
            if(errors[0].params) {
              if(errors[0].params.allowedValues){
                emsg += 'Allowed values: '+errors[0].params.allowedValues.join(', ')+'. '
              }
            }
            var e = new Error(emsg)
            e.name = 'BadRequestError'
            e.errors = errors
            throw e
          }
        }

        // set the owner on create
        var owner = null
        if(session){
          if(context.request.method == 'create'){
            record.__owner = session.user.id || null
            owner = record.__owner
          }else{
            owner = modelName == "user" ? record.id : record.__owner
            //delete record.__owner
            if(update && update.replace){
              delete update.replace.__owner
            }
          }
        }


        // dispatch method
        var args = Array.from(arguments);
        args.push(session)
        let execInput = function(iarg){
          if(iarg){
            context.request.otherArgs = Array.from(arguments)
            args = args.concat(context.request.otherArgs)
          }
          switch (context.request.method) {
            case 'create':
              try{
                return inst.inputCreate ? inst.inputCreate.apply(inst, args) : record
              }catch(err){
                console.error(err)
                return record
              }
              
            case 'update':
              return inst.inputUpdate ? inst.inputUpdate.apply(inst, args) : update
            case 'delete':
              return inst.inputDelete ? inst.inputDelete.apply(inst, args) : null
            case 'find':
              return inst.inputFind ? inst.inputFind.apply(inst, args) : record
          }
        }

        // owner access
        if(session && session.user && session.user.roles.indexOf('admin') == -1){
          let crud = context.request.method == 'find' ? 'read' : context.request.method
          let schema = Controller.api.schema[modelName]
          let access = schema && schema.access ? schema.access : null
          if(owner && access && access[crud] && access[crud].owner === true){
            if(session.user.id != owner){
              var er = new Error("Access Forbidden")
              er.name = 'ForbiddenError'
              throw er
            }
          }
        }

        return inst.___request.apply(inst, args).then(execInput)
      })
    }
  }


  output(modelName){
    var inst = this;
    return function(context, record){
      context.request.modelName = modelName
      var owner = modelName == "user" ? record.id : record.__owner
      //delete record.__owner

      return inst.session(context).then((session)=>{
        // dispatch method
        var args = Array.from(arguments);
        args.push(session)
        let execOutput = function(reqArg){
          if(reqArg){
            context.request.otherArgs = Array.from(arguments)
            args = args.concat(context.request.otherArgs)
          }
          switch (context.request.method) {
            case 'create':
              return inst.outputCreate ? inst.outputCreate.apply(inst, args) : record
            case 'update':
              return inst.outputUpdate ? inst.outputUpdate.apply(inst, args) : record
            case 'find':
              return inst.outputFind ? inst.outputFind.apply(inst, args) : record
            case 'delete':
              return inst.outputDelete ? inst.outputDelete.apply(inst, args) : null
          }
        }

        // owner access
        if(session && session.user && session.user.roles.indexOf('admin') == -1){
          let crud = context.request.method == 'find' ? 'read' : context.request.method
          let schema = Controller.api.schema[modelName]
          let access = schema && schema.access ? schema.access : null
          if(owner && access && access[crud] && access[crud].owner === true){
            if(session.user.id != owner){
              var er = new Error("Access Forbidden")
              er.name = 'ForbiddenError'
              throw er
            }
          }
        }

        return inst.___request.apply(inst, args).then(execOutput)
      })
    }
  }

  getErrors(modelName, record){
    if(!this.api.validators) this.api.validators = {}
    let schema = this.api.schema[modelName]
    if(!this.api.validators[modelName]){
      this.api.validators[modelName] = this.ajv.compile(schema);
    }

    // don't validate null and convert fortune.js parsed record to correct one for json schema validation
    let nrec = {}
    for(var i in record){
      if(record[i] != null){
        if(record[i] instanceof Buffer){
          nrec[i] = record[i].toString('utf8')
        }else if(schema.properties[i] && (schema.properties[i].format == 'date' || schema.properties[i].format == 'date-time')){
          let vval = (record[i] instanceof Date) ? record[i].toISOString() : record[i]
          if(schema.properties[i] && schema.properties[i].format == 'date'){
            vval = vval.split('T')[0]
          }
          nrec[i] = vval
        }else if(schema.properties[i] && schema.properties[i].type == 'array'){
          nrec[i] = record[i]
        }else{
          nrec[i] = record[i]
        }
      }
    }
    var valid = this.api.validators[modelName](nrec);
    if(!valid){
      return this.api.validators[modelName].errors
    }
    return false
  }

  exec(req, res, session){
    return router.route(this, req, res, session)
  }

  ___request(){
    const { Promise } = this.api.store.adapter
    if(this.request){
      return this.request.apply(this, arguments)
    }else{
      return Promise.resolve()
    }
  }

  static makeHooks(model, version, hooksRef){
    var hooks = hooksRef || {}
    for(var modelName in model){
      // check if there is controller for the model, if not use the base controller
      var controllerPath = __dirname+'/../controllers/'+version+'/'+modelName+'.js', ctrl;
      try{
        let ctrl = require(controllerPath)
        Controller.instances[modelName] = new ctrl(Controller.api);
      } catch(err){
        if(err.code === 'MODULE_NOT_FOUND'){
          controllerPath = __dirname+'/../controllers/'+version+'/default.js'
          try{
            let ctrl = require(controllerPath)
            Controller.instances[modelName] = new ctrl(Controller.api);
          } catch(err){
            if(err.code === 'MODULE_NOT_FOUND'){
              Controller.instances[modelName] = new Controller(Controller.api)
            }else{
              throw err
            }
          }
        }else{
          throw err
        }
      }
      hooks[modelName] = [Controller.instances[modelName].input(modelName), Controller.instances[modelName].output(modelName)]
    }
    return hooks
  }

  static augmentControllers(model){
    for(var modelName in model){
      let schema = Controller.api.schema[modelName]
      let ctrl = Controller.instances[modelName]
      for(let fname in schema.properties){
        // attachments
        if(schema.properties[fname].attachment){
          // add attachment methods
          console.log('Adding Method:', `POST /${modelName}/{id}/${fname}/attachment`)
          ctrl[`POST /${modelName}/{id}/${fname}/attachment`] = (req, res, ses)=>{
            // schema and attachment field
            let modelName = req.modelName
            let schema = this.api.schema[modelName]
            if(!schema) return Promise.resolve({status: 400, body:{message:"Model does not exist"}})
            let fieldName = req.urlParsed.pathname.split('/')[3]
            let field = schema.properties[fieldName]
            if(!field || !field.attachment) return Promise.resolve({status: 400, body:{message:"Attachment field is not defined"}})
            // access
            let isAdmin = ses.user.roles.includes('admin')
            if(!isAdmin){
              let access = schema.access.attach || {"roles":["admin","user"]}
              if(!access.roles.find((el) => ses.user.roles.includes(el))) {
                return Promise.resolve({status: 403, body:{message:"Access denied"}})
              }
            }
            let userId = ses.user.id
            if(req.query.user){
              if(!isAdmin) return Promise.resolve({status: 403, body:{message:"Access denied"}})
              userId = req.query.user
            }
            // attachment
            return attachments.create(req, res, ses, this.api, modelName, fieldName, userId)
          }

          ctrl[`GET /${modelName}/{id}/${fname}/attachment/{fileId}`] = async (req, res, ses)=>{
            // schema and attachment field
            let modelName = req.modelName
            let schema = this.api.schema[modelName]
            if(!schema) return Promise.resolve({status: 400, body:{message:"Model does not exist"}})
            //let fieldName = req.pathname.path.split('/')[3]
            let fieldName = req.urlParsed.pathname.split('/')[3]
            let field = schema.properties[fieldName]
            if(!field || !field.attachment) return Promise.resolve({status: 400, body:{message:"Attachment field is not defined"}})
            // access
            let isAdmin = ses.user.roles.includes('admin')
            let access = null
            if(!isAdmin){
              access = schema.access.attach || {"roles":["admin","user"], "owner":true}
              if(!access.roles.find((el) => ses.user.roles.includes(el))) {
                return Promise.resolve({status: 403, body:{message:"Access denied"}})
              }
            }
            let file = null
            try{
              let resp = await this.api.store.find("file", [req.params.fileId])
              file = resp.payload.records[0]
            }catch(err){
              return { status:400, body: {status:400, message:err.message}}
            } 
            if(!isAdmin && access.owner && file.owner != ses.user.id) return {status:403, body:{message:"Access forbidden"}}
            req.fileInfo = file
            return attachments.read(req, res, ses, this.api, modelName)
          }

          ctrl[`DELETE /${modelName}/{id}/${fname}/attachment/{fileId}`] = async (req, res, ses)=>{
            // schema and attachment field
            let modelName = req.modelName
            let schema = this.api.schema[modelName]
            if(!schema) return Promise.resolve({status: 400, body:{message:"Model does not exist"}})
            let fieldName = req.urlParsed.pathname.split('/')[3]
            let field = schema.properties[fieldName]
            if(!field || !field.attachment) return Promise.resolve({status: 400, body:{message:"Attachment field is not defined"}})
            // access
            let isAdmin = ses.user.roles.includes('admin')
            let access = null
            if(!isAdmin){
              access = schema.access.attach || {"roles":["admin","user"], "owner":true}
              if(!access.roles.find((el) => ses.user.roles.includes(el))) {
                return Promise.resolve({status: 403, body:{message:"Access denied"}})
              }
            }
            let file = null
            try{
              let resp = await this.api.store.find("file", [req.params.fileId])
              file = resp.payload.records[0]
            }catch(err){
              return { status:400, body: {status:400, message:err.message}}
            } 
            if(!isAdmin && access.owner && file.owner != ses.user.id) return {status:403, body:{message:"Access forbidden"}}
            req.fileInfo = file
            return attachments.delete(req, res, ses, this.api, modelName)
          }
        }
      }
    }
  }

  // static props
  static get api() { return _api; }
  static get instances() { return _instances; }

  // initialize store, controllers and session
  static initialize() {
    Controller.makeHooks(Controller.api.model, Controller.api.version, Controller.api.storeConfig.hooks)
    Controller.api.store = fortune(Controller.api.model, Controller.api.storeConfig)
    Controller.api.session = session(Controller.api)
    Controller.augmentControllers(Controller.api.model)
  }

  // initialize with endpoints configs from storage
  static initializeWith(endpoints) {
    endpoints = Array.isArray(endpoints) ? endpoints : [endpoints]
    var schemas = []
    for (var i = 0; i < endpoints.length; i++) {
      var schema = Controller.updateEndpoint(endpoints[i])
      if (schema) {
        schemas.push(schema)
      }
    }

    Controller.initialize()
    return schemas
  }

  static updateEndpoint(endpoint) {
    var schema = null
    try {
      schema = JSON.parse(endpoint.schema)
    } catch (err) {
      console.log('updateEndpoint: ', err)
    }
    if (schema && schema.name) {
      if (!endpoint.name) endpoint.name = schema.name

      // schema
      Controller.api.schema[endpoint.name] = schema

      // convert JSON schema to Fortune schema and settings
      var newFortune = schematofortune(schema)

      // set the internal owner property
      newFortune.model.__owner = {
        link: 'user',
        isArray: false
      }

      // add new model
      if (Controller.api.model[schema.name]) {
        Controller.modify(Controller.api.model[schema.name], newFortune.model)
      } else {
        Controller.api.model[schema.name] = newFortune.model
      }

      // merge documentation
      var d = Controller.api.storeConfig.documentation || {}
      for (var i in newFortune.documentation) {
        d[i] = newFortune.documentation[i]
      }
    }
    return schema
  }

  static modify(obj, newObj) {
    Object.keys(obj).forEach(function(key) {
      delete obj[key];
    });
    Object.keys(newObj).forEach(function(key) {
      obj[key] = newObj[key];
    });
    // make sure __owner is there
    if(obj && obj.model) {
      for(var m in obj.model){
        if(!obj.model[m].__owner) obj.model[m].__owner = {
          link: 'user',
          isArray: false
        }
      }
    }
  }

  static listener(req, res, next) {
    req.urlParsed = new URL(req.url, [Controller.api.protocol, '://', req.headers.host].join('')) // url.parse(req.url)  
    req.query = querystring.parse(req.urlParsed.search.substr(1))
    req.modelName = req.urlParsed.pathname.split('/')[1].toLowerCase()
    // get session if avail
    return session.raw(Controller.api.store, req).then((session) => {
      req.session = session

      // roles access
      if(req.modelName && Controller.api.schema[req.modelName] && Controller.api.schema[req.modelName].access){
        let crud = Controller.getCRUDFromRequest(req)
        let access = Controller.api.schema[req.modelName].access
        if(access[crud] && access[crud].roles){
          if(session && session.user && session.user.roles.indexOf('admin') == -1 && !access[crud].roles.find((el) => session.user.roles.includes(el))) {
            var er = new Error("Access Forbidden")
            er.name = 'ForbiddenError'
            throw er
          }
        }
      }

      if(req.modelName && Controller.instances[req.modelName] && Controller.instances[req.modelName].exec){
        return Controller.instances[req.modelName].exec(req, res, session).then((resp)=>{
          if(resp && resp.body) {
            res.writeHead(resp.status || 200, resp.headers || null)
            res.end(typeof resp.body == 'object' ? JSON.stringify(resp.body, null, 2) : resp.body)
          }else{
            return next(req, res)
          }
        }).catch(Controller.handleError(req, res, next))
      }else{
        return next(req, res)
      }
    }).catch(Controller.handleError(req, res, next))
  }

  static getCRUDFromRequest(req) {
    switch(req.method){
      case 'GET':
        return 'read'
      case 'POST':
        if(req.url.indexOf('/attachment') != -1) return 'attach'
        return 'create'
      case 'PATCH':
      case 'PUT':
        return 'update'
      case 'DELETE':
        return 'delete'
    }
  }

  // error handling
  static handleError(req, res, next) {
    return (error) => {
      if(res.headersSent) {
        return null // return console.error('Headers already sent:', error.message)
      }
      let statusCodeMap = {
        'ForbiddenError':403,
        'BadRequestError':400,
        'UnauthorizedError':401,
        'NotFoundError':404,
        'MethodError':405,
        'NotAcceptableError':406,
        'ConflictError':409,
        'UnsupportedError':415,
        'UnprocessableError':422
      }
      res.statusCode = statusCodeMap[error.name] ? statusCodeMap[error.name] : 400;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Powered-By', 'lederata');
      res.write(JSON.stringify({
        name:error.name,
        message:error.message
      }, null, 2));
      res.end();
      Controller.logError(error)
    }
  }

  static boot(api) {
    // creates boot instance of fortune then load all endpoints from database then loads main instance
    Controller.modify(Controller.api, api)
    Controller.api.bootModel = Controller.copyModel(Controller.api.model)  //Object.assign({}, Controller.api.model);
    Controller.api.bootStore = fortune(Controller.api.bootModel, Controller.api.storeConfig)
    return Controller.api.bootStore.connect().then(() => {
      return Controller.api.bootStore.find('endpoint').then((results)=>{
        if(results.payload && results.payload.records && results.payload.records.count > 0){
          Controller.initializeWith(results.payload.records)
        }else{
          Controller.initialize()
        }
      })
    })
  }

  static copyModel(o){
    var output, v, key, inst = this;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
       v = o[key];
       output[key] = (typeof v === "object") ? inst.copyModel(v) : v;
    }
    return output;
  }

  // error logging
  static logError(error) {
    console.error('Logger:', error)
  }

  requestBody(req) {
    return new Promise((resolve, reject)=>{
      let body = '';
      req.on('data', chunk => {
          body += chunk.toString(); // convert Buffer to string
      });
      req.on('error', reject);
      req.on('end', () => {
          resolve(body)
          //res.end();
      });
    })
  }

  parseBody(req){
    return this.requestBody(req).then((body)=>{
      var contentType = req.headers['content-type']
      if(contentType){
        contentType = contentType.split(';')[0]
        if(contentType == 'application/json'){
          return Promise.resolve(JSON.parse(body))
        }else if(contentType == 'application/x-www-form-urlencoded'){
          return Promise.resolve(querystring.parse(body))
        }else{
          var pbody = ''
          try{
            pbody = JSON.parse(body)
          }catch(err){
            pbody = body
          }
          return Promise.resolve(pbody)
        }
      }else{
        return Promise.resolve(body)
      }
    }).catch(err=>{
      return Promise.reject(err)
    })
  }

  hasRoles(roles, ses){
    return roles.find((el) => ses.user.roles.includes(el))
  }

  reqToOptions(req){
    let options = {}
    req.urlParsed.searchParams.forEach((value, name) => {
      if(!isNaN(value)) value = parseFloat(value)
      if(value == 'true') value = true
      if(value == 'false') value = false
      let pts = name.split('.')
      if(pts.length == 1){
        options[name] && Array.isArray(options[name]) ? options[name].push(value) : ( options[name] ? options[name] = [options[name], value] : options[name] = value)
      }else if(pts.length == 2){
        if(!options[pts[0]]) options[pts[0]] = {}
        let opt = options[pts[0]], n = pts[1]
        opt[n] && Array.isArray(opt[n]) ? opt[n].push(value) :  opt[n] ? opt[n] = [opt[n], value] : opt[n] = value
      }
    });
    return options
  }

  static getSSLOptions(){
    let config = Controller.api
    // Set SSL certificates
    var options;
    var getCABundle = function(path) {
      var ca, cert, chain, i, len, line;
      ca = [];
      try {
        chain = fs.readFileSync(path, certType);
      } catch (err) {
        return null;
      }
      chain = chain.split("\n");
      cert = [];
      for (i = 0, len = chain.length; i < len; i++) {
        line = chain[i];
        if (!(line.length !== 0)) {
          continue;
        }
        cert.push(line);
        if (line.match(/-END CERTIFICATE-/)) {
          ca.push(cert.join("\n"));
          cert = [];
        }
      }
      return ca;
    };
    // try to get ssl certs, if that fails use the built in self signed
    var caBundle = getCABundle(config.ssl.ca),
      ckey, cert, isSelfSigned = false;
    try {
      ckey = fs.readFileSync(config.ssl.key, certType);
      cert = fs.readFileSync(config.ssl.cert, certType);
    } catch (err) {
      ckey = fs.readFileSync(config.selfsignedssl.key, certType);
      cert = fs.readFileSync(config.selfsignedssl.cert, certType);
      isSelfSigned = true;
    }
    if (isSelfSigned) {
      options = {
        key: ckey,
        cert: cert
      };
    } else {
      options = {
        // - SSLv2, SSLv3, TLSv1, TLSv1.1 and TLSv1.2
        "secureProtocol": 'SSLv23_method',
        // Supply `SSL_OP_NO_SSLv3` constant as secureOption to disable SSLv3. (constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2 disable v2 as well)
        "secureOptions": constants.SSL_OP_NO_SSLv3,
        // enable only these cyphers (From latest node: https://github.com/nodejs/node/blob/master/doc/api/tls.markdown)
        "ciphers": [
          'ECDHE-RSA-AES128-GCM-SHA256',
          'ECDHE-ECDSA-AES128-GCM-SHA256',
          'ECDHE-RSA-AES256-GCM-SHA384',
          'ECDHE-ECDSA-AES256-GCM-SHA384',
          'DHE-RSA-AES128-GCM-SHA256',
          'ECDHE-RSA-AES128-SHA256',
          'DHE-RSA-AES128-SHA256',
          'ECDHE-RSA-AES256-SHA384',
          'DHE-RSA-AES256-SHA384',
          'ECDHE-RSA-AES256-SHA256',
          'DHE-RSA-AES256-SHA256',
          'HIGH',
          '!aNULL',
          '!eNULL',
          '!EXPORT',
          '!DES',
          '!RC4',
          '!MD5',
          '!PSK',
          '!SRP',
          '!CAMELLIA'
        ].join(':'),
        honorCipherOrder: true,
        ca: caBundle,
        key: ckey,
        cert: cert
      };
    }
    return options
  }

  filterFields(record, fields, type) {
    if(type == 'update'){
      fields.forEach(f => {
        if(record.replace && record.replace[f] != undefined) delete record.replace[f]
        if(record.push && record.push[f] != undefined) delete record.push[f]
        if(record.pull && record.pull[f] != undefined) delete record.pull[f]
      })
    }else{
      fields.forEach(f => delete record[f])
    }
  }

  modifyQuery(req, cmds=[]){
    cmds.forEach(c => {
      req.urlParsed.searchParams[c.action].apply(req.urlParsed.searchParams, c.args)
    })
    req.url = req.urlParsed.pathname + req.urlParsed.search
  }
}

module.exports = Controller
