// Shows a simple Growl notification on the local machine

var growler = require('growler');
var myApp = new growler.GrowlApplication('Simple Growl App');
myApp.setNotifications({
  'Server Status': {}
});
myApp.register();
myApp.sendNotification('Server Status', {
  title: 'Node Growler online',
  text: 'Wasn\'t that hard was it?'
});
