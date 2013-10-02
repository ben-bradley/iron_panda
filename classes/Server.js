/*
* The base server class.  It's like a collection for ServerChannels
*/

var Events = require('./Events'),
		io = require('socket.io');

var Server = Events.extend({
	
	init: function(config) {
		this._config = config;
		this.started = false;
	},
	
	start: function() {
		var self = this;
		
		if (this.started == true) { return false; }
		
		// start the server
		this.io = io.listen(this._config.json.ioPort);
		
		// set the authorization
		this.io.configure(function() {
			self.io.set('authorization', function(handshakeData, callback) {
				if (handshakeData.query.secret == self._config.json.secret) { callback(null, true); }
				else { callback(null, false); }
			});
		});
		
		// set the event handlers for each socket
		this.io.on('connection', function(socket) {
			var ip = socket.handshake.address.address;
			
			// send the 'serverData' event back to the client
			socket.emit('serverData', { id: self._config.id, hubs: self._config.json.hubs });
			
			// the client has accepted the connection
			socket.on('clientData', function(clientData) {
				
				// push this client info into the hubs & sync the client hubs with server hubs
				var clientHub = { socketio: ip+':'+clientData.ioPort, express: ip+':'+clientData.expressPort };
				clientData.hubs.unshift(clientHub);
				self._config.syncHubs(clientData.hubs);
				self.emit('clientConnected', clientHub);
				
				// set up the join/leave rooms
				socket.on('join', function(data) {
					data.rooms.forEach(function(room) {
						socket.join(room);
						socket.broadcast.to(room).emit('joined', ip);
						socket.emit('joined', room)
					});
				});
				socket.on('leave', function(data) {
					data.rooms.forEach(function(room) {
						socket.leave(room);
						socket.broadcast.to(room).emit('left', ip);
						socket.emit('left', room);
					});
				});
				
				// send the client the rooms list
				socket.on('getRooms', function() {
					socket.emit('gotRooms', self.io.rooms);
				});
				
				// set up the pub/sub for rooms
				socket.on('pub', function(data) {
					socket.broadcast.to(data.room).emit('pub', data.emit);
				});
				
			});
			
		});
		
		// emit the started event
		this.started = true;
		this.emit('started');
	},
	
	stop: function() {
		// stop listening for new connections
		this.io.server.close();
		
		// send all sockets the disconnect
		this.io.sockets.emit('disconnect');
		
		// stop it
		this.started = false;
		this.emit('stopped');
	}
	
});

module.exports = Server;