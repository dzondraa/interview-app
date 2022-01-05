const http = require('http')
const fortune = require('fortune')
require('./lib/patch.js')() // patches fortune http
const fortuneHTTP = require('fortune-http')
const Controller = require('./lib/controller.js')
const serveStatic = require('serve-static')
const cors = require('cors')
const binarySeliazer = require('./lib/binary_serializer')

// DB adapter(s)
const fsAdapter = require('fortune-fs')
//const mongodbAdapter = require('fortune-mongodb')
const elasticAdapter = require('fortune-elastic-adapter')

// custom init script
const serverInit = require('./lib/init.js')

// configuration
let masterConfig = require('./config/config.js')

// database adapters
let adapters = {
  fileSystem:[ fsAdapter, {
      path: __dirname+'/db'
  }],
  elasticSearch:[ elasticAdapter, {
      hosts: ["http://localhost:9299"],
      log: 'debug' // debug, error
  }]
}

// set one adapter
masterConfig.storeConfig.adapter = adapters.fileSystem

// Boot the server with configuration
Controller.boot(masterConfig).then(() => {

  // inject html when using Html Serializer
  var injects = [
    '<link rel="stylesheet" id="theme" href="css/endpointbuilder.css">',
    '<script crossorigin src="js/react.js"></script>',
    '<script crossorigin src="js/reactdom.js"></script>',
    '<script crossorigin src="js/react-jsonschema-form.js"></script>',
    '<script src="js/schemabuilder.js"></script>',
    '<script src="js/injector.js"></script>'
  ]

  let env = process.env.NODE_ENV || 'development'
  console.log('Running on', env)

  // HTTP Serializer opts
  var httpOpts = {
    serializers:[
      fortuneHTTP.JsonSerializer,
      [fortuneHTTP.HtmlSerializer, {prefix:(env == 'production'?'/api':''), injectHTML:injects.join('')}],
      fortuneHTTP.FormDataSerializer,
      fortuneHTTP.FormUrlEncodedSerializer,
      fortuneHTTP.JsonSerializer,
      binarySeliazer
    ]
  }

  // enable cors
  var corsMiddleware = cors({
    'allowedHeaders': ['Content-Type', 'Authorization', 'Location', 'X-Powered-By', 'X-Total-Count'],
    //'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  })

  // Serve up public/ftp folder
  var staticFiles = serveStatic('public', {'index': ['index.html']})

  // define listener
  Controller.api.listener = (request, response) => {
    staticFiles(request, response, () => {
      corsMiddleware(request, response, () => {
        Controller.listener(request, response,
          fortuneHTTP(Controller.api.store, httpOpts)
        ).catch(Controller.logError)
      })
    })
  }

  // create server
  if(Controller.api.protocol == 'https'){
    Controller.api.server = https.createServer(Controller.getSSLOptions(), Controller.api.listener);
  }else{
    Controller.api.server = http.createServer(Controller.api.listener)
  }

  // connect to store
  Controller.api.store.connect().then(() => {
    return serverInit(Controller).then(() => Controller.api.server.listen(Controller.api.port))
  }).catch(Controller.logError)
})
