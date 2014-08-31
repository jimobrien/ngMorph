// Shows two Growl notification on the local machine

var growler = require('growler'),
    fs = require('fs');

// Create a Growl application
var myApp = new growler.GrowlApplication('Advanced Growl App', {
  // hostname: 'my.example.org', // IP or DNS
  // port: 23053, // Default GNTP port
  // timeout: 5000, // Socket inactivity timeout
  icon: fs.readFileSync('nodejs.png'), // Buffer
  additionalHeaders: {
    'X-Foo': 'bar' // Additional GNTP headers sent on all requests
  }
}, {
  // password: 'abc123', // Password is set in the Growl client settings
  // hashAlgorithm: 'SHA512', // MD5, SHA1, SHA256 (default), SHA512
  // encryption: 'AES' // AES, DES or 3DES, by default no encryption
});

myApp.setNotifications({
  'Server Status': {
    // icon: null, // Overridable
    displayName: 'The Server\'s current status',
    // enabled: true // If the notification should be enabled by default
  },
  'User Notice': {} // Another notification "class"
});

// Must register to send messages
myApp.register(function(success, err) {
  if (!success)
    throw err;
  // Wait for register to complete before sending notifications
  myApp.sendNotification('Server Status', {
    title: 'Node Growler online',
    text: 'Wasn\'t that hard was it?'
  });
  myApp.sendNotification('User Notice', {
    title: 'Reactor Overheated',
    text: 'The pressure in the reactor is reaching critical levels',
    sticky: true, // Stay on screen
    priority: 2, // Critical
    icon: fs.readFileSync('radioactivity.png') // Override
  }, function(success, err) { // Callback
    if (success)
      console.log('The important notification was shown to the user');
    else {
      console.log('Warning! The important notification was not shown to the user');
      throw err;
    }
  });
});

// Print the requests and responses for debugging purposes
myApp.on('request', function(msg) {
  console.log('== SENDING ==');
  console.log(msg);
});

myApp.on('response', function(msg) {
  console.log('== RESPONSE ==');
  console.log(msg);
});
