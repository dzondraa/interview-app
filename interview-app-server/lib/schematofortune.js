
var Ajv = require('ajv');
var ajv = null, validate = null

/**
 * Validate JSON schema with meta schema (draft-07) and then convert it to Fortune.js model record type
 * @param  {Object} schema Object or string of json schema
 * @return {Object}        Fortune.js record type and documentation
 */
function schematofortune(schema){

  if(typeof schema == 'string'){
    try{
      schema = JSON.parse(schema)
    }catch(err){
      throw err
    }
  }

  if(!ajv || !validate){
    ajv = new Ajv(); // options can be passed, e.g. {allErrors: true} or { serialize: transpileFunc }
    ajv.addFormat('buffer', /.+/)
    let metaSchema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "http://json-schema.org/draft-07/schema#",
        "title": "Core schema meta-schema",
        "definitions": {
            "schemaArray": {
                "type": "array",
                "minItems": 1,
                "items": { "$ref": "#" }
            },
            "nonNegativeInteger": {
                "type": "integer",
                "minimum": 0
            },
            "nonNegativeIntegerDefault0": {
                "allOf": [
                    { "$ref": "#/definitions/nonNegativeInteger" },
                    { "default": 0 }
                ]
            },
            "simpleTypes": {
                "enum": [
                    "array",
                    "boolean",
                    "integer",
                    "null",
                    "number",
                    "object",
                    "string"
                ]
            },
            "stringArray": {
                "type": "array",
                "items": { "type": "string" },
                "uniqueItems": true,
                "default": []
            }
        },
        "type": ["object", "boolean"],
        "properties": {
            "$id": {
                "type": "string",
                "format": "uri-reference"
            },
            "$schema": {
                "type": "string",
                "format": "uri"
            },
            "$ref": {
                "type": "string",
                "format": "uri-reference"
            },
            "$comment": {
                "type": "string"
            },
            "title": {
                "type": "string"
            },
            "description": {
                "type": "string"
            },
            "default": true,
            "readOnly": {
                "type": "boolean",
                "default": false
            },
            "examples": {
                "type": "array",
                "items": true
            },
            "multipleOf": {
                "type": "number",
                "exclusiveMinimum": 0
            },
            "maximum": {
                "type": "number"
            },
            "exclusiveMaximum": {
                "type": "number"
            },
            "minimum": {
                "type": "number"
            },
            "exclusiveMinimum": {
                "type": "number"
            },
            "maxLength": { "$ref": "#/definitions/nonNegativeInteger" },
            "minLength": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
            "pattern": {
                "type": "string",
                "format": "regex"
            },
            "additionalItems": { "$ref": "#" },
            "items": {
                "anyOf": [
                    { "$ref": "#" },
                    { "$ref": "#/definitions/schemaArray" }
                ],
                "default": true
            },
            "maxItems": { "$ref": "#/definitions/nonNegativeInteger" },
            "minItems": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
            "uniqueItems": {
                "type": "boolean",
                "default": false
            },
            "contains": { "$ref": "#" },
            "maxProperties": { "$ref": "#/definitions/nonNegativeInteger" },
            "minProperties": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
            "required": { "$ref": "#/definitions/stringArray" },
            "additionalProperties": { "$ref": "#" },
            "definitions": {
                "type": "object",
                "additionalProperties": { "$ref": "#" },
                "default": {}
            },
            "properties": {
                "type": "object",
                "additionalProperties": { "$ref": "#" },
                "default": {}
            },
            "patternProperties": {
                "type": "object",
                "additionalProperties": { "$ref": "#" },
                "propertyNames": { "format": "regex" },
                "default": {}
            },
            "dependencies": {
                "type": "object",
                "additionalProperties": {
                    "anyOf": [
                        { "$ref": "#" },
                        { "$ref": "#/definitions/stringArray" }
                    ]
                }
            },
            "propertyNames": { "$ref": "#" },
            "const": true,
            "enum": {
                "type": "array",
                "items": true,
                "minItems": 1,
                "uniqueItems": true
            },
            "type": {
                "anyOf": [
                    { "$ref": "#/definitions/simpleTypes" },
                    {
                        "type": "array",
                        "items": { "$ref": "#/definitions/simpleTypes" },
                        "minItems": 1,
                        "uniqueItems": true
                    }
                ]
            },
            "format": { "type": "string" },
            "contentMediaType": { "type": "string" },
            "contentEncoding": { "type": "string" },
            "if": {"$ref": "#"},
            "then": {"$ref": "#"},
            "else": {"$ref": "#"},
            "allOf": { "$ref": "#/definitions/schemaArray" },
            "anyOf": { "$ref": "#/definitions/schemaArray" },
            "oneOf": { "$ref": "#/definitions/schemaArray" },
            "not": { "$ref": "#" }
        },
        "default": true
    }



    validate = ajv.compile(metaSchema);
  }

  //console.log('Schema', JSON.stringify(schema, null, 2))

  var valid = validate(schema);
  if (!valid) {
    console.log('Endpoint schema is not valid', ajv.errorsText())
    return null
  }

  // add built in props
  schema.properties.created = {
    "title": "Created date-time",
    "type": "string",
    "format": "date-time"
  }
  schema.properties.updated = {
    "title": "Updated date-time",
    "type": "string",
    "format": "date-time"
  }

  // Convert JSON Schema to model format that Fortune.js understands
  //String, Number, Boolean, Date, Object, and Buffer
  function parsePlain(prop){
    var f = {}
    if(prop.type == 'object'){
      f = {type:Object}
    }
    if(prop.type == 'string'){
      f = {type:String}
      if(prop.format == 'date-time' || prop.format == 'date'){
        f.type = Date
      }else if(prop.format == 'buffer'){
        f.type = Buffer
      }
    }else if(prop.type == 'integer' || prop.type == 'number'){
      f = {type:Number}
      if(prop.hasOwnProperty('minimum')){
        f.min = prop.minimum
      }else if(prop.hasOwnProperty('exclusiveMinimum')){
        f.min = parseInt(prop.exclusiveMinimum) + (prop.type == 'integer' ? 1 : 0.1)
      }
      if(prop.hasOwnProperty('maximum')){
        f.max = prop.maximum
      }else if(prop.hasOwnProperty('exclusiveMaximum')){
        f.max = prop.exclusiveMaximum - (prop.type == 'integer' ? 1 : 0.1)
      }
    }
    return f;
  }

  var f = {}, d = {}
  if(schema.name && schema.description){
    d[schema.name] = schema.description
  }
  for(var i in schema.properties){
    var prop = schema.properties[i]
    if(prop.type == 'null'){
      // do nothing
    }else if(prop.type == 'array'){
      f[i] = parsePlain(prop.items)
      f[i].isArray = true
    }else if(prop.type == 'boolean'){
      f[i] = {type:Boolean}
    }else{
      f[i] = parsePlain(prop)
    }

    // relations
    if(prop.relation && prop.relation.link){
      //link, isArray, inverse
      f[i] = {
        link:prop.relation.link,
        isArray: prop.relation.isArray || false
      }
      if(prop.relation.inverse){
        f[i].inverse = prop.relation.inverse
      }
    }

    // descriptions
    if(prop.description){
      d[i] = prop.description
    }
  }

  return {name:schema.name, model:f, documentation:d}
}

module.exports = schematofortune
