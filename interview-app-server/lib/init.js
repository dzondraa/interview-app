
const helpers = require('./helpers.js')
var fs = require('fs');
function initialize(Controller){

  // create instances of controllers that are not using fortune hooks
  var version = Controller.api.version
  fs.readdir(__dirname+'/../controllers/'+version, function(err, items) {
    for (var i=0; i<items.length; i++) {
      var endpointName = items[i].split('.')[0]
      if(!Controller.instances[endpointName] && endpointName != 'default'){
        var controllerPath = __dirname+'/../controllers/'+version+'/'+endpointName+'.js', ctrl;
        try{
          let ctrl = require(controllerPath)
          Controller.instances[endpointName] = new ctrl(Controller.api);
        } catch(err){
          throw err
        }
      }
    }
  });

  // if there is no admin user create one from the config
  return Controller.api.store.find('user', null, {
    match:{
      roles:"admin"
    },
    limit:1,
    fields:{
      id:true,
      login:true
    }
  }, null, {
    nofilter:true
  }).then((result) => {
    if(result.payload.count === 0){
      // create admin
      var record = Controller.api.noadmin
      record.dateOfBirth = new Date(record.dateOfBirth)
      record.password = Buffer.from(record.password, Controller.api.store.options.bufferEncoding || 'base64');
      return Controller.api.store.create('user', record, null, {nofilter:true})
    }
  }).catch(err=>{})
}

module.exports = initialize
