/*
Session handling
- get session data given a token
- cache session data for a little while
 */

var Negotiator = require('negotiator')
var cookie = require('cookie');

var config = {
  cache: {},
  cacheTime: 5000
}
/**
 * Initialize session
 * @param  {Object} store   Fortune.js instance
 * @return {Function}       Function that given a token returns user session data
 */
 function session(api) {
   var store = api.store
   config.store = store
   const { Promise, message, errors: { UnauthorizedError, ForbiddenError } } = store.adapter

   return function(context, roles) {
     if(!context.request || !context.request.meta || !context.request.meta.headers){
       return Promise.resolve(null)
     }
     let token = getToken(context.request.meta.headers)
     var ses = cache(token)
     if(ses){
       if(Array.isArray(roles) && Array.isArray(ses.user.roles) && !roles.find((el) => ses.user.roles.includes(el))){
         throw new ForbiddenError(message('InvalidPermission', context.request.meta.language))
       }
       return Promise.resolve(ses)
     }else{
       return Promise.resolve({
         login: {login: 'anonymous'},
         user:  {login: 'anonymous', roles: [ 'anon' ]},
         session: true
       })
     }
   }
 }

function getToken(headers){
  // get the token from authorization header
  let auth = headers.authorization || ''
  var token = auth.split(' ')[1]
  if(!token){
    let cookies = cookie.parse(headers.cookie || '');
    token = cookies.token
  }
  return token
}

function rawSession(store, req, roles){
  let negotiator = new Negotiator(req)
  let language = negotiator.language()
  req.language = language

  // get the token
  let token = getToken(req.headers)
  var ses = {
    login: {login: 'anonymous'},
    user:  {login: 'anonymous', roles: [ 'anon' ]},
    session: true
  }
  req.session = ses
  const { Promise, message, errors: { UnauthorizedError, ForbiddenError } } = store.adapter
  if(token){
    token = token.trim()
    var cachedSession = cache(token)
    if(cachedSession){
      return Promise.resolve(cachedSession)
    }

    return store.find('login', null, {
      match: {
        token: token
      },
      limit:1,
      fields:{
        password:false,
        token:false
      }
    }, [
      ['user', {
        fields:{
          salt:false,
          password:false
        }
      }]
    ]).then((result) => {
      if(result.payload.records.count > 0) {
        //ses.token = token
        ses.login = result.payload.records[0]
        ses.user =  result.payload.include.user[0]
        ses.session = true

        // check if required roles match the user's roles. If no roles are required, return the session
        if(Array.isArray(roles) && Array.isArray(ses.user.roles) && !roles.find((el) => ses.user.roles.includes(el))) {
          throw new ForbiddenError(message('InvalidPermission', language))
        }
        cache(token, ses)
        //console.log('SESSION:', JSON.stringify(ses, null, 2))
        req.session = ses
      }
      return ses
    }).catch((err)=>{
      return Promise.resolve(ses)
    })
  }else{
    return Promise.resolve(ses)
  }
  //console.log('Headers', req.headers)
}

/**
 * Simple memory cache
 * @param  {String} 	key  	 		  [key for the cache obj]
 * @param  {Object} 	val   		  [the obj to be cached]
 * @param  {Number} 	milis 		  [number of miliseconds to cache, default 30000 (30 seconds)]
 * @param  {Object}   cacheStore  [custom cache store object]
 * @return {Object}       			  [returns cached object or undefined]
 */
function cache(key, val, milis, cacheStore){
  cacheStore = cacheStore || config.cache
  milis = milis || config.cacheTime
  if(val === undefined && cacheStore[key]){
    return cacheStore[key].val
  }else if(key !== undefined && val !== undefined){
    if(cacheStore[key]){ clearTimeout(cacheStore[key].ctime);delete cacheStore[key]}
    cacheStore[key] = {}
    cacheStore[key].val = val
    cacheStore[key].key = key
    function cc(){delete cacheStore[this.key];}
    cacheStore[key].ctime = setTimeout(cc.bind(cacheStore[key]), milis)
  }
  return undefined
}

function roles(req, roles) {
  var store = config.store
  const { Promise, message, errors: { UnauthorizedError, ForbiddenError } } = store.adapter
  let forbid = new ForbiddenError(message('InvalidPermission', req.language))

  if(!roles || !req || !req.session || !req.session.user || !req.session.user.roles || !Array.isArray(req.session.user.roles)) throw forbid
  roles = Array.isArray(roles) ? roles : [roles]
  if(!roles.find((el) => req.session.user.roles.includes(el))) {
    return Promise.reject(forbid)
  }else{
    return Promise.resolve(req.session)
  }
}

module.exports = session
module.exports.raw = rawSession
module.exports.roles = roles
