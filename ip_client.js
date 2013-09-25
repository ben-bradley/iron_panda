var ClientControl = require('./classes/ClientControl');

var clientControl = new ClientControl({ ip: '127.0.0.1', port: 8087 });

clientControl.connect();

clientControl.io.on('connected', function() { console.log('YAY!'); });
//
//clientControl.io.on('connected', function() {
//	console.log('CONNECTED');
//	console.log(arguments);
//});

//
//var channels = {
//	admin: io.connect('http://web-2-test.integra.engr:8087/admin')
//};
//
//// handle 'connected' messages for this client
//channels.admin.on('connected', function() {
//	console.log('I just connected');
//});
//
//// handle 'newConnection' messsages every time a client (including this one) connects
//channels.admin.on('newConnection', function() {
//	console.log('someone else just connected');
//});
//
//// handle when the bus sends spam
//channels.admin.on('spam', function(spam) {
//	console.log('got spam: '+spam.timer);
//});
//
//// handle when the bus forwards spam from another client
//channels.admin.on('clientSpammed', function(spam) {
//	console.log('another client spammed: '+spam.timer);
//});
//
//var spam = 0,
//		rand = 0;
//
//spammer();
//
//function spammer() {
//	rand = Math.floor((Math.random() * 10 + 1) * 1000); // random number between 0 and 10
//	spam = setTimeout(function() {
//			console.log('spamming: { timer: '+rand+' }');
//			// send spam to the bus
//			channels.admin.emit('clientSpam', { timer: rand });
//			clearTimeout(spam);
//			spammer();
//		},
//		rand
//	);
//}