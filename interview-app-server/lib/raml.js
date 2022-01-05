
class RamlMaker {

  constructor(api){
    this.api = api
  }

  getRaml(v){
    v = v || '1.0'
    return this.ramlHeader(v) + this.ramlSchemas(v) + this.ramlBody(v)
  }

  spacer(n) {
    var spacer = "  "
    if (n) {
      var ret = ""
      for (var i = 0; i < n; i++) {
        ret += spacer
      }
      return ret
    }
    return spacer

  }

  ramlHeader(v) {
    let settings = this.api.storeConfig.settings

    // raml version diffs
    let is08 = (v == '0.8')
    let m1 = is08 ? `
---
` : ''
    let m2 = is08 ? '' : "\n" + 'description: ' + settings.description


    let header = `#%RAML `+v+m1+`
title: ` + settings.name + m2 + `
version: ` + this.api.version + `
baseUri: ` + this.api.protocol + `://` + this.api.host + (this.api.port == 80 ? '' : ':' + this.api.port) + `
#List of media type to support
mediaType:  application/json
#List of protocols to support for baseUri
protocols: [ ` + this.api.protocol.toUpperCase() + ` ]
`
    return header
  }

  ramlSchemas(v) {

    // raml version diffs
    let is08 = (v == '0.8')
    let m1 = is08 ? '- ' : ''
    let s1 = is08 ? 3 : 2
    let t1 = is08 ? 'schemas':'types'

    var schemas = t1 + ':' + "\n"
    schemas += this.spacer() + m1 + 'generic_error: |' + "\n"
    var gerror = {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Error name"
        },
        "message": {
          "type": "string",
          "description": "Message describing the error"
        }
      },
      "required": [
        "name", "message"
      ]
    }
    schemas += this.spacedJson(gerror, this.spacer(s1)) + "\n"

    var schemaArray = {
      "type": "object",
      "properties": {
        "records": {
          "type": "array",
          "description": "Array of records",
          "items": {
            "type": "object"
          }
        },
        "count": {
          "type": "integer",
          "description": "Records count"
        }
      },
      "required": [
        "records", "count"
      ]
    }

    var schemaPatch = {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "description": "Record identifier"
        },
        "replace": {
          "type": "object",
          "description": "Parts of the record to replace"
        }
      },
      "required": [
        "id", "replace"
      ]
    }

    this.allSchemas = {generic_error:gerror}

    for (var name in this.api.schema) {
      // schema
      schemas += this.spacer() + m1 + name + ': |' + "\n"
      schemas += this.spacedJson(this.api.schema[name], this.spacer(s1)) + "\n"
      this.allSchemas[name] = this.api.schema[name]

      // schema array
      schemas += this.spacer() + m1 + name + '_array: |' + "\n"
      schemaArray.properties.records.items = this.api.schema[name]
      schemas += this.spacedJson(schemaArray, this.spacer(s1)) + "\n"
      this.allSchemas[name+'_array'] = JSON.parse(JSON.stringify(schemaArray))


      // schema patch
      schemas += this.spacer() + m1 + name + '_patch: |' + "\n"
      schemaPatch.properties.replace.properties = this.api.schema[name].properties
      schemas += this.spacedJson(schemaPatch, this.spacer(s1)) + "\n"
      this.allSchemas[name+'_patch'] = JSON.parse(JSON.stringify(schemaPatch))
    }
    return schemas
  }

  spacedJson(obj, spacer) {
    var lines = JSON.stringify(obj, null, 2).split("\n");
    lines.forEach((ln, i, li) => li[i] = spacer + ln);
    return lines.join("\n")
  }

  ramlBody(v) {

    // raml version diffs
    // let is08 = (v == '0.8')
    // let m1 = is08 ? '' : ''


    var body = ''
    for (var name in this.api.schema) {
      body += '/' + name + ':' + "\n"
      let schema = this.api.schema[name]

      //body += this.spacer() + 'title: '+(schema.title || name)+"\n"
      body += this.spacer() + 'description: ' + (schema.title + '. ' || '') + (schema.description || 'CRUD for ' + name + ' endpoint') + "\n"

      // find
      body += this.spacer() + 'get: ' + "\n"
      body += this.spacer(2) + 'description: Find records of ' + name + ' type.' + "\n"
      body += this.spacer(2) + 'responses:' + "\n"
      body += this.spacer(3) + '200:' + "\n"
      body += this.spacer(4) + 'body:' + "\n"
      body += this.spacer(5) + 'schema: ' + name + "_array\n"
      body += this.spacer(5) + 'example: '+this.generateExample(this.allSchemas[name+'_array'], true, 5)+"\n"
      body += this.spacer(3) + '400:' + "\n"
      body += this.spacer(4) + 'body:' + "\n"
      body += this.spacer(5) + 'schema: generic_error' + "\n"
      body += this.spacer(5) + 'example: '+this.generateExample(this.allSchemas['generic_error'], true, 5)+"\n"


      // create
      body += this.spacer() + 'post: ' + "\n"
      body += this.spacer(2) + 'description: Create a record of ' + name + ' type.' + "\n"
      body += this.spacer(2) + 'body:' + "\n"
      body += this.spacer(3) + 'schema: ' + name + "\n"
      body += this.spacer(3) + 'example: '+this.generateExample(this.allSchemas[name], true, 3)+"\n"
      body += this.spacer(2) + 'responses:' + "\n"
      body += this.spacer(3) + '200:' + "\n"
      body += this.spacer(4) + 'body:' + "\n"
      body += this.spacer(5) + 'schema: ' + name + "\n"
      body += this.spacer(5) + 'example: '+this.generateExample(this.allSchemas[name], true, 5)+"\n"
      body += this.spacer(3) + '400:' + "\n"
      body += this.spacer(4) + 'body:' + "\n"
      body += this.spacer(5) + 'schema: generic_error' + "\n"
      body += this.spacer(5) + 'example: '+this.generateExample(this.allSchemas['generic_error'], true, 5)+"\n"

      // update
      body += this.spacer() + 'patch: ' + "\n"
      body += this.spacer(2) + 'description: Partially update a record of ' + name + ' type.' + "\n"
      body += this.spacer(2) + 'body:' + "\n"
      body += this.spacer(3) + 'schema: ' + name + "_patch\n"
      body += this.spacer(3) + 'example: '+this.generateExample(this.allSchemas[name+'_patch'], true, 3)+"\n"
      body += this.spacer(2) + 'responses:' + "\n"
      body += this.spacer(3) + '200:' + "\n"
      body += this.spacer(4) + 'body:' + "\n"
      body += this.spacer(5) + 'schema: ' + name + "\n"
      body += this.spacer(5) + 'example: '+this.generateExample(this.allSchemas[name], true, 5)+"\n"
      body += this.spacer(3) + '400:' + "\n"
      body += this.spacer(4) + 'body:' + "\n"
      body += this.spacer(5) + 'schema: generic_error' + "\n"
      body += this.spacer(5) + 'example: '+this.generateExample(this.allSchemas['generic_error'], true, 5)+"\n"

      body += this.spacer() + '/{id}: ' + "\n"

      // find by id
      body += this.spacer(2) + 'get: ' + "\n"
      body += this.spacer(3) + 'description: Find a single record of ' + name + ' type.' + "\n"
      body += this.spacer(3) + 'responses:' + "\n"
      body += this.spacer(4) + '200:' + "\n"
      body += this.spacer(5) + 'body:' + "\n"
      body += this.spacer(6) + 'schema: ' + name + "_array\n"
      body += this.spacer(6) + 'example: '+this.generateExample(this.allSchemas[name+'_array'], true, 6)+"\n"
      body += this.spacer(4) + '400:' + "\n"
      body += this.spacer(5) + 'body:' + "\n"
      body += this.spacer(6) + 'schema: generic_error' + "\n"
      body += this.spacer(6) + 'example: '+this.generateExample(this.allSchemas['generic_error'], true, 6)+"\n"


      // delete
      body += this.spacer(2) + 'delete: ' + "\n"
      body += this.spacer(3) + 'description: Delete a record of ' + name + ' type.' + "\n"
      body += this.spacer(3) + 'responses:' + "\n"
      body += this.spacer(4) + '200:' + "\n"
      body += this.spacer(5) + 'body:' + "\n"
      body += this.spacer(6) + 'schema: ' + name + "\n"
      body += this.spacer(6) + 'example: '+this.generateExample(this.allSchemas[name], true, 6)+"\n"
      body += this.spacer(4) + '400:' + "\n"
      body += this.spacer(5) + 'body:' + "\n"
      body += this.spacer(6) + 'schema: generic_error' + "\n"
      body += this.spacer(6) + 'example: '+this.generateExample(this.allSchemas['generic_error'], true, 6)+"\n"

      //if(schema.properties.files){
        

      if(name == 'user'){
          body += this.spacer(1) + '/attachment: ' + "\n"
          body += this.spacer(2) + 'post: ' + "\n"
          body += this.spacer(3) + 'description: Create attachment for currently logged in user' + "\n"
          body += this.spacer(3) + 'body:' + "\n"
          body += this.spacer(4) + 'example: "...binary data..."'+"\n"
          body += this.spacer(3) + 'responses:' + "\n"
          body += this.spacer(4) + '200:' + "\n"
          body += this.spacer(5) + 'body:' + "\n"
          body += this.spacer(6) + 'example: '+this.generateExample(this.allSchemas['files'], true, 5)+"\n"
          body += this.spacer(4) + '400:' + "\n"
          body += this.spacer(5) + 'body:' + "\n"
          body += this.spacer(6) + 'schema: generic_error' + "\n"
          body += this.spacer(6) + 'example: '+this.generateExample(this.allSchemas['generic_error'], true, 7)+"\n"

          body += this.spacer(1) + '/attachment/{id}: ' + "\n"
          
          body += this.spacer(2) + 'get: ' + "\n"
          body += this.spacer(3) + 'description: Download attachment from ' + name + ' record.' + "\n"
          body += this.spacer(3) + 'responses:' + "\n"
          body += this.spacer(4) + '200:' + "\n"
          body += this.spacer(5) + 'body:' + "\n"
          body += this.spacer(6) + 'example: "...binary data..."'+"\n"
          body += this.spacer(4) + '400:' + "\n"
          body += this.spacer(5) + 'body:' + "\n"
          body += this.spacer(6) + 'schema: generic_error' + "\n"
          body += this.spacer(6) + 'example: '+this.generateExample(this.allSchemas['generic_error'], true, 7)+"\n"

          body += this.spacer(2) + 'post: ' + "\n"
          body += this.spacer(3) + 'description: Create attachment for ' + name + ' record.' + "\n"
          body += this.spacer(3) + 'body:' + "\n"
          body += this.spacer(4) + 'example: "...binary data..."'+"\n"
          body += this.spacer(3) + 'responses:' + "\n"
          body += this.spacer(4) + '200:' + "\n"
          body += this.spacer(5) + 'body:' + "\n"
          body += this.spacer(6) + 'example: '+this.generateExample(this.allSchemas['files'], true, 5)+"\n"
          body += this.spacer(4) + '400:' + "\n"
          body += this.spacer(5) + 'body:' + "\n"
          body += this.spacer(6) + 'schema: generic_error' + "\n"
          body += this.spacer(6) + 'example: '+this.generateExample(this.allSchemas['generic_error'], true, 7)+"\n"

          body += this.spacer(2) + 'delete: ' + "\n"
          body += this.spacer(3) + 'description: Delete attachment from ' + name + ' record.' + "\n"
          body += this.spacer(3) + 'responses:' + "\n"
          body += this.spacer(4) + '200:' + "\n"
          body += this.spacer(5) + 'body:' + "\n"
          body += this.spacer(6) + 'example: '+this.generateExample({properties:{status:{type:'number'}}}, true, 6)+"\n"
          body += this.spacer(4) + '400:' + "\n"
          body += this.spacer(5) + 'body:' + "\n"
          body += this.spacer(6) + 'schema: generic_error' + "\n"
          body += this.spacer(6) + 'example: '+this.generateExample(this.allSchemas['generic_error'], true, 7)+"\n"


          // GET /user/uninvited
          body += this.spacer(1) + '/uninvited: ' + "\n"
          body += this.spacer(2) + 'get: ' + "\n"
          body += this.spacer(3) + 'description: Find users not invited to an event. Can be filtered by event with match.event=EVENT_ID query.' + "\n"
          body += this.spacer(3) + 'responses:' + "\n"
          body += this.spacer(4) + '200:' + "\n"
          body += this.spacer(5) + 'body:' + "\n"
          body += this.spacer(6) + 'example: '+this.generateExample(this.allSchemas[name+'_array'], true, 6)+"\n"
          body += this.spacer(4) + '400:' + "\n"
          body += this.spacer(5) + 'body:' + "\n"
          body += this.spacer(6) + 'schema: generic_error' + "\n"
          body += this.spacer(6) + 'example: '+this.generateExample(this.allSchemas['generic_error'], true, 7)+"\n"

      }

      for(var fname in schema.properties){
        let prop = schema.properties[fname]
        if(prop.attachment){
          body += this.spacer(1) + '/{id}/' + fname + '/attachment: ' + "\n"
          body += this.spacer(2) + 'post: ' + "\n"
          body += this.spacer(3) + 'queryParameters:' + "\n"
          body += this.spacer(4) + 'user:' + "\n"
          body += this.spacer(5) + 'displayName: user' + "\n"
          body += this.spacer(5) + 'type: string' + "\n"
          body += this.spacer(5) + 'description: User id to assign the attachment. Admin only.' + "\n"
          body += this.spacer(5) + 'example: 1234' + "\n"
          body += this.spacer(5) + 'required: false' + "\n"
          body += this.spacer(3) + 'description: Create '+ fname +' attachment for '+ name + "\n"
          body += this.spacer(3) + 'body:' + "\n"
          body += this.spacer(4) + 'example: "...binary data..."'+"\n"
          body += this.spacer(3) + 'responses:' + "\n"
          body += this.spacer(4) + '200:' + "\n"
          body += this.spacer(5) + 'body:' + "\n"
          body += this.spacer(6) + 'example: '+this.generateExample(this.allSchemas['files'], true, 5)+"\n"
          body += this.spacer(4) + '400:' + "\n"
          body += this.spacer(5) + 'body:' + "\n"
          body += this.spacer(6) + 'schema: generic_error' + "\n"
          body += this.spacer(6) + 'example: '+this.generateExample(this.allSchemas['generic_error'], true, 7)+"\n"

          body += this.spacer(1) + '/{id}/' + fname + '/attachment/{fileId}: ' + "\n"

          body += this.spacer(2) + 'get: ' + "\n"
          body += this.spacer(3) + 'description: Download ' + fname + ' attachment from ' + name + ' record.' + "\n"
          body += this.spacer(3) + 'responses:' + "\n"
          body += this.spacer(4) + '200:' + "\n"
          body += this.spacer(5) + 'body:' + "\n"
          body += this.spacer(6) + 'example: "...binary data..."'+"\n"
          body += this.spacer(4) + '400:' + "\n"
          body += this.spacer(5) + 'body:' + "\n"
          body += this.spacer(6) + 'schema: generic_error' + "\n"
          body += this.spacer(6) + 'example: '+this.generateExample(this.allSchemas['generic_error'], true, 7)+"\n"

          body += this.spacer(2) + 'delete: ' + "\n"
          body += this.spacer(3) + 'description: Delete '+ fname +' attachment from ' + name + ' record.' + "\n"
          body += this.spacer(3) + 'responses:' + "\n"
          body += this.spacer(4) + '200:' + "\n"
          body += this.spacer(5) + 'body:' + "\n"
          body += this.spacer(6) + 'example: '+this.generateExample({properties:{status:{type:'number'}}}, true, 6)+"\n"
          body += this.spacer(4) + '400:' + "\n"
          body += this.spacer(5) + 'body:' + "\n"
          body += this.spacer(6) + 'schema: generic_error' + "\n"
          body += this.spacer(6) + 'example: '+this.generateExample(this.allSchemas['generic_error'], true, 7)+"\n"
        }
      }
        


       
      //}

    }

    // custom endpoints
    // POST /invite
    body += '/invite: ' + "\n"
    body += this.spacer() + 'description: ' + 'Inviting users. Admin only' + "\n"
    body += this.spacer() + 'post: ' + "\n"
    body += this.spacer(2) + 'description: Invite users by sending them email.' + "\n"
    body += this.spacer(2) + 'body:' + "\n"
    body += this.spacer(3) + 'example: ' + " |\n" + this.spacedJson({"email":"foo@bar.com", "subject":"I invite you", "body":"Lorem ipsum dolor"}, this.spacer(4)) +"\n"
    body += this.spacer(2) + 'responses:' + "\n"
    body += this.spacer(3) + '200:' + "\n"
    body += this.spacer(4) + 'body:' + "\n"
    body += this.spacer(5) + 'example: ' + " |\n" + this.spacedJson({"message":"Invitation sent!", "success":true}, this.spacer(6)) +"\n"
    body += this.spacer(3) + '400:' + "\n"
    body += this.spacer(4) + 'body:' + "\n"
    body += this.spacer(5) + 'schema: generic_error' + "\n"
    body += this.spacer(5) + 'example: ' + this.generateExample(this.allSchemas['generic_error'], true, 7)+"\n"

    return body
  }

  generateExample(schema, isString, spacer) {
    if(!schema){return null}
    spacer = spacer || 0
    var e = {}, arr, s = schema.properties || schema
    for (var name in s) {
      let p = s[name]
      // myArray[Math.floor(Math.random() * myArray.length)];
      switch (p.type) {
        case "number":
          arr = p.enum ? p.enum : [1.3, 2, 3.4, 4.0, 5.5, 6, 7, 8.1, 9, 0]
          e[name] = arr[Math.floor(Math.random() * arr.length)]
          break;
        case "integer":
          arr = p.enum ? p.enum : [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
          e[name] = arr[Math.floor(Math.random() * arr.length)]
          break;
        case "boolean":
          arr = [true, false]
          e[name] = arr[Math.floor(Math.random() * arr.length)]
          break;
        case "array":
          e[name] = [this.generateExample(p.items)]
          break;
        case "object":
          e[name] = this.generateExample(p)
          break;
        case "string":
          arr = p.enum ? p.enum : ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(''))
          if(p.enum){
            e[name] = arr[Math.floor(Math.random() * arr.length)]
          }else if(p.format && p.format.indexOf('date') != -1){
            e[name] = new Date().toISOString()
          }else{
            let wlens = [2, 3, 4, 5, 6, 7]
            let slens = [4, 5, 6, 7, 8]
            let slen = slens[Math.floor(Math.random() * slens.length)]
            var str = []
            for (var i=0; i<slen; i++) {
              let wlen = wlens[Math.floor(Math.random() * wlens.length)]
              for (var j=0; j<wlen; j++) {
                str.push(arr[Math.floor(Math.random() * arr.length)])
              }
              str.push(' ')
            }
            e[name] = str.join('').trim()
          }
          break;
      }
    }
    if(isString){
      return " |\n"+this.spacedJson(e, this.spacer(spacer + 1))
    }else{
      return e
    }
  }
}

module.exports = RamlMaker
