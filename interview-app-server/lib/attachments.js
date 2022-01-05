/**
 * Attachments
 * 
 * Management of files and their attachment to documents.
 * One document can have multiple files attached
 */
const fs = require('fs');
const ft = require('file-type');
const Stream = require('stream');
const uuid = require('uuid');

let attachments = {}

attachments.create = function (req, res, ses, api, type, fieldName, ownerId) {

    let file = req.fileInfo
    let isUpdate = file ? true : false

    // split stream
    return new Promise((resolve, reject) => {
        var Splitter = Stream.PassThrough;
        var upload = new Splitter;
        req.pipe(upload, {
            end: true
        });
        req.once('data', function (chunk) {
            var fileType = ft(chunk);
            var allowedFileTypes = ["jpg", "png", "gif", "webp", "tif", "bmp", "psd", "zip", "tar", "rar", "gz", "bz2", "7z", "mp4", "m4v", "mid", "mkv", "webm", "mov", "avi", "wmv", "mpg", "mp3", "m4a", "ogg", "flac", "wav", "pdf", "epub", "rtf", "woff", "woff2", "ttf", "otf"];

            allowedFileTypes = ["jpg", "png", "gif", "webp", "tif", "bmp"]

            console.log('FILE TYPE', fileType)
            // fileType = {"ext":"wav","mime":"audio/x-wav"}
            if (fileType && fileType.ext && allowedFileTypes.indexOf(fileType.ext) != -1) {

                // base dir for attachments
                var attachmentsDir = api.attachments.path;

                // create sub-directories if if they don't already exist
                if (!fs.existsSync(attachmentsDir)) {
                    fs.mkdirSync(attachmentsDir);
                }
                var filePath = attachmentsDir + '/' + type
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath);
                }

                // generate file id and file name
                var fileId = req.params.fileId || uuid.v1();
                var fileName = req.params.id + "_" + fileId + "." + fileType.ext;

                // remove the file if already exists
                if (fs.existsSync(filePath + '/' + fileName)) {
                    fs.unlinkSync(filePath + '/' + fileName);
                }

                // write the file to disk
                var wstream = fs.createWriteStream(filePath + '/' + fileName, {
                    flags: 'w'
                });
                upload.pipe(wstream, {
                    end: true
                })

                console.log(type, 'Uploading:', fileName);
                wstream.on('finish', function () {
                    console.log(type, 'Uploaded:', fileName);
                    file = file || {}
                    var fileInfo = {
                        ...file,
                        ...{
                            "URL": "/" + type + "/" + req.params.id + "/attachment/" + fileId,
                            "ext": fileType.ext,
                            "mime": fileType.mime,
                            "nameId": fileName,
                            "attachId": fileId
                        }
                    }
                    //fileInfo.modified = new Date()
                    //if(!isUpdate) fileInfo.created = new Date()

                    // add more file metadata from query
                    var saveFromQuery = ["title", "caption", "latlon", "location", "description", "url", "name", "body", "subtitle", "license", "userField", "order"]
                    if (saveFromQuery && saveFromQuery.length > 0) {
                        for (var i in saveFromQuery) {
                            var qname = saveFromQuery[i],
                                val;
                            if (req && req.query && req.query[qname]) {
                                val = req.query[qname];
                                if (val === "true") {
                                    val = true;
                                }
                                if (val === "false") {
                                    val = false;
                                }
                                fileInfo[qname] = val;
                            }
                        }
                    }
                    fileInfo.owner = ownerId || req.params.id

                    //console.log('TO UPDATE', JSON.stringify(fileInfo, null, 2))

                    // create/update file metadata for this document
                    if(isUpdate){
                        let id = fileInfo.id
                        delete fileInfo.id
                        api.store.update("file", [{
                            id:id,
                            replace: fileInfo
                        }]).then(resp => resolve({
                            body: resp
                        })).catch(err => {
                            return resolve({
                                status: 400,
                                body: {
                                    status: 400,
                                    message: err.message
                                }
                            })
                        })
                    }else{
                        api.store.create("file", fileInfo).then(resp => {
                            // type, fieldName, ownerId
                            if(req.params.id && type && fieldName){
                                // update type / req.params.id set fieldName = resp.payload.records[0].id
                                let file = resp.payload.records[0]
                                let push = {}
                                push[fieldName] = file.id

                                api.store.update(type, {
                                    id: req.params.id,
                                    push:push
                                }, null, {nofilter:true}).then(resp2 => resolve({
                                    headers:{'Content-type':'application/json'},
                                    body: resp
                                })).catch(err => {
                                    return resolve({
                                        status: 400,
                                        body: {
                                            status: 400,
                                            message: err.message
                                        }
                                    })
                                })
                            }else{
                                resolve({
                                    headers:{'Content-type':'application/json'},
                                    body: resp
                                })
                            }
                        }).catch(err => {
                            return resolve({
                                status: 400,
                                body: {
                                    status: 400,
                                    message: err.message
                                }
                            })
                        })
                    }
                })
            } else {
                //req.destroy();
                return resolve({
                    status: 400,
                    body: {
                        "status": 400,
                        "message": "File type not allowed",
                        "details": fileType
                    }
                })
            }
        })
    })
}
attachments.read = function(req, res, ses, api, type){
    let inst = attachments
    let file = req.fileInfo
    let filePath = [api.attachments.path, type, file.nameId].join('/')
    let maxAge = 0

    // get the file size
    var fileSize = inst.getFilesizeInBytes(filePath)

    // headers
    let headers = {
        'Content-Type': file.mime,
        'Content-Length': fileSize,
        'Access-Control-Expose-Headers': 'Content-Extension',
        'Content-Extension': file.ext,
        'Cache-Control': 'public, max-age=' + maxAge,
        'Content-Disposition': 'attachment; filename=' + file.nameId
    }
    res.writeHead(200, headers)
    return new Promise((resolve, reject) => {
        // stream the file
        var rstream = fs.createReadStream(filePath);
        rstream.pipe(res, { end: true })
        rstream.on('error', function(err) {
            return resolve({
                status:400,
                message: err.message
            })
        })
        rstream.on('end', () => {
            resolve(null)
        });
    })

}
attachments.delete = function(req, res, ses, api, type){
    let file = req.fileInfo
    let filePath = [api.attachments.path, type, file.nameId].join('/')
    // delete the file
    return new Promise((resolve, reject) => {
        if(!file) return resolve({status:400, body:{message:"Attachment to delete not specified"}})
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                // delete the record
                api.store.delete("file", [file.id]).then(resp => resolve({
                    body: {message:"Successfully deleted the attachment", deleted:true}
                })).catch(err => {
                    return resolve({
                        status: 400,
                        body: { status: 400, message: err.message, deleted:false}
                    })
                })
            } catch (err) {
                return resolve({status:400, body:{message:err.message, deleted:false}})
            }
        }else{
            return resolve({status:404, body:{message:"Attachment does not exist"}})
        }
    })
}
attachments.update = function(req, res, ses, api, type){
    if(!req.fileInfo) return Promise.resolve({status:400, body:{message:"Attachment to update not specified"}})
    return attachments.create(req, res, ses, api, type)
}
attachments.getFilesizeInBytes = function(filename) {
    var stats = fs.statSync(filename)
    return stats.size
}

module.exports = attachments