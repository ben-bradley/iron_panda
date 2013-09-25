/*** REQUIRED CHANNEL !!!
	Channels are what are set up to act as busses among the hubs.
	Each channel has a name and events.  Each event is passed the server object
	so that each callback can process actions elsewhere on the bus.
***/

module.exports = {
	name: 'admin',
	events: [
		{
			// this is the default socket.io 'connection' event handler
			trigger: 'connection',
			callback: function(socket, server) { 
				// a new hub/generator/processor has connected to /admin
				console.log('New Connection to /admin');
				
				socket.on('localConnected', function() {
					socket._isLocal = true;
					console.log('LOCAL CONNECTED');
				});
				
				socket.on('remoteConnected', function(remotePort) {
					socket._isRemote = true;
					var hubs = server._config._json.hubs,
							remoteIp = socket.handshake.address.address;
					for (var i = hubs.length-1; i >= 0; i--) {
						if (hubs[i].match(/localhost/)) { hubs.splice(i, 1); } // strip out the localhost entry
						else if (hubs[i].match(remoteIp)) { hubs.splice(i, 1); } // strip out the remote host IP
					}
					console.log('---------------------------');
					console.log('emitting hubs:');
					console.log(hubs);
					console.log('---------------------------');
					socket.emit('hubsList', hubs);
					server._config.add('hubs', remoteIp+':'+remotePort);
					console.log('REMOTE CONNECTED, hubs now:');
					console.log(server._config._json.hubs);
				});
				
				socket.emit('connected');
			}
		}
	]
};