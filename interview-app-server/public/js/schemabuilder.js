/*
  Visual JSON Schema builder with a preview

  Dependancies:
  - react
  - react-dom
  - react-jsonschema-form
*/
class FormBuilder extends JSONSchemaForm.default {
  static get metaSchema() {
    return {
      "title": "Endpoint builder",
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "title":"Name",
          "description":"Name of your endpoint, used in URL-s, e.g. tweet"
        },
        "title": {
          "type": "string",
          "title":"Title",
          "description":"Descriptive title for the endpoint"
        },
        "description": {
          "type": "string",
          "title":"Description"
        },
        "access":{
          "type": "object",
          "title": "Access",
          "description":"Allow access to CRUD for user roles and record owner",
          "properties":{
            "create":{
              "type":"object",
              "title":"Create",
              "properties":{
                "roles":{
                  "type": "array",
                  "title": "Roles",
                  "minItems": 1,
                  "items": {
                    "type": "string",
                    "enum": ["admin", "user", "anon"],
                    "default":["admin"]
                  },
                  "uniqueItems": true
                }
              }
            },
            "update":{
              "type":"object",
              "title":"Update",
              "properties":{
                "roles":{
                  "type": "array",
                  "title": "Roles",
                  "minItems": 1,
                  "items": {
                    "type": "string",
                    "enum": ["admin", "user", "anon"],
                    "default":["admin"]
                  },
                  "uniqueItems": true
                },
                "owner":{
                  "type": "boolean",
                  "title": "Owner only",
                  "default":true
                }
              }
            },
            "read":{
              "type":"object",
              "title":"Read",
              "properties":{
                "roles":{
                  "type": "array",
                  "title": "Roles",
                  "minItems": 1,
                  "items": {
                    "type": "string",
                    "enum": ["admin", "user", "anon"],
                    "default":["admin"]
                  },
                  "uniqueItems": true
                },
                "owner":{
                  "type": "boolean",
                  "title": "Owner only",
                  "default":true
                }
              }
            },
            "delete":{
              "type":"object",
              "title":"Delete",
              "properties":{
                "roles":{
                  "type": "array",
                  "title": "Roles",
                  "minItems": 1,
                  "items": {
                    "type": "string",
                    "enum": ["admin", "user", "anon"],
                    "default":["admin"]
                  },
                  "uniqueItems": true
                },
                "owner":{
                  "type": "boolean",
                  "title": "Owner only",
                  "default":true
                }
              }
            }
          }
        },
        "properties": {
          "title":"Properties:",
          "type": "array",
          "minItems": 0,
          "items": {
            "type": "object",
            "title": "Property",
            "properties": {
              "name": {
                "type": "string",
                "title": "Name"
              },
              "title": {
                "type": "string",
                "title": "Title"
              },
              "description": {
                "type": "string",
                "title": "Description"
              },
              "type": {
                "type": "string",
                "enum": [
                  "string",
                  "boolean",
                  "integer",
                  "number",
                  "object",
                  "array"
                ],
                "default": "string",
                "title": "Type"
              },
              "format": {
                "title": "Format",
                "type": "string",
                "enum": [
                  "date",
                  "time",
                  "date-time",
                  "uri",
                  "uri-reference",
                  "uri-template",
                  "url",
                  "email",
                  "hostname",
                  "ipv4",
                  "ipv6",
                  "regex",
                  "uuid",
                  "json-pointer",
                  "relative-json-pointer",
                  "buffer"
                ]
              },
              "relation":{
                "title":"Relation",
                "description":"Relations to other endpoints like one-to-many many-to-manu",
                "type":"object",
                "properties":{
                  "link":{
                    "type":"string",
                    "title":"Link",
                    "description":"Link to endpoint"
                  },
                  "isArray":{
                    "type":"boolean",
                    "title":"Many",
                    "description":"Link to many"
                  },
                  "inverse":{
                    "type":"string",
                    "title":"Inverse",
                    "description":"Inverse field in the linked endpoint (optional)"
                  }
                }
              },
              "required":{
                "type":"boolean",
                "title":"Required",
                "description":"Is this property required?"
              }
            },
            "required":["name", "type"]
          }
        }
      },
      "required":["name", "title"]
    }
  }

  static onChange(form) {
    var schema = FormBuilder.toSchema(form.formData)
    if(FormBuilder.shared.previewForm){
      FormBuilder.shared.previewForm.setState({schema:schema})
    }

    if(FormBuilder.schemaUpdatedCallback){
      FormBuilder.schemaUpdatedCallback.call(form, schema)
    }

    return schema
  }
  static onSubmit(form) {
    //console.log("submitted", form)
  }
  static onError() {console.log("errors")}

  static toSchema(formData) {
    var f = null;
    try{
      f = JSON.parse(JSON.stringify(formData))
    }catch(err){
      return
    }
    var propName = null
    f.type = "object"
    var props = {}, requireds = []
    for(var i in f.properties){
      propName = f.properties[i].name
      if(!f.properties[i].title){f.properties[i].title = propName}
      delete f.properties[i].name
      props[propName] = f.properties[i]

      if(f.properties[i].required){
        requireds.push(propName)
        delete f.properties[i].required
      }
    }
    f.properties = props
    if(requireds.length > 0) f.required = requireds

    // requireds


    //document.getElementById('formdata').innerHTML = JSON.stringify(f, null, 2)

    return f
  }
  static fromSchema(schema) {
    var f = JSON.parse(JSON.stringify(schema)), propName = null
    var props = [], requireds = f.required || []
    delete f.type
    for(var i in f.properties){
      f.properties[i].name = i
      props.push(f.properties[i])
      if(requireds.indexOf(i) != -1){
        f.properties[i].required = true
      }
    }
    f.properties = props

    return f
  }

  constructor(props) {
    props.schema = FormBuilder.metaSchema
    props.onChange = function(form){
      var schema = FormBuilder.onChange(form)
      if(schema && props.schemaChange){
        props.schemaChange(schema, form)
      }
    }
    props.onSubmit = FormBuilder.onSubmit
    props.onError = FormBuilder.onError

    if(props.formData){
      props.formData = FormBuilder.fromSchema(props.formData)
    }else{
      props.formData = {}
    }
    super(props)
    if(FormBuilder && FormBuilder.shared){
      FormBuilder.shared.formBuilder = this
    }
  }

  setState(newState){
    if(newState.formData && newState.formData.type == 'object' && !Array.isArray(newState.formData.properties)){
      newState.formData = FormBuilder.fromSchema(newState.formData)
    }
    super.setState(newState)
  }
}
FormBuilder.shared = {}
class PreviewForm extends JSONSchemaForm.default {
  constructor(props) {
    if(!props.schema){
      props.schema = {}
    }
    super(props)
    if(FormBuilder && FormBuilder.shared){
      FormBuilder.shared.previewForm = this
    }
  }
  componentDidMount(){
    if(FormBuilder && FormBuilder.shared && FormBuilder.shared.formBuilder){
      FormBuilder.onChange(FormBuilder.shared.formBuilder.props)
    }
  }
}
