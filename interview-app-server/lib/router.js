const router = {}
router.route = function(controllerInstance, req, res, session){
    let api = controllerInstance.api
    let url = req.urlParsed || new URL(req.url, [api.protocol, '://', req.headers.host].join(''))
    let reqMethod = req.method + ' ' + url.pathname
    req.params = {}
    if(controllerInstance[reqMethod]){
        return controllerInstance[reqMethod](req, res, session)
    }else{
        let frags = reqMethod.split('/')
        let classMethods = Object.getOwnPropertyNames( Object.getPrototypeOf( controllerInstance ) ) // native methods
        for(var i in controllerInstance){ if(typeof controllerInstance[i] == 'function' && !classMethods.includes(i)) classMethods.push(i) } // dynamic methods
        for(let i=0;i<classMethods.length;i++){
            let cm = classMethods[i];
            if(cm.includes('/')){
                let cmFrags = cm.split('/')
                if(cmFrags.length == frags.length){
                    let pass = true
                    for(let j=0;j<frags.length;j++){
                        if(cmFrags[j][0] == '{'){
                            req.params[cmFrags[j].substr(1, cmFrags[j].length - 2)] = frags[j]
                        }else if(cmFrags[j] != frags[j]){
                            pass = false
                            break
                        }
                    }
                    if(pass) return controllerInstance[cm](req, res, session)
                }
            }
        }
    }
    return Promise.resolve(new Error("Not found"))
}

module.exports = router