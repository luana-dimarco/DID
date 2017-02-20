var http = require('http');
// URL module
var url = require('url');
var path = require('path');
var qs = require('querystring');
// Using the filesystem module
var fs = require('fs');

var server = http.createServer(handleRequest);
server.listen(8080);
var ragnatela_connection;

console.log('Server started on port 8080');

function handleRequest(req, res) {
    // What did we request?
    if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
            console.log(post);
            ragnatela_connection.emit("setpixelsColor", { a: 255, r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 });
            res.writeHead(200, { 'Content-Type': contentType });
            res.end("ciao");
        });
    } else {

        var pathname = req.url;

        // If blank let's ask for index.html
        if (pathname == '/') {
            pathname = '/index.html';
        }

        // Ok what's our file extension
        var ext = path.extname(pathname);

        // Map extension to file type
        var typeExt = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css'
        };

        // What is it?  Default to plain text
        var contentType = typeExt[ext] || 'text/plain';

        // User file system module
        fs.readFile(__dirname + pathname,
            // Callback function for reading
            function (err, data) {
                // if there is an error
                if (err) {
                    res.writeHead(500);
                    return res.end('Error loading ' + pathname);
                }
                // Otherwise, send the data, the contents of the file
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        );
    }
}


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
    // We are given a websocket object in our function
    function (socket) {
        ragnatela_connection = socket;
        console.log("We have a new client: " + socket.id);

        socket.on('disconnect', function () {
            console.log("Client has disconnected");
        });

        // function repeatTimeout() {
        //     socket.emit("setpixelsColor", { a: 255, r: Math.random()*255, g: Math.random()*255, b: Math.random()*255 });
        //     setTimeout(repeatTimeout, Math.random()*2000);
        // };

        // setTimeout(function() {
        //     repeatTimeout();
        // }, 2000);

    }
);

