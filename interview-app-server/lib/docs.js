
yaml = require('js-yaml');
fs   = require('fs');

var docs = {
  config:{},
  types:{},
  init:function(config){
    this.config = config;
  },
  generateFromRaml:function(string, cb){
    var inst = this;
    inst.loadFromString(string, function(err, doc){
      cb(err, inst.makeDocs(doc))
    })
  },
  generateFromFile:function(file, cb){
    var inst = this;
    inst.loadFromFile(file, function(err, doc){
      cb(err, inst.makeDocs(doc))
    })
  },
  makeDocs:function(doc){
    var inst = this
    if(!doc) return ''
    var htm = inst.getHeader(doc)
    htm += `
      <div class="col col-lg-9">
      <div class="">
        <h1>`+doc.title+` <small>version `+doc.version+`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</small></h1>
        <p>`+doc.baseUri+`</p>
        <p>`+doc.description+`</p>
      </div>`
    htm += inst.genObj(doc)
    htm += `
      </div>
      <div class="col-md-auto">
        `+inst.getMenu(doc)+`
      </div>`
    htm += inst.getFooter()

    //console.log(htm)
    return htm
  },
  genObj:function(obj, pparent){

     var inst = this, htm = '', methods = ['get', 'post', 'put', 'patch', 'options', 'head', 'delete']
     var parent = pparent ? pparent.concat() : []

     var key = inst.parent(parent).key

     // get object type
     var objType = ''
     if(key === ''){
       objType = 'root'
     }else if(key.substr(0, 1) == '/'){
       objType = 'endpoint'
     }else if(methods.indexOf(key) != -1){
       objType = 'method'
     }else if(key == 'responses'){
       objType = 'responses'
     }else if(!isNaN(key)){
       objType = 'response'
     }

     var name = ''
     if(parent.length > 0){
       var ps = []
       for(var i in parent){
         ps.push(parent[i].key)
       }
       name = ps.join('')
     }

     if(objType == 'root'){

       for(var i in obj){
         if(i.substr(0, 1) == '/'){
           name = i
           var nameId = name.replace(/[^a-zA-Z0-9]/g, '')
           htm += `
           <div class="card mb-4">
             <h5 id="`+nameId+`" class="card-header">`+name+`</h5>
             <div class="card-body">
           `
           htm += `<div class="top-resource-description"><p>`+obj[i].description+`</p></div>`

           htm += `<div class="panel-group">`
           if(typeof obj[i] == 'object'){
             parent.push({
               key:i,
               val:obj
             })
             htm += inst.genObj(obj[i], parent)
             parent.pop()
           }
           htm += `</div>`
           htm += `
             </div>
           </div>
           `
         }else if(i == 'types'){
           inst.types = obj.types
           // for(var j in obj.types){
           //   htm += `<div id="types_`+j+`" hidden>`+obj.types[j]+`</div>`
           // }
         }
       }
     }else if(objType == 'endpoint'){
       var nameId = name.replace(/[^a-zA-Z0-9]/g, '')
       htm += `
       <div class="panel panel-white">
          <div class="card-body pb-0">
            <h5 class="card-title">
              <a class="collapsed" data-toggle="collapse" href="#panel_`+nameId+`"><span class="parent"></span>`+name+`</a>
              <span class="methods">`
       for(var i in obj){
         if(methods.indexOf(i) != -1){
           htm += `<a href="#`+nameId+`_`+i+`"><span class="badge badge_`+i+`">`+i+`</span></a>`
         }
       }
       htm +=`</span>
            </h5>
          </div>`

          htm += `
          <div id="panel_`+nameId+`" class="panel-collapse collapse in" style="height: auto;">
            <div class="card-body">
              <div class="list-group">`
          for(var i in obj){
            if(methods.indexOf(i) != -1){
              htm += `
                <div onclick="window.location.href = '#`+nameId+`_`+i+`'" class="list-group-item">
                  <span class="badge badge_`+i+`">`+i+`</span>
                  <div class="method_description">
                    <p>`+obj[i].description+`</p>
                  </div>
                  <div class="clearfix"></div>
                </div>`
            }
          }
          htm += `
              </div>
            </div>
          </div>`

          // details in modal
          for(var i in obj){
            if(methods.indexOf(i) != -1){

              var reqActive = obj[i].body ? true : false

              htm += `
          <div class="modal fade" tabindex="-1" id="`+nameId+`_`+i+`" role="dialog" aria-hidden="true" style="display: none;">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title" id="myModalLabel"><span class="badge badge_`+i+`">`+i+`</span> <span class="parent"></span>`+name+`</h4>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="alert alert-info" role="alert">
                    `+obj[i].description+`
                  </div>
                  <ul class="nav nav-tabs">
                    <li class="nav-item" `+(obj[i].body ? '' : 'hidden')+`>
                      <a class="nav-link `+(obj[i].body ? 'active' : '')+`" href="#`+nameId+`_`+i+`_request" data-toggle="tab">Request</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link `+(obj[i].body ? '' : 'active')+`" href="#`+nameId+`_`+i+`_response" data-toggle="tab">Response</a>
                    </li>
                  </ul>
                  <div class="tab-content">
                    <div class="tab-pane `+(obj[i].body ? 'active' : 'disabled')+`" id="`+nameId+`_`+i+`_request">`

                    //htm += '<pre><code>'+JSON.stringify(obj[i], null, 2)+'</pre></code>'

                    if(obj[i].body){
                      htm += `
                      <h3>Body</h3>
                      <p><strong>Type: ${name.includes('/attachment') ? 'binary/octet-stream' : 'application/json'}</strong></p>`

                      if(obj[i].body.schema){
                        var schema = inst.types[obj[i].body.schema] || obj[i].body.schema
                        htm += `
                        <p><strong>Schema</strong>:</p>
                        <pre>
                          <code class="hljs json">
`+schema+`</code>
                        </pre>`
                      }

                      if(obj[i].body.example){
                        htm += `
                        <p><strong>Example</strong>:</p>
                        <pre>
                          <code class="hljs json">
`+obj[i].body.example.trim()+`</code>
                        </pre>`
                      }
                    }
                    htm += `
                    </div>
                    <div class="tab-pane `+(obj[i].body ? '' : 'active')+`" id="`+nameId+`_`+i+`_response">`
                    if(obj[i].responses){
                      for(var j in obj[i].responses){
                        var resp = obj[i].responses[j]
                        var body = resp.body
                        htm += `
                        <h2>HTTP status code <a href="http://httpstatus.es/`+j+`" target="_blank">`+j+`</a></h2>`

                        if(body){
                          htm += `
                        <h3>Body</h3>
                        <p><strong>Type: application/json</strong></p>
                          `
                          if(body.schema){
                            var schema = inst.types[body.schema] || body.schema
                            htm += `
                        <p><strong>Schema</strong>:</p>
                        <pre>
                          <code class="hljs json">
`+schema+`</code>
                        </pre>
                            `
                          }
                          if(body.example){
                            htm += `
                        <p><strong>Example</strong>:</p>
                        <pre>
                          <code class="hljs json">
`+body.example.trim()+`</code>
                        </pre>
                            `
                          }
                        }
                      }
                    }
                    htm += `
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`
            }
          }
       htm +=`
       </div>
       `

       // check for sub-endpoints
       for(var i in obj){
         if(i.substr(0, 1) == '/' && typeof obj[i] == 'object'){
           parent.push({
             key:i,
             val:obj
           })
           htm += inst.genObj(obj[i], parent)
           parent.pop()
         }
       }

     }

    return htm
  },
  parent:function(parent, index){
    index = index || 0
    index = parent.length - 1 - index
    return parent[index] ? parent[index] : {key:'', val: ''}
  },
  loadFromFile:function(file, cb){
    // Get document, or throw exception on error
    try {
      var doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
      //console.log(doc);
      cb(null, doc)
    } catch (e) {
      //console.log(e);
      cb(e)
    }
  },
  loadFromString:function(string, cb){
    // Get document, or throw exception on error
    try {
      var doc = yaml.load(string);
      //console.log(doc);
      cb(null, doc)
    } catch (e) {
      //console.log(e);
      cb(e)
    }
  },
  getHeader:function(obj){
    var htm = `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
        <title>`+obj.title+`</title>
        <style>

          html {
            font-size: 14px;
          }
          body {
            position: relative;
          }

          .hljs {
            background: transparent;
          }
          .parent {
            color: #999;
          }
          .list-group-item > .badge {
            float: none;
            margin-right: 6px;
          }
          .card-title > .methods {
            float: right;
          }
          .badge {
            border-radius: 0;
            text-transform: uppercase;
            width: 70px;
            font-weight: normal;
            color: #f3f3f6;
            line-height: normal;
          }
          .badge_get {
            background-color: #63a8e2;
          }
          .badge_post {
            background-color: #6cbd7d;
          }
          .badge_put {
            background-color: #22bac4;
          }
          .badge_delete {
            background-color: #d26460;
          }
          .badge_patch {
            background-color: #ccc444;
          }
          .list-group, .panel-group {
            margin-bottom: 0;
          }
          .panel-group .panel+.panel-white {
            margin-top: 0;
          }
          .panel-group .panel-white {
            border-bottom: 1px solid #F5F5F5;
            border-radius: 0;
          }
          .panel-white:last-child {
            border-bottom-color: white;
            -webkit-box-shadow: none;
            box-shadow: none;
          }
          .panel-white .card-header {
            background: white;
          }
          .tab-pane ul {
            padding-left: 2em;
          }
          .tab-pane h1 {
            font-size: 1.3em;
          }
          .tab-pane h2 {
            font-size: 1.2em;
            padding-bottom: 4px;
            border-bottom: 1px solid #ddd;
          }
          .tab-pane h3 {
            font-size: 1.1em;
          }
          .tab-content {
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            padding: 10px;
          }

          #sidebar {
            margin-top: 50px;
            padding-right: 5px;
            /*
            overflow: auto;
            height: 90%;
            */
          }

          .top-resource-description {
            border-bottom: 1px solid #ddd;
            background: #fcfcfc;
            padding: 15px 15px 0 15px;
            margin: -15px -15px 10px -15px;
          }
          .resource-description {
            border-bottom: 1px solid #fcfcfc;
            background: #fcfcfc;
            padding: 15px 15px 0 15px;
            margin: -15px -15px 10px -15px;
          }
          .resource-description p:last-child {
            margin: 0;
          }
          .list-group .badge {
            float: left;
          }
          .method_description {
            margin-left: 85px;
          }
          .method_description p:last-child {
            margin: 0;
          }
          .list-group-item {
            cursor: pointer;
          }
          .list-group-item:hover {
            background-color: #f5f5f5;
          }

          pre code {
            overflow: auto;
            word-wrap: normal;
            white-space: pre;
          }

          code {
            font-family: "Lucida Console", Monaco, monospace
          }
        </style>
      </head>
      <body data-spy="scroll" data-target="#sidebar">
        <div class="container">
          <div class="row" role="main">`
    return htm
  },
  getFooter:function(){
    var htm = `
          </div>
        </div>
      <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js" integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ" crossorigin="anonymous"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js" integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm" crossorigin="anonymous"></script>
      <script type="text/javascript">
        $(document).ready(function() {

          // open modal on hashes like #_action_get
          $(window).bind('hashchange', function(e) {
            var anchor_id = document.location.hash.substr(1); //strip #
            if(anchor_id){
              var element = $('#' + anchor_id);

              // do we have such element + is it a modal?  --> show it
              if (element.length && element.hasClass('modal')) {
                element.modal('show');
              }
            }
          });

          // execute hashchange on first page load
          $(window).trigger('hashchange');

          // remove url fragment on modal hide
          $('.modal').on('hidden.bs.modal', function() {
            try {
              if (history && history.replaceState) {
                  history.replaceState({}, '', '#');
              }
            } catch(e) {}
          });


          // $('#sidebar a').on('click', function (e) {
          //
          //   $('#sidebar a').removeClass('active')
          //   $(e.target).addClass('active')
          //
          //   //location.href = e.target.href
          //   console.log('Ovde??')
          // })


        });
      </script>
      </body>
    </html>`
    return htm
  },
  getMenu:function(obj){
    var inst = this, htm = ''
    var arr = inst.getMenuArr(obj)

    htm += `
    <div id="sidebar" class="navbar navbar-dark sticky-top sticky-offset">
      <ul class="nav nav-pills flex-column" role="tablist">`
    for(var i in arr){
      if(typeof arr[i] == 'string'){
        var lnk = arr[i].replace(/[^a-zA-Z0-9]/g, '')
        htm += `
        <li class="nav-item">
          <a class="nav-link" role="tab" href="#`+lnk+`">`+arr[i]+`</a>
        </li>`
      }
    }
    htm += `
      </ul>
    </div>`

    return htm
  },
  getMenuArr:function(obj, arr){
    var inst = this, arr = arr || []
    for(var i in obj){
      if(i.substr(0, 1) == '/'){
        arr.push(i)
        if(typeof obj[i] == 'object'){
          var narr = inst.getMenuArr(obj[i]), parr = []
          if(narr.length > 0){
            arr.push(narr)
          }
        }
      }
    }
    return arr
  }
}

module.exports = docs;
