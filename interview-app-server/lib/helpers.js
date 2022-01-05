const crypto = require('crypto')
const fortune = require('fortune')

const hashAlgorithm = 'SHA256'

function makePassword (string) {
  const salt = crypto.randomBytes(32)
  const password = crypto.createHash(hashAlgorithm)
    .update(salt).update('' + string).digest()

  return { salt, password }
}

function validatePassword(password, hash, salt){
  const genHash = crypto.createHash(hashAlgorithm).update(salt).update('' + password).digest()
  if(hash.equals(genHash)){
    return true
  }
  return false
}

const { errors: { UnauthorizedError, ForbiddenError } } = fortune

function validateUser (context, userId) {
  const {
    request: { meta: { headers: { authorization }, language } },
    response: { meta }
  } = context

  // Parse HTTP Basic Access Authentication. TODO: replace with JWT
  // const [ userId, password ] = atob(authorization.split(' ')[1]).split(':')

  if (!userId || !password) {
    if (!meta.headers) meta.headers = {}
    meta.headers['WWW-Authenticate'] = 'Basic realm="App name"'
    throw new UnauthorizedError(message('InvalidAuthorization', language))
  }
  
  const options = { fields: { password: true, salt: true } }

  return store.adapter.find('user', [ userId ], options).then(result => {
    const [ user ] = result
    const error = new ForbiddenError(message('InvalidPermission', language))

    if (!user || (userId && userId !== user.id)) throw error

    const hash = crypto.createHash(hashAlgorithm)
      .update(user.salt).update(password).digest()

    // Prefer a constant-time equality check, this is not secure.
    if (!hash.equals(user.password)) throw error

    return user
  })
}


function generateToken(){
  return crypto.randomBytes(256).toString('hex');
}

function getForbiddenError(context){
  let lng = context.language || context.request.meta.language
  return new fortune.errors.ForbiddenError(fortune.message('InvalidPermission', lng))
}

module.exports = {
  makePassword:makePassword,
  validateUser:validateUser,
  generateToken:generateToken,
  validatePassword:validatePassword,
  getForbiddenError:getForbiddenError
}
