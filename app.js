/* var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var fs = require('fs');
var express = require('express');
var https = require('https');
var http = require('http');
var key = fs.readFileSync('key.pem');
var cert = fs.readFileSync('mycert.pem')
var https_options = {
    key: key,
    cert: cert
};
console.log("key?>>>>>>>>>",key);
console.log("cert?>>>>>>>>>",cert);

var httpsPort = 8000;
var httpport = process.env.PORT || 7000;
var HOST = 'localhost';
var path = require('path');
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname + '/')));
app.use('/root', express.static(path.join(__dirname + '/root')));
app.use('/root/index.html', express.static(path.join(__dirname + '/root/index.html')));

https.createServer(https_options, app).listen(httpsPort,function(req,res){
console.log("Catch the action at https://localhost:"+httpsPort);
});

http.createServer(app).listen(httpport,function(req,res){
console.log("Catch the action at http://localhost:"+httpport);
});
app.get('/', function (req, res) {
   
    res.sendFile( __dirname + "/" +"/root" +"/index.html" );
})

app.post('/saveUser', function (req, res) {
       
   res.send("Successfully");
}) */


/* app.listen(3005, function () {
    console.log('Example app listening on port 3005!');
  }) */
  
  
  
  
  
  
  
  
  
var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var fs = require('fs');
var express = require('express');
var http = require('http');
var https = require('https');

 var path = require('path');
 var key = fs.readFileSync('privateKey.pem');
 var cert = fs.readFileSync('certificate.pem');


var https_options = {
    key: key,
    cert: cert,
	passphrase: 'Welcome123!'
   
	
};
var httpsPort = 8444;
var httpport = process.env.PORT || 3009;

console.log("path",__dirname );
/* var privateKey = fs.readFileSync('key.pem');
var certificate = fs.readFileSync('mycert.pem');
 */
/* var credentials = crypto.createCredentials({key: https_options.privateKey, cert: https_options.certificate});

 */

/* var options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem')
}; */
//app.use(bodyParser.json());



app.use('/', express.static(path.join(__dirname + '/')));
app.use('/root', express.static(path.join(__dirname + '/root')));
app.use('/root/index.html', express.static(path.join(__dirname + '/root/index.html')));
app.get('/', function (req, res) {
   
    res.sendFile( __dirname + "/" +"/root" +"/index.html" );
})

https.createServer(https_options, app).listen(httpsPort,function(req,res){

console.log("Catch the action at https://localhost:"+httpsPort);
});

http.createServer(app).listen(httpport,function(req,res){
console.log("Catch the action at http://localhost:"+httpport);
});


/*tls.createServer(https_options, function (s) {
	console.log("ssss",s);
  s.write("welcome!\n");
  s.pipe(s);
}).listen(8000);
 var path = require('path');*/
/* var handler = function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}; */

/* var server = http.createServer();
server.setSecure(credentials);
server.addListener("request", handler);
server.listen(8000); */
  