const fs = require('fs')

let doPatch = function(){
  let fpath = __dirname + '/../node_modules/fortune-http/lib/initialize_context.js'
  try{
    if (fs.existsSync(fpath)) {
      let findStr = 'path.push(JSON.parse(parts[1]))'
      let replaceStr = 'try{if (parts[1]){path.push(JSON.parse(parts.slice(1).join(",")))}}catch(err){conole.log("Patch err:", err);}'
      let file = fs.readFileSync(fpath, 'utf8').toString('utf8')
      if(file.includes(findStr)){
        file = file.replace(findStr, replaceStr)
        fs.writeFileSync(fpath, file)
      }
    }else{
      console.log('Fortune http patch failed. File ' + fpath + ' is missing.')
    }
  }catch(err){
    console.error('Fortune http patch failed. Please make sure that user can write to node_modules directory', err)
  }
}

module.exports = doPatch