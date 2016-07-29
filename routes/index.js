var express = require('express');
var router = express.Router();
var path = require('path');
var mime = require('mime');
var fs  = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/send_link', function(req, res, next) {
    var fs = require('fs');
    var youtubedl = require('youtube-dl');
    var video = youtubedl(req.body.link,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname });
 
        

  // Will be called when the download starts.
  video.on('info', function(info) {
    console.log('Download started');
    console.log('filename: ' + info.fulltitle);
    console.log('size: ' + info.size);
    video.pipe(fs.createWriteStream(path.join(__dirname + '/../public/downloads/') + info.fulltitle + '.mp4'));
  
    res.fileName = info.fulltitle;
  });
  video.on('end', function() {
        var file = path.join(__dirname + '/../public/downloads/') + res.fileName + '.mp4';
        var filename = path.basename(file);
        var mimetype = mime.lookup(file);

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
        setTimeout(function() {
        fs.exists(file, function(exists) {
            if(exists) {
              fs.unlink(file);
            } else {
            }
        });
        }, 1000);
});
  
});

router.get('/convert-pdf', function(req, res, next) {
  res.render('convert-pdf');
});
 
router.post('/send_doc', function(req, res,next) {

    var sampleFile,fileName,fullPathFileName,srcPath,destPath;
    console.log("---"+JSON.stringify(req.files,null,4));
    sampleFile = req.files.doc_file;
    fileName = req.files.sampleFile.name;
    srcPath = path.join(__dirname + '/../public/convert_src/');
    destPath = path.join(__dirname + '/../public/convert_dest/');
    fullPathFileName = srcPath + fileName;
        
    fs.readFile( req.files.sampleFile.path, function (err, data) {
       fs.writeFile(fileName, data, function (err) {
        if( err ){
             console.log( err );
        }else{
            response = {
                message:'File uploaded successfully',
                filename:req.files.sampleFile.name
            };
        }
        console.log( response );
        res.end( JSON.stringify( response ) );
       });
    });
});

module.exports = router;
