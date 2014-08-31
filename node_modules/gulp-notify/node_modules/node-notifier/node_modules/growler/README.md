
Node Growler
============
A [Growl][1] server for [node.js][2] which sends notifications to remote and
local Growl clients using [GNTP][3]. Could for example be used to notify you when
something happens on your node.js server, e.g. a user just logged in.

Installation
------------
	npm install growler

Dependencies
------------
* node.js >= 0.6
* [Underscore.js][4] >=1.1.5

Usage
-----
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

Also, check the examples directory.

Features
--------
* Custom notification icons
* Send notifications to password protected clients over the network
* Send encrypted notifications (not supported yet by Growl for OS X)

Author and license
------------------
Node Growler, Copyright 2011, Didrik Nordström

Dual licensed under the MIT or GPL Version 3 licenses.

[1]:	http://growl.info/
[2]:	http://nodejs.org/
[3]:	http://www.growlforwindows.com/gfw/help/gntp.aspx
[4]:	http://documentcloud.github.com/underscore/
