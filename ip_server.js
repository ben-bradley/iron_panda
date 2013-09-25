var Server = require('./classes/Server');

var server = new Server({ port: 8087 });

server.start();


//
//server.channels['/control'].on('connection', function(socket) {
//	console.log('CONNECTION');
//	socket.emit('connected');
//});



//// simple io server for testing
//var io = require('socket.io').listen(8087);
//
//var controlChannel = io.of('/control');
//
//controlChannel.on('connection', function(socket) {
//	console.log('CONNECTION');
//	socket.emit('connected');
//});
