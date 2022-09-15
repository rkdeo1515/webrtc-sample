// 172.29.199.113:8080
var https = require('https');
var fs = require('fs');
var ws = require('ws');

var clients = []; 

const certinfo = {
    key: fs.readFileSync('./ssl-crt/key.pem'),
    cert: fs.readFileSync('./ssl-crt/cert.pem')
  };

function send404Message(response){
    response.writeHead(200,{'Content-Type':'text/html'});
    response.end('<h1>404 ERROR:</h1><p>Page not found..</p>');
}

function onRequest(request,response){
    if(request.method == 'GET' && request.url == '/'){
        response.writeHead(200,{'Content-Type':'text/html'});
        fs.createReadStream("./public/index.html").pipe(response);
        // response.end('Hello node.js!!');
    } else {
        send404Message(response);
    }
}

var server = https.createServer(certinfo, onRequest);

server.listen(8080, function(){ 
    console.log('Server is running...');
});

var wss_server = new ws.Server({server});

wss_server.on('connection', (ws, request)=>{

    // const id = Math.random().toString(36).slice(2);
    // clients[id] = ws;
    clients.push(ws);
    console.log("sessions: "+clients.length)
 
    // if(ws.readyState === ws.OPEN){
    // }
    
    ws.on('message', (msg)=>{
        clients.forEach(function (others) {
            if (others != ws)
                others.send(msg.toString());
        })
    })

    ws.on('error', (error)=>{
        // console.log(`ERROR [${ip}] : ${error}`);
        console.log(`ERROR : ${error}`);

    })

    ws.on('close', ()=>{
        console.log(`CLOSE CONNECTION`);
    })
});

//https://github.com/emannion/webrtc-audio-video/blob/master/app.js