/**
 * Injects endpoint editor
 */

var ___iecnf = {count:0};
class InjectEndpointEdit {
  constructor(opts){
    var options = {
      selector:'.label-create',
      match:{
        innerHTML:'Create endpoint'
      },
      formSelector:'.record-form'
    }
    for(var i in opts) options[i] = opts[i]
    this.options = options
    this.cnt = 0
    this.login()
    this.init()
  }

  static get cnf() { return ___iecnf; }

  matches(el, match){
    for(var i in match){
      var val = el[i] ? el[i] : el.getAttribute(i)
      if(typeof match[i] == 'object'){
        if(match[i].startsWith && !val.startsWith(match[i].startsWith)){
          return false
        }
        if(match[i].includes && !val.includes(match[i].includes)){
          return false
        }
      }else if(val !== match[i]){
        return false
      }
    }
    return true
  }

  init() {
    var inst = this
    var options = this.options
    document.addEventListener("DOMContentLoaded", function(event) {
      var els = document.querySelectorAll(options.selector)
      for(var i=0; i<els.length;i++){

        InjectEndpointEdit.cnf.count += 1
        els[i].setAttribute('data-eid', 'endpoint-builder-'+InjectEndpointEdit.cnf.count)
        els[i].onclick = (e) => {

          if(inst.matches(e.target, options.match)){
            var eid = e.target.getAttribute('data-eid')
            if(document.getElementById(eid)) return

            // hide form contents
            var form
            if(typeof options.formSelector == 'function'){
              form = options.formSelector(e.target)
            }else{
              form = document.querySelector(options.formSelector)
            }
            if(!form) throw Error("Invalid form selector: "+options.formSelector)
            var inpts = form.querySelector('.inputs')

            // modify and clear the form
            var lbls = inpts.querySelectorAll('label')
            for(var j=0;j<lbls.length;j++){
              lbls[j].style.display = 'none'
            }
            form.style.width = '512px'
            inpts.className += inpts.className ? ' endpoint-editor' : 'endpoint-editor';

            form.querySelector('input[type="submit"]')

            var schema = {}
            var schemaChanged = function(schm, rform){
              schema = schm
            }
            var onSubmit = function(ev){

              var form = this
              form.querySelector('form input[type="submit"]').click()

              var valid = true
              if(!schema || !schema.name || !schema.properties){
                valid = false
              }else{
                var cp = 0
                for(var j in schema.properties){
                  cp += 1
                  if(!schema.properties[j].type){
                    valid = false
                    break;
                  }
                }
                if(cp === 0){valid=false}
              }
              if(!valid){
                console.log('Invalid schema')
                ev.preventDefault()
                return false
              }

              // textarea schema
              form.querySelector('textarea[name="schema"]').value = JSON.stringify(schema)
            }
            form.onsubmit = onSubmit

            // append container for the builder
            var con = document.createElement('div')
            con.id = eid
            inpts.appendChild(con)

            // add existing data if any
            var parsedSchema = null, editOpts = {schemaChange:schemaChanged}
            try {
              parsedSchema = JSON.parse(form.querySelector('textarea[name="schema"]').value)
            }catch(err){}
            if(parsedSchema){
              editOpts.formData = parsedSchema
            }

            // init builder
            var frmBuilder = React.createElement(FormBuilder, editOpts, React.createElement('input', {type:"submit", id:eid+"-submit", "class":"schema-editor-builtin-submit", value:""}, null))
            // init form builder
            ReactDOM.render(
              frmBuilder,
              document.getElementById(eid)
            );
          }
        }
      }

      inst.docs()
      inst.raml()
      inst.logout()
    });
  }

  login(){
    // just show login prompt if there's no cookie named 'token'
    var token = this.getCookie('token')
    if(!token){
      document.location.href = 'login.html'
    }
  }

  getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }

  logout() {
    // create logout link
    if(!document.getElementById('logout-link')){
      let p = this.getPath()
      var logoutLink = document.createElement('a')
      logoutLink.id = 'logout-link'
      logoutLink.className = 'head-right-link'
      logoutLink.setAttribute('href', p+'/logout.html')
      logoutLink.innerHTML = '<span>&nbsp;&nbsp;&nbsp;Logout</span>'
      document.querySelector('.token-status').appendChild(logoutLink)
    }
  }

  getPath(){
    let path = window.location.pathname.split('/')
    path.pop()
    path = path.join('/')
    return path
  }

  docs() {
    // create logout link
    if(!document.getElementById('docs-link')){
      var docsLink = document.createElement('a')
      docsLink.id = 'docs-link'
      docsLink.className = 'head-right-link'
      let lnk = document.location.pathname; lnk = lnk.split('/'); lnk.push('docs'); lnk = '/' + lnk.join('/')
      docsLink.setAttribute('href', 'docs')
      docsLink.innerHTML = '<span>&nbsp;&nbsp;&nbsp;API Docs</span>'
      document.querySelector('.token-status').appendChild(docsLink)
    }
  }

  raml() {
    // create logout link
    if(!document.getElementById('raml-link')){
      var ramlLink = document.createElement('a')
      ramlLink.id = 'raml-link'
      ramlLink.className = 'head-right-link'
      ramlLink.setAttribute('href', 'raml')
      ramlLink.innerHTML = '<span>&nbsp;&nbsp;&nbsp;RAML</span>'
      document.querySelector('.token-status').appendChild(ramlLink)
    }
  }
}

// inject endpoint builders
new InjectEndpointEdit({
  selector:'.label-create',
  match:{
    innerHTML:'Create endpoint'
  },
  formSelector:'.record-form.create'
})

new InjectEndpointEdit({
  selector:'.label-update',
  match:{
    innerHTML:'Edit',
    'for':{startsWith:'toggle-endpoint'}
  },
  formSelector:function(btnEl){
    return btnEl.parentNode.querySelector('form')
  }
})
