var Events = require('./Events'),
		Client = require('./Client'),
		ioClient = require('socket.io-client');

module.exports = Events.extend({
	
	init: function(config) {
		var self = this;
		
		this._config = config;
		this.clientList = [];
		
		this._config.on('newHub', function(hub) { self.startOne(hub); })
		
	},
	
	startAll: function() {
		var self = this;
		this._config.json.hubs.forEach(function(hub) { self.startOne(hub); })
	},
	
	startOne: function(hub) {
		var self = this;
		
		var client = new Client(this._config, hub);
		
		client.on('gotServerId', function(id) {
			var alreadyConnected = false;
			self.clientList.forEach(function(c) {
				if (c.serverId == id) { alreadyConnected = true; }
			});
			if (alreadyConnected == true) { client.disconnect(); }
			else {
				self.clientList.push(client);
				client.connected();
			}
		});
		
		// start the ioclient
//		var client = ioClient.connect(hub.socketio, { query: 'secret='+this._config.json.secret });
//		
//		// handle the initial connection
//		client.on('connected', function(data) {
//			
//			var alreadyConnected = false;
//			
//			for (var c in self.clientList) {
//				if (self.clientList[c].serverId == data.id) { alreadyConnected = true; }
//			}
//			
//			if (alreadyConnected === true){
//				client.disconnect();
//			}
//			else {
//				
//				// connect to all the new hubs
//				self._config.syncHubs(data.hubs);
//				
//				// tell the server that we accept the connection & send details
//				client.emit('connected', {
//					id: self._config.id,
//					hubs: self._config.json.hubs,
//					ioPort: self._config.json.ioPort,
//					expressPort: self._config.json.expressPort
//				});
//				
//				// join the control room
//				client.emit('join', { rooms: [ 'control' ] });
//				
//				// make it possible to output json for this client
//				client.toJSON = _clientToJSON;
//				
//				// SAMPLE: get data from a remote hub/server and display it in this UI
//				client.getRooms = _clientGetRooms;
//				
//				// put the client in the clientList array
//				client.serverId = data.id;
//				client.serverAddress = hub.socketio;
//				self.clientList.push(client);
//				
//			}
//		});
//		
//		client.on('disconnect', function() {
//			console.log('****************************');
//			console.log('client.disconnected()');
////			self.stopOne(client);
//		});
		
	},
	
//	stopOne: function(client) {
//		var self = this;
//		
//		// disconnect the io
////		client.disconnect();
//		
//		// remove the client from the list
//		for (var c = self.clientList.length-1; c >= 0; c--) {
//			if (self.clientList[c].serverId == client.serverId) {
//				self.clientList.splice(c, 1);
//			}
//		}
//		
//		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
//		console.log(self.clientList.length);
//		
//		delete client;
//		
//	},
	
	// return either the client list or a single client if an ID is provided
	clients: function(id) {
		if (id) {
			var client = {};
			this.clientList.forEach(function(c) { if (c.serverId == id) { client = c; } });
			return client;
		}
		return this.clientList;
	}
	
});

//// private fn to convert a client to JSON for UI lovin'
//// 'this' is the client
//var _clientToJSON = function(callback) {
//	var json = {
//		serverId: this.serverId,
//		serverAddress: this.serverAddress,
//		open: this.socket.open,
//		connected: this.socket.connected,
//		sessionid: this.socket.sessionid
//	};
//	if (callback) { callback(json); }
//	else { return json; }
//}
//
//// private fn to get room data from the remote & show it locally
//var _clientGetRooms = function(callback) {
//	this.once('gotRooms', function(data) { callback(data); })
//	this.emit('getRooms');
//}